document.getElementById('login').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
    var sessionData = JSON.parse(localStorage.getItem('sessionData'));
    var isAdmin = sessionData[0].name;
    console.log('admin name',isAdmin);
    var loader = document.getElementById('loader');
    loader.style.display = 'block';
    console.log(document.getElementById('number').value)
    var formData = {
        bill_no: parseInt(document.getElementById('bill').value),
        date: document.getElementById('date').value,
        cust_name: document.getElementById('grahk').value,
        route: document.getElementById('Route').value,
        address: document.getElementById('address').value,
        mobile_no: document.getElementById('number').value,
        comment: document.getElementById('sandarbh').value,
        amount: parseInt(document.getElementById('bill1').value) || 0,
        carate_amount: parseInt(document.getElementById('total1').value) || 0,
        pre_balance: parseInt(document.getElementById('previousBalance').value) || 0,
        total_amount: parseInt(document.getElementById('totalBill').value) || 0,
        cash: parseInt(document.getElementById('bill_cash').value) || 0,
        online_acc: document.getElementById('onlineAcc').value,
        online_amt: parseInt(document.getElementById('online').value) || 0,
        discount: parseInt(document.getElementById('discount').value) || 0,
        inCarate: parseInt(document.getElementById('total2').value) || 0,
        balance: parseInt(document.getElementById('baki').value) || 0,
        note: document.getElementById('note').value,
        in_carate_100: parseInt(document.getElementById('carate100').value) || 0,
        in_carate_150: parseInt(document.getElementById('carate150').value) || 0,
        in_carate_250: parseInt(document.getElementById('carate250').value) || 0,
        in_carate_350: parseInt(document.getElementById('carate350').value) || 0,
        out_carate_100: parseInt(document.getElementById('carate1100').value) || 0,
        out_carate_150: parseInt(document.getElementById('carate1150').value) || 0,
        out_carate_250: parseInt(document.getElementById('carate1250').value) || 0,
        out_carate_350: parseInt(document.getElementById('carate1350').value) || 0,
        added_by: isAdmin,
        baki_100: parseInt(document.getElementById('carate2100').value) || 0,
        baki_150: parseInt(document.getElementById('carate2150').value) || 0,
        baki_250: parseInt(document.getElementById('carate2250').value) || 0,
        baki_350: parseInt(document.getElementById('carate2350').value) || 0,
    };

    try {
        console.log("Emissin", parseInt(document.getElementById('bill1').value))
        const value = parseInt(document.getElementById('bill1').value);

        if (isNaN(value)) {
            console.log("Hello");
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Please add the product",
            });
            loader.style.display = 'none';
            throw new Error('Product Was not added');
        }

        const response = await fetch('http://103.174.102.89:3000/saleData/insertsale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log("response of API: ", response);
        const result = await response.json();
        loader.style.display = 'none';
        console.log('Entry added successfully:', result);
    
        openModal({"bill_no": formData.bill_no})
        //window.location.reload(); // 
    } catch (error) {
        console.error('Error:', error);
    }
});



function openModal(item) {
    // Your code to open the modal with the data from 'item'
    console.log("Opening modal for item:", item.bill_no);
    

    fetch('http://103.174.102.89:3000/bill/' + item.bill_no)
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
            { label: "बिल क्र.:" + item.bill_no, value: "तारीख:" + utcDate.toLocaleString('en-IN', options) },
            { label: "ग्राहकाचे नाव:"+ data.results[0].cust_name, value: "संपर्क क्र.:" + data.results[0].mobile_no },
            { label: "पत्ता:" + data.results[0].address,   value: "Time:   " + convertToIST(data.results[0].created_at) },
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
            { label: "ऑनलाईन जमा बँक (जमा रक्कम) :", value: data.results[0].online_acc + '(' + data.results[0].online_amt + ')', visible: true },
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
                <td align="right" colspan="1" style="text-align:right;"><font color="black">${detail.value}</font></td>
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

