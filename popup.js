// Initialize button with user's preferred color
// let changeColor = document.getElementById("changeColor");
let inputBox = document.getElementById("textbox")
let addButton = document.getElementById("add-button")
// let deleteButton = document.getElementById("delete-button")
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

	// Repopulate the HTML list
	constructorFunction()

})

// Don't need the below function for now
function getSpoilerTerms() {
	chrome.storage.sync.get(['spoilerArray'], (result) => {
		// Nothing to change.
		if (!result.spoilerArray)
			return

		terms = result.spoilerArray;
		// alert(JSON.stringify(terms))
		let parsedArray = JSON.parse(JSON.stringify(terms))
		// alert(parsedArray.length)
		})
}

function populateWithSpoilerTerms() {

	// Delete the existing list
	document.getElementById('spoiler-terms-list').innerHTML = ""
	
	// Populate the ul with spoiler terms list
	spoilerTerms.forEach( (item, index) => {

		var listItem = document.createElement("li")

		// Assign the spoiler text
		const textSpan = document.createElement("span")
		textSpan.textContent = spoilerTerms[index]

		// Add the text span to the li
		listItem.appendChild(textSpan)

		// Create a hyperlink button
		const deleteButton = document.createElement("a")

		// Create delete icon and append
		const deleteIcon = document.createElement("i")
		deleteIcon.className = "far fa-trash-alt remove-btn-icon"
		deleteButton.appendChild(deleteIcon)
		deleteButton.id = index

		// Add a listener to delete spoiler terms
		deleteButton.addEventListener("click", () => {
			deleteSpoilerTerm(index)
		}) 
		
		// Append Delete button to li
		listItem.appendChild(deleteButton)

		document.getElementById("spoiler-terms-list")
				.appendChild(listItem)
		
	})

}

function deleteSpoilerTerm(index) {
	
	// Remove 1 spoiler term from index position
	spoilerTerms.splice(index, 1)

	// Reset the storage array
	chrome.storage.sync.set({'spoilerArray': spoilerTerms }, () => {
		constructorFunction()
	})
}

// deleteButton.addEventListener("click", () => {
// 	clearAll()
// })

function clearAll() {
	chrome.storage.sync.set({'spoilerArray': []})
	spoilerTerms = []
}

function constructorFunction() {
	chrome.storage.sync.get(['spoilerArray'], (result) => {
		// Nothing to change.
		if (!result.spoilerArray) {
			return
		}

		// Initialize spoilerTerms with existing spoiler terms
		spoilerTerms = result.spoilerArray

		// Populate HTML
		populateWithSpoilerTerms()
		
		// Display or not the the fallback text when no spoiler terms are added
		if (spoilerTerms.length == 0) {
			document.getElementById("no-spoiler-terms-fallback").style.display = "block"
			document.getElementById("added-keywords-container").style.display = "none"
		}

		else {
			document.getElementById("no-spoiler-terms-fallback").style.display = "none"
			document.getElementById("added-keywords-container").style.display = "flex"
		}

	})
	// Call function to hide the DOM nodes with the text
	hideSpoilerTerms();
}

async function hideSpoilerTerms() {
		// Get the current active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

		// Execute the script i.e run the function
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: hideDomNodes,
    });
}

  function hideDomNodes() {
      document.body.style.backgroundColor = 'red';

  }

document.addEventListener('DOMContentLoaded', function () {
	constructorFunction();
})