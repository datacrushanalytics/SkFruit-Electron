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
        customer_name : getElementValueWithDefault('customer', '*')
    };
    console.log(data);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    return fetch('http://65.2.144.249/receiptReport', {
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
    var columnsToDisplay = ['receipt_id', 'date', 'Customer','mobile_no','note', 'PaidAmt','online_deposite_bank',"onlineAmt",'discount','inCarat','Balance'];
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

     
}



async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        // Export to PDF using jsPDF and autoTable
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const customHeaders = ['receipt_id', 'date', 'Customer', 'mobile_no', 'note', 'PaidAmt','online_deposite_bank', 'onlineAmt', 'discount', 'inCarat', 'Balance'];
        
        // Adding header details
        doc.setFontSize(10);
        doc.text('Mobile:- 9960607512', 10, 10);
        doc.addImage('../../assets/img/logo.png', 'PNG', 10, 15, 30, 30); // Adjust the position and size as needed
        doc.setFontSize(16);
        doc.text('Savata Fruits Suppliers', 50, 10);
        doc.setFontSize(12);
        doc.text('At post Kasthi Tal: Shreegonda, District Ahamadnagar - 414701', 50, 20);
        doc.text('Mobile NO:- 9860601102 / 9175129393/ 9922676380 / 9156409970', 50, 30);
        
        let startY = 50;
        

        // Map data for autoTable
        const reportData = data.reports.map(report => [
            report.receipt_id,
            new Date(report.date).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }),
            report.Customer,
            report.mobile_no,
            report.note,
            report.PaidAmt,
            report.online_deposite_bank,
            report.onlineAmt,
            report.discount,
            report.inCarat,
            report.Amt,
            report.Balance // Ensure this field matches the actual field name in your data
        ]);

        // Add Reports table to PDF
        doc.autoTable({
            head: [customHeaders],
            body: reportData,
            startY: 50,
            theme: 'grid'
        });

        // Save the PDF
        doc.save('Receipt_Report.pdf');

    } catch (error) {
        console.error('Error exporting data:', error);
    }
}



function openModal(item) {
    // Your code to open the modal with the data from 'item'
    console.log("Opening modal for item:", item.receipt_id);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    fetch('http://65.2.144.249/receiptReport/' + item.receipt_id)
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
                { label: "जमा पावती क्र.:", value: item.receipt_id },
                { label: "तारीख:", value: utcDate.toLocaleString('en-IN', options) },
                { label: "ग्राहकाचे नाव:", value: data.reports[0].Customer },
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

            document.getElementById('carate3100').textContent = data.reports[0].carate_100;
            document.getElementById('carate3150').textContent = data.reports[0].carate_150;
            document.getElementById('carate3250').textContent = data.reports[0].carate_250;
            document.getElementById('carate3350').textContent = data.reports[0].carate_350;


            var tablefooter = document.getElementById("tablefooter");
            tablefooter.innerHTML = ""; // Clear existing rows

            var footerDetails = [
                //{ label: "गेलेले कॅरेट : +", value: data.results[0].carate_amount },
                //{ label: "चालू कलम रक्कम:", value: data.results[0].amount },
                { label: "मागील बाकी:", value: data.reports[0].previous_balance },
                //{ label: "एकूण रक्कम:", value: data.results[0].total_amount },
                { label: "रोख जमा रक्कम:", value: data.reports[0].PaidAmt },
                { label: "ऑनलाईन जमा बँक :", value: data.reports[0].online_deposite_bank },
                { label: "ऑनलाईन जमा रक्कम:", value: data.reports[0].onlineAmt },
                { label: "सूट रक्कम:", value: data.reports[0].discount },
                { label: "जमा कॅरेट:  -" + "100 * " +data.reports[0].c100 +" | 150 * " + data.reports[0].c150+ " | 250 * " +data.reports[0].c250 + " | 350 * " + data.reports[0].c350, value: data.reports[0].inCarat },
                { label: "आत्ता पर्यंतचे येणे बाकी:", value: data.reports[0].Balance },
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
        .details, .header-details, .close {
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
        background-color: #fff;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        margin-left: 10%; /* Add left margin to make the container smaller from the left side */
        width: 70%; /* Adjust the width to make the container smaller */
        max-width: 600px; /* Optional: set a maximum width */
    }

    .row {
        display: flex;
        flex-wrap: wrap;
    }

    .carate-box {
        background-color: #e9e9e9;
        padding: 8px; /* Reduced padding */
        margin: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        flex: 1 1 calc(20% - 20px); /* Adjusted flex-basis for smaller boxes */
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
    }

    .carate {
        font-weight: bold;
        font-size: 16px;
        color: #333;
    }

    .data {
        font-size: 14px;
        color: #666;
        margin-left: 10px;
    }
</style>
</head>
<body>
<div class="header">
    <div class="logo">
        <img src="../../assets/img/logo.png" alt="Company Logo">
    </div>
    <div>
        <h1>सावता फ्रुट सप्लायर्स</h1>
        <p>ममु.पोस्ट- काष्टी ता.- श्रीगोंदा, जि. अहमदनगर - 414701</p>
        <p>मोबाईल नं:- 9860601102 / 9175129393/ 9922676380 / 9156409970</p>
    </div>
</div>
<div class="container2">
    <!-- Receipt details -->
    <table>
        <tbody id="TableBody">
        </tbody>
    </table>
    
    <!-- Items table -->
    <table>
        <tfoot style="background-color: #e8e6e4;" id="tablefooter">
        </tfoot>
    </table>

    <div class="box-container">
       <b> <div class="label">बाकी कॅरेट :</div> </b>
        <div class="row">
            <div class="carate-box">
                <div class="carate">100:</div>
                <div class="data" id="carate3100">Data 1</div>
            </div>
            <div class="carate-box">
                <div class="carate">150:</div>
                <div class="data" id="carate3150">Data 2</div>
            </div>
            <div class="carate-box">
                <div class="carate">250:</div>
                <div class="data" id="carate3250">Data 3</div>
            </div>
            <div class="carate-box">
                <div class="carate">350:</div>
                <div class="data" id="carate3350">Data 4</div>
            </div>
        </div>
    </div>
</div>

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




