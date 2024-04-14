// // Fetch data from API
// document.addEventListener('DOMContentLoaded', function () {

//     fetch('http://13.126.106.17/list/Customer')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Populate dropdown with API data
//             populateDropdown(data);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });


//     fetch('http://13.126.106.17/routeData')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Populate dropdown with API data
//             populateDropdown4(data);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// });


// function populateDropdown(data) {
//     var userNameDropdown = document.getElementById('customer');
//     userNameDropdown.innerHTML = ''; // Clear existing options

//     // Create and append new options based on API data
//     data.forEach(function (item) {
//         var option = document.createElement('option');
//         option.value = item.name; // Set the value
//         option.textContent = item.name; // Set the display text
//         userNameDropdown.appendChild(option);
//     });

//     // Add a placeholder option
//     var placeholderOption = document.createElement('option');
//     placeholderOption.value = ""; // Set an empty value
//     placeholderOption.textContent = "Select Customer type"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }

// function populateDropdown4(data) {
//     var userNameDropdown = document.getElementById('route');
//     userNameDropdown.innerHTML = ''; // Clear existing options

//     // Create and append new options based on API data
//     data.forEach(function (item) {
//         var option = document.createElement('option');
//         option.value = item.route_name; // Set the value
//         option.textContent = item.route_name; // Set the display text
//         userNameDropdown.appendChild(option);
//     });

//     // Add a placeholder option
//     var placeholderOption = document.createElement('option');
//     placeholderOption.value = ""; // Set an empty value
//     placeholderOption.textContent = "Select Route type"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }




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



// document.getElementById('loginForm1').addEventListener('submit', function (event) {
//     event.preventDefault(); // Prevent form submission
//     var data = {
//         from_date: formatDate(document.getElementById("fromdate").value),
//         to_date: formatDate(document.getElementById("todate").value),
//         cust_name: getElementValueWithDefault('customer', '*'),
//         route: getElementValueWithDefault('route', '*')
//     };
//     console.log(data);

//     fetch('http://13.126.106.17/routewiseSaleReport', {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(result => {
//             console.log(result)
//             populateTable4(result)
//             // Optionally, you can redirect or show a success message here
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             // Optionally, you can display an error message here
//         });
// });


document.getElementById('loginForm1').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    fetchDataAndProcess();
});



function fetchDataAndProcess() {    
    var data = {
        from_date: formatDate(document.getElementById("fromdate").value),
        to_date: formatDate(document.getElementById("todate").value),
        cust_name: getElementValueWithDefault('customer', '*'),
        route: getElementValueWithDefault('route', '*')
    };
    console.log(data);

    return fetch('http://13.126.106.17/routewiseSaleReport', {
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
    var columnsToDisplay = ['bill_no', 'date', 'cust_name', 'route', 'amount', 'carate_amount', 'total_amount', 'pre_balance', 'online_amt', 'discount', 'inCarat', 'PaidAmount', 'balance', 'comment'];
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
                // If the value for the column is empty, set it to null
                cell.textContent = item[key] !== '' ? item[key] : 'null';
            }
        });

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


    // Add row for grand total
    var totalRow = tbody.insertRow();
    var totalCell = totalRow.insertCell();
    totalCell.colSpan = columnsToDisplay.length;
    totalCell.textContent = 'Grand Total: ' + data.Grand['Grand Bill Amount'] + ' (Grand Bill Amount), ' + data.Grand['Grand outCarate'] + ' (Grand outCarate)' + data.Grand['Total Bill Amount'] + ' (Total Bill Amount), ' + data.Grand['Online Amount'] + ' (Online Amount)' + data.Grand['Grand Discount'] + ' (Grand Discount), ' + data.Grand['Grand inCarate'] + ' (Grand inCarate)' + data.Grand['Grand Paid Amount'] + ' (Grand Paid Amount), ' + data.Grand['Grand Balance'] + ' (Grand Balance)';
}



function openModal(item) {
    // Your code to open the modal with the data from 'item'
    console.log("Opening modal for item:", item.bill_no);
    

    fetch('http://13.126.106.17/bill/' + item.bill_no)
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
                { label: "बिल क्र.:", value: item.bill_no },
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




async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        const customHeaders = ['bill_no', 'date', 'cust_name', 'route', 'amount', 'carate_amount', 'total_amount', 'pre_balance', 'online_amt', 'discount', 'inCarat', 'PaidAmount', 'balance', 'comment'];

        // Create a new worksheet with custom headers
        const worksheet = XLSX.utils.aoa_to_sheet([customHeaders]);

        // Append the data to the worksheet
        data.reports.forEach((report) => {
            const rowData = [
                report.bill_no,
                report.date,
                report.cust_name,
                report.route,
                report.amount,
                report.carate_amount,
                report.total_amount,
                report.pre_balance,
                report.online_amt,
                report.discount,
                report.inCarat,
                report.PaidAmount,
                report.balance,
                report.comment
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: -1 });
        });

        // Add Grand Totals to a new sheet
        const grandTotals = [
            ["Grand Bill Amount", "Grand outCarate", "Total Bill Amount", "Online Amount", "Grand Discount", "Grand inCarate", "Grand Paid Amount", "Grand Balance"],
            [data.Grand['Grand Bill Amount'], data.Grand['Grand outCarate'], data.Grand['Total Bill Amount'], data.Grand['Online Amount'], data.Grand['Grand Discount'], data.Grand['Grand inCarate'], data.Grand['Grand Paid Amount'] ,data.Grand['Grand Balance']]
        ];
        const grandTotalsWorksheet = XLSX.utils.aoa_to_sheet(grandTotals);

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Add the worksheet with data
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

        // Add the worksheet with grand totals
        XLSX.utils.book_append_sheet(workbook, grandTotalsWorksheet, 'Grand Totals');

        /* generate XLSX file and prompt to download */
        XLSX.writeFile(workbook, 'Routewise_Sale_Report.xlsx');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
}








