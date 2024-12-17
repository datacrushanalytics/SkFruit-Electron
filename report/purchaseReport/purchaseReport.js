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

    return fetch('http://103.174.102.89:3000/purchaseReport', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 404) {
        loader.style.display = 'none';

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No data found.',
          });
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
        // Optionally, you can darkgreyirect or show a success message here
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, you can display an error message here
    });
}




function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['id', 'date', 'gadi_number', 'supplier_name', 'expenses','BillAmount', 'TotalQuantity'];
    var counter = 1;
    var isAdmin = JSON.parse(localStorage.getItem('sessionData'))[0].usertype === 'Admin';
    console.log(data.reports);

    if (data.reports.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No data found.',
          });
    }

    var grandTotalBillAmount = 0;
    var grandTotalQuantity = 0;

    data.reports.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;

        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            if (key == 'date') {
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
                // Align BillAmount and TotalQuantity to the right
                if (key == 'BillAmount' || key == 'TotalQuantity') {
                    cell.classList.add('right-align');
                }
                // Calculate grand totals
                if (key == 'BillAmount') {
                    grandTotalBillAmount += parseFloat(item[key]) || 0;
                }
                if (key == 'TotalQuantity') {
                    grandTotalQuantity += parseFloat(item[key]) || 0;
                }
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

        // Add Edit button if user is admin
        if (isAdmin) {
            var editCell = row.insertCell();
            var editButton = document.createElement('button');
            editButton.className = 'button edit-button';
            editButton.style.backgroundColor = '#26a653';
            var editLink = document.createElement('a');
            editLink.href = './updatePurchase.html'; // Edit link destination
            editLink.textContent = 'Edit';
            editButton.appendChild(editLink);
            editButton.addEventListener('click', function() {
                editAccount(item); // Pass the user data to the edit function
            });
            editCell.appendChild(editButton);
        }

        // Add Delete button if user is admin
        if (isAdmin) {
            var deleteCell = row.insertCell();
            var deleteButton = document.createElement('button');
            deleteButton.className = 'button delete-button';
            deleteButton.style.backgroundColor = '#ff355f';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function () {
                deleteaccount(item.id); // Pass the user id to the delete function
            });
            deleteCell.appendChild(deleteButton);
        }
    });

    // Add row for grand total
    var totalRow = tbody.insertRow();
    var totalCell = totalRow.insertCell();
    totalCell.colSpan = columnsToDisplay.length - 2; // Span the totalCell across all columns except the last two

    var emptyCell = totalRow.insertCell(); // Add an additional empty cell to shift the grand total one more column to the right

    var billAmountCell = totalRow.insertCell();
    billAmountCell.textContent = 'Grand Total: ' + grandTotalBillAmount.toFixed(2) + ' (BillAmount)';
    billAmountCell.style.fontWeight = 'bold'; // Make label text bold
    billAmountCell.classList.add('right-align');

    var quantityCell = totalRow.insertCell();
    quantityCell.textContent = grandTotalQuantity.toFixed(2) + ' (TotalQuantity)';
    quantityCell.style.fontWeight = 'bold'; // Make label text bold
    quantityCell.classList.add('right-align');
}


// Add CSS for right alignment
const style = document.createElement('style');
style.innerHTML = `
    .right-align {
        text-align: right;
    }
`;
document.head.appendChild(style);


function editAccount(user) {
    localStorage.removeItem('purchaseData');
    console.log('Editing user: ' + JSON.stringify(user));
    localStorage.setItem('purchaseData', JSON.stringify(user));
     // darkgreyirect to user_update.html
     window.location.href = './updatePurchase.html';
  }


function deleteaccount(userId) {
    // Perform delete operation based on userId
    fetch('http://103.174.102.89:3000/purchaseReport/deletePurchaseReport/' + userId, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Record is successfully Deleted',
                })
            console.log('REcord deleted successfully');
            // Refresh the table or update UI as needed
            fetchDataAndProcess(); // Assuming you want to refresh the table after delete
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



// async function exportToExcel() {
//     let customHeaders; // Define customHeaders outside the try block
//     try {
//         const data = await fetchDataAndProcess();

//         // Export to PDF using jsPDF and autoTable
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF();

//         customHeaders = ['id', 'date', 'gadi_number', 'bata', 'supplier_name', 'BillAmount', 'TotalQuantity']; // Assign customHeaders value here
        
//         // Adding header details
//         doc.setFontSize(10);
//         doc.text('Mobile:- 9960607512', 10, 10);
//         doc.addImage('../../assets/img/logo.png', 'PNG', 10, 15, 30, 30); // Adjust the position and size as needed
//         doc.setFontSize(16);
//         doc.text('Savata Fruits Suppliers', 50, 20);
//         doc.setFontSize(12);
//         doc.text('At post Kasthi Tal: Shreegonda, District Ahamadnagar - 414701', 50, 30);
//         doc.text('Mobile NO:- 9860601102  / 9922676380 / 9156409970', 50, 40);
        
//         let startY = 50;
        
//         // Map data for autoTable
//         const reportData = data.reports.map(report => [
//             report.id,
//             new Date(report.date).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }),
//             report.gadi_number,
//             report.bata,
//             report.supplier_name,
//             report.BillAmount,
//             report.TotalQuantity
//         ]);

//         // Calculate grand totals
//         const grandTotalAmount = data.reports.darkgreyuce((total, report) => total + parseFloat(report.BillAmount), 0);
//         const grandTotalQuantity = data.reports.darkgreyuce((total, report) => total + parseFloat(report.TotalQuantity), 0);

//         // Add grand totals row to reportData
//         reportData.push(['Grand Total:', '', '', '','', grandTotalAmount.toFixed(2), grandTotalQuantity.toFixed(2)]);

//         // Add Reports table to PDF
//         doc.autoTable({
//             head: [customHeaders],
//             body: reportData,
//             startY: 50,
//             theme: 'grid'
//         });

//         // Save the PDF
//         doc.save('Purchase_Report.pdf');

//     } catch (error) {
//         console.error('Error exporting data:', error);
//     }
// }

async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        return fetch('http://103.174.102.89:3000/purchaseReport/generate-pdf', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 404) {
                loader.style.display = 'none';
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No data found.',
                  });
                throw new Error('Data not found');
            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob(); // Get the response as a Blob
        })
        .then(blob => {
            loader.style.display = 'none';

            // Create a URL for the Blob and trigger a download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'purchaseReport.pdf'; // Set the desidarkgrey file name
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url); // Release the URL

            console.log('PDF downloaded successfully');
        })
        .catch(error => {
            loader.style.display = 'none';
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error generating PDF. Please try again.',
              });
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error generating PDF. Please try again.',
          });
    }
}







function openModal(item) {
    // Your code to open the modal with the data from 'item'
    console.log("Opening modal for item:", item.id);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    fetch('http://103.174.102.89:3000/purchaseReport/' + item.id)
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
                { label: "सप्लायर नाव:", value: data.reports[0].supplier_name },
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
            background-color: #c7d5d3;
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
            <p>मोबाईल नं:- 9860601102  / 9922676380 / 9156409970</p>
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







