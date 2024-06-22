// Fetch data from API
document.addEventListener('DOMContentLoaded', function () {
    // Get the current date
    var currentDate = new Date();
    // Format the date as mm/dd/yyyy
    var formattedDate = currentDate.getFullYear() + '-' + (String(currentDate.getMonth() + 1).padStart(2, '0')) + '-' + (String(currentDate.getDate()).padStart(2, '0'));
    // Set the placeholder of the input field to the formatted date
    document.getElementById('date').value = formattedDate;

    var sessionData = JSON.parse(localStorage.getItem('sessionData'));
    var isAdmin = sessionData && sessionData[0].usertype === 'Admin';
    // Check if the user is an admin and show/hide the button accordingly
    if (!isAdmin) {
        document.getElementById('date').readOnly = true; // Hide the button for non-admin users
    }

    fetch('http://65.2.144.249/fetchReceiptid')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Populate dropdown with API data
        document.getElementById('pavti').value = parseInt(data[0]['num']) + 1;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('loginForm1').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
// function form2(){
    var formData = {
        receiptId: parseInt(document.getElementById('pavti').value),
        date: document.getElementById('date').value,
        from_account: document.getElementById('account_group').value,
        to_account: document.getElementById('mob').value,
        note: document.getElementById('message').value,
        previous_balance: parseInt(document.getElementById('input3').value) || 0,
        deposite: parseInt(document.getElementById('input6').value) || 0,
        online_deposite_bank: document.getElementById('input1').value,
        online_deposite: parseInt(document.getElementById('input7').value) || 0,
        discount: parseInt(document.getElementById('input8').value) || 0,
        carate_100: parseInt(document.getElementById('carate100').value) || 0,
        carate_150: parseInt(document.getElementById('carate150').value) || 0,
        carate_250: parseInt(document.getElementById('carate250').value) || 0,
        carate_350: parseInt(document.getElementById('carate350').value) || 0,
        deposite_carate_price: parseInt(document.getElementById('input4').value) || 0,
        remaining: parseInt(document.getElementById('input5').value) || 0,     
    };
    var loader = document.getElementById('loader');
    loader.style.display = 'block';
    await fetch('http://65.2.144.249/receiptData/insertReceipt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        console.log("DTAASS")
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        loader.style.display = 'none';
        console.log('Entry added successfully:', result);
        //alert("Receipt Data is added Successfully");
        openModal({"receipt_id": formData.receiptId})
        //window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });

});



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

            // document.getElementById('carate3100').textContent = data.reports[0].carate_100;
            // document.getElementById('carate3150').textContent = data.reports[0].carate_150;
            // document.getElementById('carate3250').textContent = data.reports[0].carate_250;
            // document.getElementById('carate3350').textContent = data.reports[0].carate_350;


            var tablefooter = document.getElementById("tablefooter");
            tablefooter.innerHTML = ""; // Clear existing rows

            var footerDetails = [
                //{ label: "गेलेले कॅरेट : +", value: data.results[0].carate_amount },
                //{ label: "चालू कलम रक्कम:", value: data.results[0].amount },
                { label: "मागील बाकी:", value: data.reports[0].previous_balance },
                { label: "बाकी कॅरेट : 100 X  " + data.reports[0].carate_100 + "  150 X  " + data.reports[0].carate_150 + "  250 X  " + data.reports[0].carate_250 + "  350 X  " +  data.reports[0].carate_350, value: ''},
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
        window.location.reload();
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

    h6{
            top: -17px;
           position: absolute;
           font-size: 12px;
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
<div> <h6> Mobile:- 9960607512  </h6> </div>
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
