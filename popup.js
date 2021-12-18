// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
let inputBox = document.getElementById("textbox")

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPageBackgroundColor,
    });
  });
  
  // The body of this function will be executed as a content script inside the
  // current page
  function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
      document.body.style.backgroundColor = color;
    });
  }

  // Remove disabled property from 'Add' button when text input box is not empty
  inputBox.addEventListener("input", () => {
      if (  inputBox.value &&                   // if it exist AND
            inputBox.value.length > 0 &&        // if value have one charecter at least
            inputBox.value.trim().length > 0)   // if value is not just spaces
          {
						document.getElementById("add-button").disabled = false;
          }
			else {
						document.getElementById("add-button").disabled = true;
					 }
  });