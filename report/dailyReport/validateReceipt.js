// // Fetch data from API
// document.addEventListener('DOMContentLoaded', function () {
//     // Get the current date
//     var currentDate = new Date();
//     // Format the date as mm/dd/yyyy
//     var formattedDate = currentDate.getFullYear() + '-' + (String(currentDate.getMonth() + 1).padStart(2, '0')) + '-' + (String(currentDate.getDate()).padStart(2, '0'));
//     // Set the placeholder of the input field to the formatted date
//     document.getElementById('date').value = formattedDate;

//     var sessionData = JSON.parse(localStorage.getItem('sessionData'));
//     var isAdmin = sessionData && sessionData[0].usertype === 'Admin';
//     // Check if the user is an admin and show/hide the button accordingly
//     if (!isAdmin) {
//         document.getElementById('date').readOnly = true; // Hide the button for non-admin users
//     }

//     fetch('http://103.174.102.89:3000/fetchReceiptid')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         // Populate dropdown with API data
//         document.getElementById('pavti').value = parseInt(data[0]['num']) + 1;
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// });

document.getElementById('loginForm1').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
    var sessionData = JSON.parse(localStorage.getItem('sessionData'));
    var isAdmin = sessionData[0].name;
    console.log('admin name',isAdmin);
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
        added_by: isAdmin,     
    };
    var loader = document.getElementById('loader');
    loader.style.display = 'block';
    await fetch('http://103.174.102.89:3000/receiptData/updateReceipt/' + formData.receiptId , {
        method: 'PUT',
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

    fetch('http://103.174.102.89:3000/receiptReport/' + item.receipt_id)
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


        function convertToIST(dateString) {
            const utcDate = new Date(dateString); // Parse the UTC date
            const options = {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            return utcDate.toLocaleString('en-IN', options);
        }

        var tableBody = document.getElementById("TableBody");
        tableBody.innerHTML = ""; // Clear existing rows

        const currentDate = new Date(); // Get the current date and time
        const timestamp = currentDate.toLocaleString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
        }); // Format only the time (HH:MM:SS AM/PM)
        var billDetails = [
            { label: "जमा पावती क्र.:   " + item.receipt_id, value: "तारीख:   " + utcDate.toLocaleString('en-IN', options) },
            { label: "ग्राहकाचे नाव:   " + data.reports[0].Customer, value: "संपर्क क्र.:   " + data.reports[0].mobile_no },
            { label: "पत्ता:   " + data.reports[0].address, value: "Time:   " + convertToIST(data.reports[0].created_at) },
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
            (data.reports[0].carate_100 > 0 ? "100 X " + data.reports[0].carate_100 + " " : "") +
            (data.reports[0].carate_150 > 0 ? "150 X " + data.reports[0].carate_150 + " " : "") +
            (data.reports[0].carate_250 > 0 ? "250 X " + data.reports[0].carate_250 + " " : "") +
            (data.reports[0].carate_350 > 0 ? "350 X " + data.reports[0].carate_350 : "");

        const label1 = 
            "जमा कॅरेट : " +
            (data.reports[0].c100 > 0 ? "100 X " + data.reports[0].c100 + " " : "") +
            (data.reports[0].c150 > 0 ? "150 X " + data.reports[0].c150 + " " : "") +
            (data.reports[0].c250 > 0 ? "250 X " + data.reports[0].c250 + " " : "") +
            (data.reports[0].c350 > 0 ? "350 X " + data.reports[0].c350 : "");

        const label2 = 
            "आत्ता पर्यंतचे येणे बाकी कॅरेट: " +
            (data.reports[0].baki_100 > 0 ? "100 X " + data.reports[0].baki_100 + " " : "") +
            (data.reports[0].baki_150 > 0 ? "150 X " + data.reports[0].baki_150 + " " : "") +
            (data.reports[0].baki_250 > 0 ? "250 X " + data.reports[0].baki_250 + " " : "") +
            (data.reports[0].baki_350 > 0 ? "350 X " + data.reports[0].baki_350 : "");

            var showLabels  = true
            if (data.reports[0].cr_dr_type == 'no') { showLabels = false }

            var footerDetails = [
                //{ label: "गेलेले कॅरेट : +", value: data.results[0].carate_amount },
                //{ label: "चालू कलम रक्कम:", value: data.results[0].amount },
                { label: "मागील बाकी:", value: data.reports[0].previous_balance, visible: true },
                // { label: "बाकी कॅरेट : 100 X  " + data.reports[0].carate_100 + "  150 X  " + data.reports[0].carate_150 + "  250 X  " + data.reports[0].carate_250 + "  350 X  " +  data.reports[0].carate_350, value: ''},
                { label: label.trim(), value: '', visible: showLabels},
                //{ label: "एकूण रक्कम:", value: data.results[0].total_amount },
                { label: "रोख जमा रक्कम:", value: data.reports[0].PaidAmt, visible: true },
                { label: "जमा रक्कम  (ऑनलाईन जमा बँक) :", value: data.reports[0].onlineAmt + '(' + data.reports[0].online_deposite_bank + ')' , visible: true},
                // { label: "ऑनलाईन जमा रक्कम:", value: data.reports[0].onlineAmt },
                { label: "सूट रक्कम:", value: data.reports[0].discount , visible: true},
                // { label: "जमा कॅरेट:  -" + "100 * " +data.reports[0].c100 +" | 150 * " + data.reports[0].c150+ " | 250 * " +data.reports[0].c250 + " | 350 * " + data.reports[0].c350, value: data.reports[0].inCarat },
                { label: label1.trim(), value: data.reports[0].inCarat, visible: showLabels },
                { label: label2.trim(), value: '', visible: showLabels },  
                { label: "आत्ता पर्यंतचे येणे बाकी:", value: data.reports[0].Balance, visible: true },  
                // Add other bill details similarly
            ];
            

            footerDetails.forEach(function (detail) {
                var row = document.createElement("tr");
                row.innerHTML = `
                        <td align="right" colspan="6" style="text-align:right;"><font color="black">${detail.label}</font></td>
                        `;

                        if(detail.visible){
                            row.innerHTML += `<td align="right" colspan="1" style="text-align:right;"><font color="black">${detail.value}</font></td>`;
                    }
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
    // window.location.reload();
    window.location.href = "./dailyReport.html";
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
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.header .logo img {
    height: 125px; /* Adjust the size of the logo */
    width: full;  /* Maintain the aspect ratio */
    margin-top: 10px; /* Adjust the top margin if needed */
}


.container2 {
    max-width: 600px;
    margin: 0 auto;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 12px; /* Adjust font size */
    font-weight: bold;
}

.container2::after {
    content: url("../../assets/img/logo.png"); /* Replace with your watermark image path */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Center the watermark */
    opacity: 0.2; /* Adjust watermark opacity (0 for transparent, 1 for solid) */
    z-index: -0; /* Place the watermark behind the content */
    }



table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
}

th, td {
    border: 1px solid #ccc;
    padding: 6px; /* Adjust padding */
    background-color: #fffef4;
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
@page {
size: A5 portrait; /* A5 paper size in portrait orientation */
margin: 5mm; /* Reduced margins */
}

.details, .header-details, .close {
display: none; /* Hide unnecessary elements when printing */
}

body {
border: 2px solid #000; /* Black border surrounding the entire content */
margin: 0;
padding: 0;
background-color: #e8e6e4; /* Light gray background */
width: 156mm;
height: 210mm;
box-sizing: border-box; /* Include borders in width/height calculations */
-webkit-print-color-adjust: exact; /* Ensure background color prints in WebKit-based browsers */
color-adjust: exact; /* Standard property for consistent printing */
}

.content {
background-color: #e8e6e4; /* Light gray background for the bill content */
border: 2px solid #000; /* Black border surrounding the content */
border-radius: 5px;
width: 138mm; /* Fit within reduced margins */
height: auto;
margin: 0 auto;
padding: 10px; /* Internal padding for spacing */
box-sizing: border-box; /* Ensure padding doesn't affect width */
-webkit-print-color-adjust: exact; /* Ensure content background color prints */
color-adjust: exact;
}

.content::after {
    content: url("../../assets/img/logo.png"); /* Replace with your watermark image path */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Center the watermark */
    opacity: 0.2; /* Adjust watermark opacity (0 for transparent, 1 for solid) */
    z-index: -0; /* Place the watermark behind the content */
    }

header {
text-align: center;
margin-bottom: 10px;
border-bottom: 1px solid #000; /* Bottom border for the header */
padding-bottom: 5px;
}

header img {
display: block;
margin: 0 auto; /* Center the image */
max-width: 100%; /* Ensure the image is responsive */
width: 100%; /* Full width of the content area */
height: auto;
box-sizing: border-box; /* Ensure image width fits within the border */
}

table {
width: 100%; /* Full width for table */
border-collapse: collapse; /* Remove gaps between cells */
margin-top: 10px;
border: none;
}

th, td {
padding: 5px; /* Optimized padding for reduced page size */
text-align: left;
font-size: 11px; /* Slightly smaller font size to fit content */
}

th {
background-color: #e8e6e4; /* Light gray background for headers */
font-size: 12px;
-webkit-print-color-adjust: exact; /* Ensure header background color prints */
color-adjust: exact;
}

footer {
margin-top: 15px;
text-align: center;
font-size: 11px; /* Footer font size adjusted */
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
    padding: 8px; /* darkgreyuced padding */
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
<div></h6> </div>
<div class="logo">
    <img src="../../assets/img/a4.png" alt="Company Logo">
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
    <tfoot style="background-color: #e8e6e4; text-align : left;" id="tablefooter">
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
