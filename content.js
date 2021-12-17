localStorage.setItem('alerted','no');
localStorage.setItem('flag', 'unset');
console.log("Script starting...");

setInterval(function()  {         //Loop script every 3 seconds
console.log("Content script looping...");

/* Retrieve the pincode, suburb/city */
var pinCode = document.getElementById('ctl00_NewOrderControlModal_ContactEdit_Destination_RadComboBox_PostCode_Input').value; 
var suburb = document.getElementById('ctl00_NewOrderControlModal_ContactEdit_Destination_RadComboBox_Suburb_Input').value.toUpperCase(); 
var city = document.getElementById('ctl00_NewOrderControlModal_ContactEdit_Destination_TextBox_City').value.toUpperCase(); 

if (pinCode == "") {

  localStorage.setItem('flag', 'unset');

}

if (pinCode != "") {

    if ( (localStorage.getItem('flag') || '') != 'set') {
    
      if (pinCode == localStorage.getItem('alerted') || '')
      {
        localStorage.setItem('flag', 'set');
        const url = chrome.runtime.getURL('data/tolllist.json');
    
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
        var json = JSON.parse(this.response);

        json.forEach((item) => {
            if ((item.Pincode == pinCode) && ((item.Name.toUpperCase() == suburb) || (item.Name.toUpperCase() == city)))
            {
                var alerted = localStorage.getItem('alerted') || '';
                console.log("ALERTED: "+ alerted);
                alert("Toll RA surcharge! Suburb: " + item.Name + " | Cost: $" +item.Cost);
                localStorage.setItem('alerted', item.Pincode);

            }
          });
    };

                xhr.open('GET', chrome.extension.getURL('data/tolllist.json'), true);
                xhr.send();
      }
    }
  }

    /////////////////////////////
    console.log("The pin, suburb, city : "+ pinCode +" "+ suburb + " " +city); 

    const url = chrome.runtime.getURL('data/tolllist.json');
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var json = JSON.parse(this.response);

        json.forEach((item) => {
            if ((item.Pincode == pinCode) && ((item.Name.toUpperCase() == suburb) || (item.Name.toUpperCase() == city)))
            {
                var alerted = localStorage.getItem('alerted') || '';
                console.log("ALERTED: "+ alerted);
                if (alerted != item.Pincode) {
                   alert("Toll RA surcharge! Suburb: " + item.Name + " | Cost: $" +item.Cost);
                   localStorage.setItem('alerted', item.Pincode);
                   }
             }
          });
    };

    xhr.open('GET', chrome.extension.getURL('data/tolllist.json'), true);
    xhr.send();

},3000);
