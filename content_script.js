let cachedTerms = [];
const elementsWithTextContentToSearch = "a, p, h1, h2, h3, h4, h5, h6";
const containerElements = "span, div, li, th, td, dt, dd";

// Every time a page is loaded, check our spoil terms and block
chrome.storage.sync.get(["spoilerArray"], (result) => {
  // Don't manipulate page if user hasn't entered any terms
  if (!result.spoilerArray) {
    return;
  }

  enableMutationObserver();

  cachedTerms = result.spoilerArray;
  blockSpoilerContent(document, result.spoilerArray, "[Spoiler Alert!]");
});

function blockSpoilerContent(rootNode, spoilerTerms, blockText) {
  // Search innerHTML elements first
  let nodes = rootNode.querySelectorAll(elementsWithTextContentToSearch);
  replacenodesWithMatchingText(nodes, spoilerTerms, blockText);

  // Now find any container elements that have just text inside them
  nodes = findContainersWithTextInside(rootNode);
  if (nodes && nodes.length !== 0) {
    replacenodesWithMatchingText(nodes, spoilerTerms, blockText);
  }
}

function replacenodesWithMatchingText(nodes, spoilerTerms, replaceString) {
  nodes = Array.from(nodes);
  nodes.reverse();
  for (const node of nodes) {
    for (const spoilerTerm of spoilerTerms) {
      if (compareForSpoiler(node, spoilerTerm)) {
        if (!node.parentNode || node.parentNode.nodeName === "BODY") {
          // Ignore top-most node in DOM to avoid stomping entire DOM
          continue;
        }
        node.className += " hidden-spoiler";
        node.textContent = replaceString;
        blurNearestChildrenImages(node);
      }
    }
  }
}

function compareForSpoiler(nodeToCheck, spoilerTerm) {
  const regex = new RegExp(spoilerTerm, "i");
  return regex.test(nodeToCheck.textContent);
}

function blurNearestChildrenImages(nodeToCheck) {
  // Traverse up a level and look for images, keep going until either
  // an image is found or the top of the DOM is reached.
  // This has a known side effect of blurring ALL images on the page
  // if an early spoiler is found, but ideally will catch the nearest images
  let nextParent = nodeToCheck;
  let childImages;
  const maxIterations = 3;
  let iterationCount = 0;
  do {
    nextParent = nextParent.parentNode;
    if (nextParent && nextParent.nodeName !== "BODY") {
      childImages = nextParent.parentNode.querySelectorAll("img");
    }
    iterationCount++;
  } while (
    nextParent &&
    childImages.length === 0 &&
    iterationCount < maxIterations
  );

  // Now blur all of those images found under the parent node
  if (childImages && childImages.length > 0) {
    for (const image of childImages) {
      image.className += " blacked-out";
    }
  }
}

function findContainersWithTextInside(targetNode) {
  const containerNodes = targetNode.querySelectorAll(containerElements);
  const emptyNodes = [];
  for (const containerNode of containerNodes) {
    const containerChildren = containerNode.childNodes;
    for (const containerChild of containerChildren) {
      if (containerChild.textContent) {
        emptyNodes.push(containerChild.parentNode);
      }
    }
  }
  return emptyNodes;
}

function applyBlurCSSToMatchingImages(nodes, spoilerTerms) {
  for (const node of nodes) {
    for (const spoilerTerm of spoilerTerms) {
      const regex = new RegExp(spoilerTerm, "i");
      if (
        regex.test(node.title) ||
        regex.test(node.alt || regex.test(node.src) || regex.test(node.name))
      ) {
        node.className += " blurred";
        node.parentNode.style.overflow = "hidden";
      }
    }
  }
}

function enableMutationObserver() {
  // Detecting changed content using Mutation Observers
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver?redirectlocale=en-US&redirectslug=DOM%2FMutationObserver
  // https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  const observer = new MutationObserver((mutations, observer) => {
    // Fired when a mutation occurs
    // console.log(mutations, observer);
    for (const mutation of mutations) {
      blockSpoilerContent(mutation.target, cachedTerms, "[Spoiler Alert!]");
    }
  });

  // Configuration of the observer:
  const config = { attributes: true, subtree: true };
  // Turn on the observer, unfortunately we target the entire document
  observer.observe(document, config);
  // Disconnecting likely won't work since we need to continuously watch
  // observer.disconnect();
}
