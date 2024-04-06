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



document.getElementById('loginForm1').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    var data = {
        from_date: formatDate(document.getElementById("fromdate").value),
        to_date: formatDate(document.getElementById("todate").value),
        product: getElementValueWithDefault('product', '*'),
        bata: getElementValueWithDefault('bata', '*')
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
    var columnsToDisplay = ['bill_id', 'date', 'cust_name', 'address', 'mobile_no', "Sandharbh", 'product', 'bata', 'mark', 'quantity', 'rate', 'price'];
    var counter = 1;
    console.log(data.reports)
    data.reports.forEach(function (item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function (key) {
            var cell = row.insertCell();
            if (key == 'date') {
                console.log(item[key])
                var utcDate = new Date(item[key]);
                var options = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    timeZone: 'Asia/Kolkata'
                };
                cell.textContent = utcDate.toLocaleString('en-IN', options);

            } else {
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

        // Add button to open popup
        var buttonCell = row.insertCell();
        var openPopupButton = document.createElement('button');
        openPopupButton.className = 'button';
        openPopupButton.textContent = 'Bill';
        openPopupButton.addEventListener('click', function () {
            openModal(item); // Pass the data item to the openPopup function
        });
        buttonCell.appendChild(openPopupButton);



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



function openModal(item) {
    // Your code to open the modal with the data from 'item'
    console.log("Opening modal for item:", item.bill_id);
    

    fetch('http://43.205.230.120/bill/' + item.bill_id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            console.log(data)

            var utcDate = new Date(data.results[0].date);
            var options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'Asia/Kolkata'
            };


            var tableBody = document.getElementById("TableBody");
            tableBody.innerHTML = ""; // Clear existing rows

            var billDetails = [
                { label: "बिल क्र.:", value: item.bill_id },
                { label: "तारीख:", value: utcDate.toLocaleString('en-IN', options) },
                { label: "ग्राहकाचे नाव:", value: data.results[0].cust_name },
                { label: "संपर्क क्र.:", value: data.results[0].mobile_no },
                { label: "पत्ता:", value: data.results[0].address },
                // Add other bill details similarly
            ];

            billDetails.forEach(function (detail) {
                var row = document.createElement("tr");
                row.innerHTML = `
                        <td><b>${detail.label}</b></td>
                        <td>${detail.value}</td>
                    `;
                tableBody.appendChild(row);
            });


            var tablefooter = document.getElementById("tablefooter");
            tablefooter.innerHTML = ""; // Clear existing rows

            var footerDetails = [
                { label: "गेलेले कॅरेट : +", value: data.results[0].carate_amount },
                { label: "चालू कलम रक्कम:", value: data.results[0].amount },
                { label: "मागील बाकी:", value: data.results[0].pre_balance },
                { label: "एकूण रक्कम:", value: data.results[0].total_amount },
                { label: "रोख जमा रक्कम:", value: data.results[0].cash },
                { label: "ऑनलाईन जमा रक्कम:", value: data.results[0].online_amt },
                { label: "सूट रक्कम:", value: data.results[0].discount },
                { label: "जमा कॅरेट:   -", value: data.results[0].inCarat },
                { label: "आत्ता पर्यंतचे येणे बाकी:", value: data.results[0].balance },
                // Add other bill details similarly
            ];

            footerDetails.forEach(function (detail) {
                var row = document.createElement("tr");
                row.innerHTML = `
                    <td align="right" colspan="6"><font color="black">${detail.label}</font></td>
                    <td align="right" colspan="1"><font color="black">${detail.value}</font></td>
                    `;
                tablefooter.appendChild(row);
            });

            // Populate table with fetched data
            var itemsTableBody = document.getElementById("itemsTableBody");
            itemsTableBody.innerHTML = ""; // Clear existing rows
            var columnsToDisplay = ['bata', 'product', 'quantity', 'rate', 'price'];
            var counter = 1;
            data.products.forEach(function (item) {
                var row = itemsTableBody.insertRow();
                var cell = row.insertCell();
                cell.textContent = counter++;
                columnsToDisplay.forEach(function (key) {
                    var cell = row.insertCell();

                    cell.textContent = item[key];
                });
            });


        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Create a modal element
    var modal = document.createElement('div');
    modal.className = 'modal';

    // Create modal content
    var modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    // Add close button
    var closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function () {
        modalContent.innerHTML = '';
        modal.style.display = 'none'; // Close the modal when close button is clicked
    };
    modalContent.appendChild(closeButton);
   

    // Add item data to modal content
    var itemData = document.createElement('div');
    itemData.innerHTML = `
        <style>        
        .header {
            background-color: #f9f9f9;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .header .logo {
            width: auto; /* Adjust as needed */
            margin-right: 20px; /* Adjust as needed */
        }
        .header .logo img {
            height: 80px; /* Adjust as needed */
        }
        .header .details {
            width: 80%; /* Adjust as needed */
            text-align: right;
        }
        .header h1, .header p {
            margin: 5px 0;
            font-size: 16px;
        }


        .container2 {
            max-width: 600px;
            margin: 0 auto;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 12px; /* Adjust font size */
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 6px; /* Adjust padding */
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-weight: bold;
        }
        .details {
            text-align: center;
            margin-top: 10px;
        }

        /* CSS styles for the print button */
.header-details button {
    padding: 10px 20px;
    background-color: #808080;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}


@media print {
    .details, .header-details, .close{
        display: none; /* Hide the print button and header details when printing */
    }
}
        </style>
        <div class="header">
        <div class="logo">
            <img src="../../assets/img/logo.png" alt="Company Logo">
        </div>
        <div >
            <h1>सावता फ्रुट सप्लायर्स</h1>
            <p>ममु.पोस्ट- काष्टी ता.- श्रीगोंदा, जि. अहमदनगर - 414701</p>
            <p>मोबाईल नं:- 9860601102 / 9175129393/ 9922676380 / 9156409970</p>
        </div>
    </div>
    <div class="container2">

        <!-- Bill details -->
        <table>
            <tbody id = 'TableBody'>
                <tr>
                    <td><b>बिल क्र.:</b></td>
                    <td>49746</td>
                </tr>
                <tr>
                    <td><b>तारीख:</b></td>
                    <td>01-03-2024</td>
                </tr>
                <tr>
                    <td><b>ग्राहकाचे नाव:</b></td>
                    <td id="cust_name" value= "test">Cash Bill</td>
                </tr>
                <tr>
                    <td><b>संपर्क क्र.:</b></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td><b>पत्ता:</b></td>
                    <td>-</td>
                </tr>
            </tbody>
        </table>
        
        <!-- Items table -->
        <table>
            <thead>
                <tr>
                    <th>अनु क्र.</th>
                    <th>बटा</th>
                    <th>Product</th>
                    <th>नग</th>
                    <th>किंमत</th>
                    <th>रक्कम</th>
                </tr>
            </thead>
            <tbody id= 'itemsTableBody'>
            </tbody>
            <tfoot style="background-color: #e8e6e4;"  id ="tablefooter">
                <tr>
                    <td align="right" colspan="6"><font color="black">गेलेले कॅरेट : +</font></td>
                    <td align="right" colspan="1"><font color="black">0</font></td>
                </tr>	
                <tr>
                    <td align="right" colspan="6" style="border-top: 1px solid #999"><font color="black">चालू कलम रक्कम:</font></td>
                    <td align="right" colspan="1" style="border-top: 1px solid #999"><font color="black">800</font></td>
                </tr>
                <tr>
                    <td align="right" colspan="6"><font color="black">मागील बाकी:</font></td>
                    <td align="right" colspan="1"><font color="black">0</font></td>
                </tr>
                <tr>
                    <td align="right" colspan="6" style="border-top: 1px solid #999"><font color="black">एकूण रक्कम:</font></td>
                    <td align="right" colspan="1" style="border-top: 1px solid #999"><font color="black">800</font></td>
                </tr>
                <tr>
                    <td align="right" colspan="6"><font color="black">रोख जमा रक्कम:</font></td>
                    <td align="right" colspan="1"><font color="black">800</font></td>
                </tr>
                <tr>
                    <td align="right" colspan="6"><font color="black">ऑनलाईन जमा रक्कम:</font></td>
                    <td align="right" colspan="1"><font color="black">0</font></td>
                </tr>
                <tr>
                    <td align="right" colspan="6"><font color="black">सूट रक्कम:</font></td>
                    <td align="right" colspan="1"><font color="black">0</font></td>
                </tr>
                <tr>
                    <td align="right" colspan="6"><font color="black">जमा कॅरेट:   -</font></td>
                    <td align="right" colspan="1"><font color="black">0</font></td>
                </tr>
                <tr>
                    <td align="right" colspan="6" style="border-top: 1px solid #999"><font color="black">आत्ता पर्यंतचे येणे बाकी:</font></td>
                    <td align="right" colspan="1" style="border-top: 1px solid #999"><font color="black">0</font></td>
                </tr>
            </tfoot>
        </table>
        
        <!-- Thank you message -->
        <div class="details">
            <h4>Thank you, visit again!</h4>
            <p><a href="https://datacrushanalytics.com/" style="color: #B1B6BA; font-size: 14px;">www.DataCrushAnalytics.com (Contact No: 7040040015)</a></p>
        </div>
    </div>
        


        <!-- Print button -->
        <div class="header-details">
        <button id="printButton">Print</button>
        </div>

    `;

    // Assign ID to itemData
    itemData.id = 'printContent';
    // Append modal content to modal
    modalContent.appendChild(itemData);

    // Append modal content to modal
    modal.appendChild(modalContent);

    // Display the modal
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Add event listener to the print button
    var printButton = document.getElementById('printButton');
    printButton.addEventListener('click', function () {
        printJS({
            printable: 'printContent', // ID of the element to print
            type: 'html', // Type of content
            scanStyles: true, // Scan for styles
            targetStyles: ['*'] // Apply all styles
        });
    });
}




