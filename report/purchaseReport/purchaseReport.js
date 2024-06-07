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
    fetchDataAndProcess();
});

function fetchDataAndProcess() {
    var data = {
        from_date : formatDate(document.getElementById("fromdate").value),
        to_date : formatDate(document.getElementById("todate").value),
        supplier_name : getElementValueWithDefault('supplier', '*') , 
        bata : getElementValueWithDefault('bata', '*') , 
        gadi_number : getElementValueWithDefault('vehicleNumber', '*'),
        purchase_id : getElementValueWithDefault('purchase_id', '*') 
    };
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    return fetch('http://65.2.144.249/purchaseReport', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 404) {
        loader.style.display = 'none';

            alert("No data found.");
            throw new Error('Data not found');
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        loader.style.display = 'none';

        console.log(result)
        populateTable4(result)
        return result;
        // Optionally, you can redirect or show a success message here
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, you can display an error message here
    });
}


function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['id', 'date', 'gadi_number','supplier_name', 'BillAmount','TotalQuantity'];
    var counter = 1;
    console.log(data.reports)
    if (data.reports.length === 0) {
        alert("No Data Found");
    }
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
        // Add button to open popup
        var buttonCell = row.insertCell();
        var openPopupButton = document.createElement('button');
        openPopupButton.className = 'button';
        openPopupButton.textContent = 'View';
        openPopupButton.addEventListener('click', function () {
            openModal(item); // Pass the data item to the openPopup function
        });
        buttonCell.appendChild(openPopupButton);
    });

     // Add row for grand total
     var totalRow = tbody.insertRow();
     var totalCell = totalRow.insertCell();
     totalCell.colSpan = columnsToDisplay.length;
     totalCell.textContent = 'Grand Total: ' + data.Grand['Grand Amournt'] + ' (BillAmount), ' + data.Grand['Grand Quantity'] + ' (TotalQuantity)';
}



async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        // Export to PDF using jsPDF and autoTable
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Map data for autoTable
        const reportData = data.reports.map(report => [
            report.id,
            new Date(report.date).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }),
            report.gadi_number,
            report.bata,
            report.supplier_name,
            report.BillAmount,
            report.TotalQuantity
        ]);

        // Add Reports table to PDF
        doc.autoTable({
            head: [customHeaders],
            body: reportData,
            startY: 10,
            theme: 'grid'
        });

        // Adding Grand Totals to PDF
        doc.autoTable({
            head: [['Description', 'Amount']],
            body: [
                ["BillAmount", data.Grand['Grand Amournt']],
                ["TotalQuantity", data.Grand['Grand Quantity']]
            ],
            startY: doc.autoTable.previous.finalY + 10,
            theme: 'grid'
        });

        // Save the PDF
        doc.save('Purchase_Report.pdf');

    } catch (error) {
        console.error('Error exporting data:', error);
    }
}



 // Add Delete button if user is admin
 if (isAdmin) {
    var deleteCell = row.insertCell();
    var deleteButton = document.createElement('button');
    deleteButton.className = 'button delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
      deleteaccount(item.id); // Pass the user id to the delete function
    });
    deleteCell.appendChild(deleteButton);
}




function openModal(item) {
    // Your code to open the modal with the data from 'item'
    console.log("Opening modal for item:", item.id);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    fetch('http://65.2.144.249/purchaseReport/' + item.id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            console.log(data)
            loader.style.display = 'none';
            var utcDate = new Date(data.reports[0].date);
            var options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'Asia/Kolkata'
            };


            var tableBody = document.getElementById("TableBody");
            tableBody.innerHTML = ""; // Clear existing rows

            var billDetails = [
                { label: "बिल क्र.:", value: data.reports[0].id  },
                { label: "तारीख:", value: utcDate.toLocaleString('en-IN', options) },
                { label: "ग्राहकाचे नाव:", value: data.reports[0].supplier_name },
                { label: "गाडी नाव:", value: data.reports[0].gadi_number },
                { label: "संपर्क क्र.:", value: data.reports[0].mobile_no },
                { label: "पत्ता:", value: data.reports[0].address },
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


            // Populate table with fetched data
            var itemsTableBody = document.getElementById("itemsTableBody");
            itemsTableBody.innerHTML = ""; // Clear existing rows
            var columnsToDisplay = ['product_name', 'bata','mark','quantity', 'purchase_price', 'price'];
            var counter = 1;
            data.Receipt.forEach(function (item) {
                var row = itemsTableBody.insertRow();
                var cell = row.insertCell();
                cell.textContent = counter++;
                columnsToDisplay.forEach(function (key) {
                    var cell = row.insertCell();

                    cell.textContent = item[key];
                });
            });
            
            var totalRow = itemsTableBody.insertRow();
            for (let i = 0; i < columnsToDisplay.length; i++) {
                totalRow.insertCell();
            }
            var totalCell = totalRow.insertCell();
            totalCell.textContent = 'Grand Total: ' + data.Grand['Grand Amournt'];    
            

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

        h6{
            top: -17px;
           position: absolute;
           font-size: 12px;
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
.container3 {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}
.box-container {
    display: flex;
    justify-content: space-around;
}
.carate {
    font-size: 16px;
    color: #333;
}
.data {
    font-size: 14px;
    color: #666;
}
        </style>
        <div class="header">
        <div> <h6> Mobile:- 9960607512  </h6> </div>
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
            </tbody>
        </table>
        
        <!-- Items table -->
        <table>
            <thead>
                <tr>
                    <th>अनु क्र.</th>
                    <th>Product</th>
                    <th>बटा</th>
                    <th>Mark</th>
                    <th>नग</th>
                    <th>किंमत</th>
                    <th>रक्कम</th>
                </tr>
            </thead>
            <tbody id= 'itemsTableBody'>
            </tbody>
            <tfoot style="background-color: #e8e6e4;"  id ="tablefooter">
                
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

function closePopup() {
    document.querySelector('.popup').style.display = 'none';
}







