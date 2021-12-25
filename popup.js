// Initialize button with user's preferred color
// let changeColor = document.getElementById("changeColor");
let inputBox = document.getElementById("textbox")
let addButton = document.getElementById("add-button")
let deleteButton = document.getElementById("delete-button")
var spoilerTerms = []
var terms

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color
})

// When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: setPageBackgroundColor,
//     });
//   });
  
//   // The body of this function will be executed as a content script inside the
//   // current page
//   function setPageBackgroundColor() {
//     chrome.storage.sync.get("color", ({ color }) => {
//       document.body.style.backgroundColor = color;
//     });
//   }

// Remove disabled property from 'Add' button when text input box is not empty
inputBox.addEventListener("input", () => {
	if (  inputBox.value &&                   // if it exist AND
		  inputBox.value.length > 0 &&        // if value have one charecter at least
		  inputBox.value.trim().length > 0)   // if value is not just spaces
	{
		addButton.disabled = false
	}
	else  
	{ 
		addButton.disabled = true
	}
})

// Add button click handler
addButton.addEventListener("click", async () => {
	
	// Disable the button
	addButton.disabled = true

	// Get the new spoiler term and push into the array
	spoilerTerms.push(inputBox.value)

	// Replace with the new array
	await chrome.storage.sync.set({'spoilerArray': spoilerTerms })
	
	// Empty the input box value
	inputBox.value = ""

	getSpoilerTerms()

})

function getSpoilerTerms() {
	chrome.storage.sync.get(['spoilerArray'], (result) => {
		// Nothing to change.
		if (!result.spoilerArray)
			return

		terms = result.spoilerArray;
		alert(JSON.stringify(terms))
		let parsedArray = JSON.parse(JSON.stringify(terms))
		// alert(parsedArray.length)
		})
}

function main() {
	chrome.storage.sync.get(['spoilerArray'], (result) => {
		// Nothing to change.
		if (!result.spoilerArray)
			return
		
		// Initialize spoilerTerms with existing spoiler terms
		spoilerTerms = result.spoilerArray

		// Populate HTML
		populateWithSpoilerTerms()

	})		
}

function populateWithSpoilerTerms() {
	
	// Populate the ul with spoiler terms list
	spoilerTerms.forEach(item => {

		var listItem = document.createElement("li")

		// and give it some content
		const newContent = document.createTextNode(item);

		// add the text node to the newly created div
		listItem.appendChild(newContent);
	  

		document.getElementById("spoiler-terms-list")
				.appendChild(listItem)
		// alert(listItem.innerHTML)
		
	})

}

deleteButton.addEventListener("click", () => {
	clearAll()
})

function clearAll() {
	chrome.storage.sync.set({'spoilerArray': []})
	spoilerTerms = []
}

document.addEventListener('DOMContentLoaded', function () {
	main()
})