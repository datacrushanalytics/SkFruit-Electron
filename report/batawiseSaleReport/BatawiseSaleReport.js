// Fetch data from API


document.addEventListener('DOMContentLoaded', function () {

    fetch('http://43.205.230.120/purchaseproductData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            populateDropdown1(data);
            populateDropdown(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


function populateDropdown(data) {
    var userNameDropdown = document.getElementById('product');
    userNameDropdown.innerHTML = ''; // Clear existing options

    // Create and append new options based on API data
    data.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item.product_name; // Set the value
        option.textContent = item.product_name; // Set the display text
        userNameDropdown.appendChild(option);
    });

    // Add a placeholder option
    var placeholderOption = document.createElement('option');
    placeholderOption.value = ""; // Set an empty value
    placeholderOption.textContent = "Select Product"; // Set placeholder text
    placeholderOption.disabled = true; // Disable the option
    placeholderOption.selected = true; // Select the option by default
    userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
}

function populateDropdown1(data) {
    var userNameDropdown = document.getElementById('bata');
    userNameDropdown.innerHTML = ''; // Clear existing options

    // Create and append new options based on API data
    data.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item.bata; // Set the value
        option.textContent = item.bata; // Set the display text
        userNameDropdown.appendChild(option);
    });

    // Add a placeholder option
    var placeholderOption = document.createElement('option');
    placeholderOption.value = ""; // Set an empty value
    placeholderOption.textContent = "Select Bata"; // Set placeholder text
    placeholderOption.disabled = true; // Disable the option
    placeholderOption.selected = true; // Select the option by default
    userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
}



function getElementValueWithDefault(id, defaultValue) {
    var element = document.getElementById(id);
    return element && element.value ? element.value : defaultValue;
}

function formatDate(dateString) {
    var date = new Date(dateString);
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
}



document.getElementById('loginForm1').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    var data = {
        from_date : formatDate(document.getElementById("fromdate").value),
        to_date : formatDate(document.getElementById("todate").value),
        product : getElementValueWithDefault('product', '*') , 
        bata : getElementValueWithDefault('bata', '*') 
    };
    console.log(data);

    fetch('http://43.205.230.120/batawiseSaleReport', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        console.log(result)
        populateTable4(result)
        // Optionally, you can redirect or show a success message here
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, you can display an error message here
    });
});


function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = [ 'bill_id','date','cust_name','address','mobile_no',"Sandharbh",'product','bata','mark', 'quantity','rate','price'  ];
    var counter = 1;
    console.log(data.reports)
    data.reports.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            if(key=='date'){
                console.log(item[key])
                var utcDate = new Date(item[key]);
                var options = { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    timeZone: 'Asia/Kolkata' 
                };
                cell.textContent = utcDate.toLocaleString('en-IN', options);
            
            }else{
            cell.textContent = item[key];
            }
        });
            // Add Info icon
            var infoCell = row.insertCell();
            var infoButton = document.createElement('button');
            infoButton.textContent = 'Info';
            infoButton.onclick = function () {
                console.log("Clicked")
                displayBarcodePopup(item);
            };
            infoCell.appendChild(infoButton);
    });
}


function displayBarcodePopup(item) {
    var barcodeValue = 'Product Name:' + item['product'] + ' \nBata:' + item['bata'];
    var popupContent = `
        <div class="popup">
            <h2>Barcode</h2>
            <canvas id="barcodeCanvas"></canvas>
            <button id="downloadButton">Download Barcode</button>
            <button onclick="closePopup()">Close</button>
        </div>
    `;
    document.getElementById('popupContainer').innerHTML = popupContent;
    JsBarcode('#barcodeCanvas', barcodeValue, {
        format: "CODE128", // Adjust the barcode format as needed
        displayValue: false, // Hide text under the barcode 
        width: 1 // Set the width of the bars
    });

        // Create a download link for the barcode image
var downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', function () {
    //var svg = document.getElementById('barcodeCanvas');
    var canvas = document.getElementById('barcodeCanvas');
    //var svgData = new XMLSerializer().serializeToString(svg);
    //var image = new Image();
    var image = canvas.toDataURL('image/png');
    //image.src = 'data:image/svg+xml;base64,' + btoa(svgData);

    // Trigger download
    var link = document.createElement('a');
    link.href = image;
    link.download = item['product_name'] + '_' + item['bata'] + '_barcode.png'; // Set the filename based on concatenated values
    //document.body.appendChild(link);
    link.click();
    //document.body.removeChild(link);
});

    
    document.querySelector('.popup').style.display = 'block';
}



function closePopup() {
    document.querySelector('.popup').style.display = 'none';
}















