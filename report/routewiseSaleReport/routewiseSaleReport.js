
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
        from_date: formatDate(document.getElementById("fromdate").value),
        to_date: formatDate(document.getElementById("todate").value),
        cust_name: getElementValueWithDefault('customer', '*'),
        route: getElementValueWithDefault('route', '*'),
        product: getElementValueWithDefault('product', '*'),
        bata: getElementValueWithDefault('bata', '*')
    };
    console.log(data);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    return fetch('http://52.66.126.53/routewiseSaleReport', {
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
    var columnsToDisplay = ['bill_no', 'date', 'cust_name', 'route', 'amount', 'carate_amount', 'pre_balance', 'total_amount', 'online_amt', 'discount', 'inCarat', 'PaidAmount', 'balance', 'comment'];
    var counter = 1;
    console.log(data.reports)
    if (data.reports.length === 0) {
        alert("No Data Found");
    }
    data.reports.forEach(function (item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function (key) {
            var cell = row.insertCell();
            if (key === 'date') {
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
         openPopupButton.style.backgroundColor = 'darkgrey';
         openPopupButton.textContent = 'Products';
         openPopupButton.addEventListener('click', function () {
            openPopup(item); // Pass the data item to the openPopup function
         });
         buttonCell.appendChild(openPopupButton);

        // Add button to open popup
        var buttonCell = row.insertCell();
        var openPopupButton = document.createElement('button');
        openPopupButton.className = 'button';
        openPopupButton.style.backgroundColor = 'darkgrey';
        openPopupButton.textContent = 'Bill';
        openPopupButton.addEventListener('click', function () {
            openModal(item); // Pass the data item to the openPopup function
        });
        buttonCell.appendChild(openPopupButton);
    });

    // Add row for grand total
    var totalRow = tbody.insertRow();
    totalRow.insertCell().colSpan = 1; // Skip the first column

    columnsToDisplay.forEach(function (key) {
        var cell = totalRow.insertCell();
        if (key === 'route') {
            cell.textContent = 'Grand Total';
            cell.style.fontWeight = 'bold'; // Make "Grand Total" bold
        } else {
            switch (key) {
                case 'amount':
                    cell.textContent = data.Grand['Grand Bill Amount'];
                    break;
                case 'carate_amount':
                    cell.textContent = data.Grand['Grand outCarate'];
                    break;
                case 'total_amount':
                    cell.textContent = data.Grand['Total Bill Amount'];
                    break;
                case 'online_amt':
                    cell.textContent = data.Grand['Online Amount'];
                    break;
                case 'discount':
                    cell.textContent = data.Grand['Grand Discount'];
                    break;
                case 'inCarat':
                    cell.textContent = data.Grand['Grand inCarate'];
                    break;
                case 'PaidAmount':
                    cell.textContent = data.Grand['Grand Paid Amount'];
                    break;
                case 'balance':
                    cell.textContent = data.Grand['Grand Balance'];
                    break;
                default:
                    cell.textContent = '';
                    break;
            }
            cell.style.fontWeight = 'bold'; // Make the values bold
        }
    });

    // Add a final cell for the "Bill" column, leaving it empty
    totalRow.insertCell();
}



function openPopup(item) {
    document.getElementById('popup').style.display = 'block';
    // Set the src of the iframe to display content based on the item data
    // var iframe = document.getElementById('popupIframe');
    // iframe.src = './billDetails.html?bill_no=' + encodeURIComponent(item.bill_no);

    fetch('http://52.66.126.53/saleproductData/' + String(item.bill_no))
            .then(response => response.json())
            .then(data => {
                populatePopupTable(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
}

function closePopup() {
    document.getElementById('popupTableBody').innerHTML = ''; 
    document.getElementById('popup').style.display = 'none';
     // Clear the iframe src
}



function populatePopupTable(data) {
    var tbody = document.getElementById('popupTableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['product','bata','mark','quantity','rate','price'];
    var counter = 1;
    console.log(data)
    // console.log(data.reports)
    if (data.length === 0) {
        alert("No Data Found");
    }
    data.forEach(function (item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function (key) {
            var cell = row.insertCell();
            cell.textContent = item[key] !== '' ? item[key] : 'null';
            
        });
    });
}


function openModal(item) {
    // Your code to open the modal with the data from 'item'
    console.log("Opening modal for item:", item.bill_no);
    

    fetch('http://52.66.126.53/bill/' + item.bill_no)
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

            const label = 
                "बाकी कॅरेट : " +
                (data.results[0].carate_100 > 0 ? "100 X " + data.results[0].carate_100 + " " : "") +
                (data.results[0].carate_150 > 0 ? "150 X " + data.results[0].carate_150 + " " : "") +
                (data.results[0].carate_250 > 0 ? "250 X " + data.results[0].carate_250 + " " : "") +
                (data.results[0].carate_350 > 0 ? "350 X " + data.results[0].carate_350 : "");

            const label1 = 
                "गेलेले कॅरेट : " +
                (data.results[0].in_carate_100 > 0 ? "100 X " + data.results[0].in_carate_100 + " " : "") +
                (data.results[0].in_carate_150 > 0 ? "150 X " + data.results[0].in_carate_150 + " " : "") +
                (data.results[0].in_carate_250 > 0 ? "250 X " + data.results[0].in_carate_250 + " " : "") +
                (data.results[0].in_carate_350 > 0 ? "350 X " + data.results[0].in_carate_350 : "");

            const label2 = 
                "जमा कॅरेट : " +
                (data.results[0].out_carate_100 > 0 ? "100 X " + data.results[0].out_carate_100 + " " : "") +
                (data.results[0].out_carate_150 > 0 ? "150 X " + data.results[0].out_carate_150 + " " : "") +
                (data.results[0].out_carate_250 > 0 ? "250 X " + data.results[0].out_carate_250 + " " : "") +
                (data.results[0].out_carate_350 > 0 ? "350 X " + data.results[0].out_carate_350 : "");

            var footerDetails = [
                // { label: "गेलेले कॅरेट : 100 X  " + data.results[0].in_carate_100 + "  150 X  " + data.results[0].in_carate_150 + "  250 X  " + data.results[0].in_carate_250 + "  350 X  " +  data.results[0].in_carate_350, value: data.results[0].carate_amount },
                { label: label1.trim(), value: data.results[0].carate_amount },
                { label: "चालू कलम रक्कम:", value: data.results[0].amount },
                { label: "मागील बाकी:", value: data.results[0].pre_balance },
                { label: "एकूण रक्कम:", value: data.results[0].total_amount },
                { label: "रोख जमा रक्कम:", value: data.results[0].cash },
                { label: "ऑनलाईन जमा बँक :", value: data.results[0].online_acc },
                { label: "ऑनलाईन जमा रक्कम:", value: data.results[0].online_amt },
                { label: "सूट रक्कम:", value: data.results[0].discount },
                // { label: "जमा कॅरेट: 100 X  " + data.results[0].out_carate_100 + "  150 X  " + data.results[0].out_carate_150 + "  250 X  " + data.results[0].out_carate_250 + "  350 X  " +  data.results[0].out_carate_350, value: data.results[0].inCarat },
                { label: label2.trim(), value: data.results[0].inCarat },
                { label: "आत्ता पर्यंतचे येणे बाकी:", value: data.results[0].balance },
                //{ label: "बाकी कॅरेट : 100 X  " + data.results[0].carate_100 + "  150 X  " + data.results[0].carate_150 + "  250 X  " + data.results[0].carate_250 + "  350 X  " +  data.results[0].carate_350, value: ''} 
                { label: label.trim(), value: ''} 
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

            // document.getElementById('carate1100').textContent = data.results[0].in_carate_100;
            // document.getElementById('carate1150').textContent = data.results[0].in_carate_150;
            // document.getElementById('carate1250').textContent = data.results[0].in_carate_250;
            // document.getElementById('carate1350').textContent = data.results[0].in_carate_350;
            // document.getElementById('carate2100').textContent = data.results[0].out_carate_100;
            // document.getElementById('carate2150').textContent = data.results[0].out_carate_150;
            // document.getElementById('carate2250').textContent = data.results[0].out_carate_250;
            // document.getElementById('carate2350').textContent = data.results[0].out_carate_350;
            // document.getElementById('carate3100').textContent = data.results[0].carate_100;
            // document.getElementById('carate3150').textContent = data.results[0].carate_150;
            // document.getElementById('carate3250').textContent = data.results[0].carate_250;
            // document.getElementById('carate3350').textContent = data.results[0].carate_350;


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
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
    }
    
    .box-container {
        background-color: #fff;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    h6{
        top: -17px;
       position: absolute;
       font-size: 12px;
    }
    
    .label {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 31px;
        position: relative;
        top: 17px;
        right: -47px;

    }
    
    .row {
        display: flex;
        flex-wrap: wrap;
    }
    
    .carate-box {
        background-color: #e9e9e9;
        padding: 4px;
        margin: 7px;
        position: relative;
        top: 10px;
        max-width: 66px;
        max-height: 24px;
        left: -23px;
        border: 1px solid #ccc;
        border-radius: 5px;
        flex: 1 1 calc(25% - 20px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box; /* Ensures padding and border are included in the width calculation */
    }
    
    
    .carate {
        font-weight: bold;
    }
    
    .data {
        margin-left: 10px;
        color: #333;
    }
         
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
.container3 {
max-width: 800px;
margin: 0 auto;
padding: 20px;
text-align: center;
}
.box-container {
display: flex;
justify-content: space-around;
margin: 16px
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
      <center><h1>सावता फ्रुट सप्लायर्स</h1> 
        <p>ममु.पोस्ट- काष्टी ता.- श्रीगोंदा, जि. अहमदनगर - 414701</p>
        <p>मोबाईल नं:- 9860601102 / 9175129393/ 9922676380 / 9156409970</p>
    </div> </center>
</div>
<div class="container2">

    <!-- Bill details -->
    <table>
        <tbody id = 'TableBody'>
        </tbody>
    </table>
    <br><br>
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



// async function exportToExcel() {
//     try {
//         const data = await fetchDataAndProcess();

//         // Export to PDF using jsPDF and autoTable
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF();

//         // Custom headers
//         const customHeaders = ['bill_no', 'date', 'amount', 'carate_amount', 'pre_balance','total_amount', 'online_amt', 'discount', 'inCarat', 'PaidAmount', 'balance', 'comment'];

//         // Adding header details
//         doc.setFontSize(10);
//         doc.text('Mobile: 9960607512', 10, 10);
//         doc.addImage('../../assets/img/logo.png', 'PNG', 10, 15, 30, 30); // Adjust the position and size as needed

//         doc.setFontSize(16);
//         doc.text('Savata Fruits Suppliers', 50, 20);

//         doc.setFontSize(12);
//         doc.text('At post Kasthi Tal: Shreegonda, District Ahamadnagar - 414701', 50, 30);
//         doc.text('Mobile NO: 9860601102 / 9175129393 / 9922676380 / 9156409970', 50, 40);

//         let startY = 50;

//         // // Add customer name and route
//         // if (document.getElementById('customer').value !== '') {
//         //     doc.text(`Customer Name: ${data.cust_name}`, 50, 50);
//         //     startY = 60; // Adjust startY for the next line
//         // }
//         // if (document.getElementById('route').value !== '') {
//         //     doc.text(`Route: ${data.route}`, 50, startY);
//         //     startY += 10; // Adjust startY for the next section
//         // }

//         // Check and add customer name and route
//         const customerNameElement = document.getElementById('customer');
//         const routeElement = document.getElementById('route');

//         if (customerNameElement && customerNameElement.value !== '') {
//             doc.text(`Customer Name: ${customerNameElement.value}`, 50, 50);
//             startY = 60; // Adjust startY for the next line
//         }
//         if (routeElement && routeElement.value !== '') {
//             doc.text(`Route: ${routeElement.value}`, 50, startY);
//             startY += 10; // Adjust startY for the next section
//         }


//         // Map data for autoTable
//         const reportData = data.reports.map(report => [
//             report.bill_no,
//             new Date(report.date).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }),
//             report.amount,
//             report.carate_amount,
//             report.pre_balance,
//             report.total_amount,
//             report.online_amt,
//             report.discount,
//             report.inCarat,
//             report.PaidAmount,
//             report.balance,
//             report.comment
//         ]);

//         // Calculate grand totals
//         const grandTotals = {
//             amount: 0,
//             carate_amount: 0,
//             pre_balance: 0,
//             total_amount: 0,
//             online_amt: 0,
//             discount: 0,
//             inCarat: 0,
//             PaidAmount: 0,
//             balance: 0
//         };

//         reportData.forEach(row => {
//             grandTotals.amount += parseFloat(row[2]) || 0;
//             grandTotals.carate_amount += parseFloat(row[3]) || 0;
//             grandTotals.pre_balance += parseFloat(row[4]) || 0;
//             grandTotals.total_amount += parseFloat(row[5]) || 0;
//             grandTotals.online_amt += parseFloat(row[6]) || 0;
//             grandTotals.discount += parseFloat(row[7]) || 0;
//             grandTotals.inCarat += parseFloat(row[8]) || 0;
//             grandTotals.PaidAmount += parseFloat(row[9]) || 0;
//             grandTotals.balance += parseFloat(row[10]) || 0;
//         });

//         // Add Grand Totals row at the end of the data
//         reportData.push([
//             '', 'Grand Total', grandTotals.amount.toFixed(),
//             grandTotals.carate_amount.toFixed(),
//             grandTotals.pre_balance.toFixed(),
//             grandTotals.total_amount.toFixed(),
//             grandTotals.online_amt.toFixed(),
//             grandTotals.discount.toFixed(),
//             grandTotals.inCarat.toFixed(),
//             grandTotals.PaidAmount.toFixed(),
//             grandTotals.balance.toFixed(), ''
//         ]);

//         // Add Reports table to PDF
//         doc.autoTable({
//             head: [customHeaders],
//             body: reportData,
//             startY: startY , // Start table below the last text
//             theme: 'grid',
//         }); 

//         // Save the PDF
//         doc.save('Routewise_Sale_Report.pdf');

//     } catch (error) {
//         console.error('Error exporting data:', error);
//     }
// }




async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        return fetch('http://52.66.126.53/routewiseSaleReport/generate-pdf', {
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
            return response.blob(); // Get the response as a Blob
        })
        .then(blob => {
            loader.style.display = 'none';

            // Create a URL for the Blob and trigger a download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'SaleReport.pdf'; // Set the desidarkgrey file name
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url); // Release the URL

            console.log('PDF downloaded successfully');
        })
        .catch(error => {
            loader.style.display = 'none';
            console.error('Error:', error);
            alert('Error generating PDF. Please try again.');
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error generating PDF. Please try again.');
    }
}



