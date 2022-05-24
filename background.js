// chrome.action.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ['content_script.js']
//   });
// });

chrome.tabs.onUpdated.addListener(function() {
    chrome.tabs.executeScript(null, { file: "content_script.js" });
});