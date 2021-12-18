// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
let inputBox = document.getElementById("textbox");
let addButton = document.getElementById("add-button");

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
						addButton.disabled = false;
          }
			else {
						addButton.disabled = true;
					 }
  });

	// Add button click handler
	addButton.addEventListener("click", () => {
		// Disable the button
		addButton.disabled = true;
		
		// Empty the input box value
		inputBox.value = "";



	})