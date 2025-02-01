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

    var selectedValues = $('#route').val();
    // if (selectedValues = []){ selectedValues ="*"; }
    // console.log('Selected values:', selectedValues);
    if (selectedValues.length === 0) {
        selectedValues ="*";
    }
    var data = {
        from_date : formatDate(document.getElementById("fromdate").value),
        to_date : formatDate(document.getElementById("todate").value),
        cust_name : getElementValueWithDefault('customer', '*') , 
        added_by : getElementValueWithDefault('user', '*') , 
        route : selectedValues || '*',
    };
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    return fetch('http://103.174.102.89:3000/khatawani', {
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


var grandTotals = {balance: 0,
    out_carate: 0,
    total_balance: 0,
    cash: 0,
    online_bank: 0,
    online: 0,
    discount: 0, 
    in_carate: 0,
    remaining: 0
};

function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['summary', 'date', 'customer_name', 'route', 'balance', 'out_carate', 'total_balance', 'cash', 'online_bank', 'online', 'discount', 'in_carate', 'remaining'];
    var counter = 1;
    console.log(data.reports);
    
    if (data.reports.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No data found.',
          });
    }

    var grandTotals = {
        balance: 0,
        out_carate: 0,
        total_balance: 0,
        cash: 0,
        online_bank: 0,
        online: 0,
        discount: 0,
        in_carate: 0,
        remaining: 0
    };

    data.reports.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            if (key === 'date') {
                console.log(item[key]);
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
                if (key in grandTotals) {
                    grandTotals[key] += parseFloat(item[key]) || 0;
                }
            }
        });

        // Add button to open popup
        var buttonCell = row.insertCell();
        var openPopupButton = document.createElement('button');
        openPopupButton.className = 'button';
        openPopupButton.style.backgroundColor = '#18b3a4';
        openPopupButton.textContent = 'View';
        openPopupButton.addEventListener('click', function () {
            console.log(item.summary.split('(')[0])
            if (item.summary.split('(')[0] == 'Sale'){
                console.log(item.summary.split('(')[1].split(')')[0])
                openModal(item.summary.split('(')[1].split(')')[0]); // Pass the data item to the openPopup function for Sale
            }else{
                console.log(item.summary.split('(')[1].split(')')[0])
                openModal1(item.summary.split('(')[1].split(')')[0]); // Pass the data item to the openPopup function for Receipt
            }
            //openModal(item); // Pass the data item to the openPopup function
        });
        buttonCell.appendChild(openPopupButton);
    });

    var lastEntry = data.reports[data.reports.length - 1];
    // Add row for grand total
    var totalRow = tbody.insertRow();
    totalRow.insertCell(); // Add empty cell for counter column
    totalRow.insertCell(); // Add empty cell for summary column
    totalRow.insertCell(); // Add empty cell for date column
    totalRow.insertCell(); // Add empty cell for customer_name column

    var grandTotalLabelCell = totalRow.insertCell();
    grandTotalLabelCell.textContent = 'Grand Total';
    grandTotalLabelCell.style.fontWeight = 'bold'; // Make label text bold

    columnsToDisplay.slice(4,-1).forEach(function(key) {
        var totalCell = totalRow.insertCell();
        totalCell.textContent = grandTotals[key] || '';
        totalCell.style.fontWeight = 'bold'; // Make value text bold
    });

    var grandTotalLabelCell1 = totalRow.insertCell();
    grandTotalLabelCell1.textContent = lastEntry['remaining'];
    grandTotalLabelCell1.style.fontWeight = 'bold'; // Make label text bold

}



// async function exportToExcel() {
//     try {
//         const data = await fetchDataAndProcess();

//         // Function to format dates in IST without time
//         const formatDateToIST = (dateString) => {
//             const date = new Date(dateString);
//             return date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
//         };
        
//         const customHeaders = ['bill_no', 'date', 'cust_name','route','amount', 'carate_amount',"TotalKalam",'cash','online_acc','online_amt', 'discount','inCarat', 'balance'];
        
//         // Export to PDF using jsPDF and autoTable
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF();
        
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
//         // Adding the headers and data
//         const reportData = data.reports.map(report => [
//             report.summary,
//             formatDateToIST(report.date), // Format date to IST
//             report.customer_name,
//             report.route,
//             report.balance,
//             report.out_carate,
//             report.total_balance,
//             report.cash,
//             report.online_bank,
//             report.online,
//             report.discount,
//             report.in_carate,
//             report.remaining
//         ]);

//         doc.autoTable({
//             head: [customHeaders],
//             body: reportData,
//             startY: startY,
//             theme: 'grid'
//         });

//         // Adding Grand Totals
//         // const grandTotals = data.Grand || {};
//         console.log("Grand Totals: ", grandTotals); // Debugging line to check grand totals

//         const grandTotalsData = [
//             ["Grand Bill Amount", grandTotals['balance'] || 0],
//             ["Grand outCarate", grandTotals['out_carate'] || 0],
//             ["Total Bill Amount", grandTotals['total_balance'] || 0],
//             ["Total Cash", grandTotals['cash'] || 0],
//             ["Online Amount", grandTotals['online'] || 0],
//             ["Grand Discount", grandTotals['discount'] || 0],
//             ["Grand inCarate", grandTotals['in_carate'] || 0],
//             ["Grand balance", grandTotals['remaining'] || 0]
//         ];

//         // Debugging line to check grandTotalsData
//         console.log("Grand Totals Data: ", grandTotalsData);

//         // Get the position where the first table ends
//         const finalY = doc.autoTable.previous.finalY || 60; // 60 is a fallback value in case previous.finalY is undefined

//         doc.autoTable({
//             head: [['Description', 'Amount']],
//             body: grandTotalsData,
//             startY: finalY + 10, // Adding some space between tables
//             theme: 'grid'
//         });

//         // Save the PDF
//         doc.save('Khatawani.pdf');
//     } catch (error) {
//         console.error('Error exporting data:', error);
//     }
// }


async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        return fetch('http://103.174.102.89:3000/khatawani/generate-pdf', {
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
            a.download = 'Khatawani.pdf'; // Set the desidarkgrey file name
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





function closePopup() {
    document.querySelector('.popup').style.display = 'none';
}


function openModal(item) {
    // Your code to open the modal with the data from 'item'
    console.log("Opening modal for item:", item);
    

    fetch('http://103.174.102.89:3000/bill/' + item)
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
        }); // Format onl
        var billDetails = [
            { label: "बिल क्र.:" + item,value: "तारीख:" + utcDate.toLocaleString('en-IN', options) + ' (' + convertToIST(data.results[0].created_at) + ')' },
            { label: "ग्राहकाचे नाव:"+ data.results[0].cust_name, value: "संपर्क क्र.:" + data.results[0].mobile_no },
            { label: "पत्ता:" + data.results[0].address,   value: "संदर्भ :  " + data.results[0].comment },
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
            "आत्ता पर्यंतचे येणे बाकी कॅरेट : " +
            (data.results[0].baki_100 > 0 ? "100 X " + data.results[0].baki_100 + " " : "") +
            (data.results[0].baki_150 > 0 ? "150 X " + data.results[0].baki_150 + " " : "") +
            (data.results[0].baki_250 > 0 ? "250 X " + data.results[0].baki_250 + " " : "") +
            (data.results[0].baki_350 > 0 ? "350 X " + data.results[0].baki_350 : "");

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

        var showLabels  = true
        if (data.results[0].cr_dr_type == 'no') { showLabels = false }

        var footerDetails = [
            // { label: "गेलेले कॅरेट : 100 X  " + data.results[0].in_carate_100 + "  150 X  " + data.results[0].in_carate_150 + "  250 X  " + data.results[0].in_carate_250 + "  350 X  " +  data.results[0].in_carate_350, value: data.results[0].carate_amount },
            { label: label1.trim(), value: data.results[0].carate_amount, visible: showLabels },
            { label: "चालू कलम रक्कम:", value: data.results[0].amount, visible: true },
            { label: "मागील बाकी:", value: data.results[0].pre_balance , visible: true},
            { label: "एकूण रक्कम:", value: data.results[0].total_amount, visible: true },
            { label: "रोख जमा रक्कम:", value: data.results[0].cash, visible: true },
            { label: "ऑनलाईन जमा रक्कम (जमा बँक) :", value: data.results[0].online_amt + '(' + data.results[0].online_acc + ')', visible: true },
            // { label: "ऑनलाईन जमा बँक :", value: data.results[0].online_acc, visible: true },
            // { label: "ऑनलाईन जमा रक्कम:", value: data.results[0].online_amt, visible: true },
            { label: "सूट रक्कम:", value: data.results[0].discount, visible: true },
            // { label: "जमा कॅरेट: 100 X  " + data.results[0].out_carate_100 + "  150 X  " + data.results[0].out_carate_150 + "  250 X  " + data.results[0].out_carate_250 + "  350 X  " +  data.results[0].out_carate_350, value: data.results[0].inCarat },
            { label: label2.trim(), value: data.results[0].inCarat, visible: showLabels },
            { label: label.trim(), value: '', visible: showLabels},
            { label: "आत्ता पर्यंतचे येणे बाकी:", value: data.results[0].balance, visible: true },
            //{ label: "बाकी कॅरेट : 100 X  " + data.results[0].carate_100 + "  150 X  " + data.results[0].carate_150 + "  250 X  " + data.results[0].carate_250 + "  350 X  " +  data.results[0].carate_350, value: ''} 
            
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
        var columnsToDisplay = ['product','bata', 'mark','quantity', 'rate', 'price'];
        var counter = 1;
        itemsTableBody.classList.add('align-right');
        data.products.forEach(function (item) {
            var row = itemsTableBody.insertRow();
            var cell = row.insertCell();
            cell.textContent = counter++;
            cell.style.textAlign = "right"; // Align text to the right
            columnsToDisplay.forEach(function (key) {
                var cell = row.insertCell();
                cell.textContent = item[key];
                cell.style.textAlign = "right"; // Align text to the right
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

table{
border: none; /* Removes the table's border */
}

.box-container {
    background-color: #fff;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
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

.tablefooter {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px; /* Add space between rows */
    margin-bottom: 10px;
    border: none; /* Removes borders from table headers and cells */
}

th, td {
    border: none; /* Removes borders from table headers and cells */
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

.itemsTableBody{
text-align:right;
 border: none; /* Removes borders from table headers and cells */
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
<div class="logo">
    <img src="../../assets/img/a4.png" alt="Company Logo">
</div>
</div>
<div class="container2">

<!-- Bill details -->
<table  style="border: none;">
    <tbody id = 'TableBody'>
    </tbody>
</table>
<hr>
<!-- Items table -->
<table id = 'TableBody1'  style="border: none;">
    <thead>
        <tr>
            <th style="text-align:right;">अनु क्र.</th>
            <th style="text-align:right;">प्रॉडक्ट</th>
            <th style="text-align:right;">बटा</th>
            <th style="text-align:right;">मार्क</th>
            <th style="text-align:right;">नग</th>
            <th style="text-align:right;">किंमत</th>
            <th style="text-align:right;">रक्कम</th>
        </tr>
    </thead>
    <tbody id='itemsTableBody'>
    </tbody>
   </table  style="border: none;">
   <div style="height: 10px;"></div>
   <table>
    <tfoot style="background-color: #e8e6e4; border: none;""  id ="tablefooter">
    </tfoot>
<hr>
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




function openModal1(item) {
    // Your code to open the modal with the data from 'item'
    console.log("Opening receipt modal for item:", item);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

        fetch('http://103.174.102.89:3000/receiptReport/' + item)
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
                { label: "जमा पावती क्र.:   " + item, value: "तारीख:   " + utcDate.toLocaleString('en-IN', options) },
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
