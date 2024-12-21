
function populateDropdown(data) {
    var userNameDropdown = document.getElementById('bata');
    userNameDropdown.innerHTML = ''; // Clear existing options

    // Create and append new options based on API data
    data.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item.name; // Set the value
        option.textContent = item.name; // Set the display text
        userNameDropdown.appendChild(option);
    });

    // Add a placeholder option
    var placeholderOption = document.createElement('option');
    placeholderOption.value = ""; // Set an empty value
    placeholderOption.textContent = "Select Supplier Name"; // Set placeholder text
    placeholderOption.disabled = true; // Disable the option
    placeholderOption.selected = true; // Select the option by default
    userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
}

function populateDropdown1(data) {
    var userNameDropdown = document.getElementById('product');
    userNameDropdown.innerHTML = ''; // Clear existing options
    // Add a hardcoded option
    var hardcodedOption = document.createElement('option');
    hardcodedOption.value = "CASH"; // Set the value for the hardcoded option
    hardcodedOption.textContent = "CASH"; // Set the display text for the hardcoded option
    userNameDropdown.appendChild(hardcodedOption);

    // Create and append new options based on API data
    data.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item.name; // Set the value
        option.textContent = item.name; // Set the display text
        userNameDropdown.appendChild(option);
    });

    // Add a placeholder option
    var placeholderOption = document.createElement('option');
    placeholderOption.value = ""; // Set an empty value
    placeholderOption.textContent = "Select Online Account"; // Set placeholder text
    placeholderOption.disabled = true; // Disable the option
    placeholderOption.selected = true; // Select the option by default
    userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
}



document.getElementById('paymentForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
console.log("jahsafhfa")
var sessionData = JSON.parse(localStorage.getItem('sessionData'));
// function form2(){
    var formData = {
        date: document.getElementById('date').value,
        from_account: document.getElementById('product').value,
        to_account: document.getElementById('bata').value,
        comment: document.getElementById('comment').value,
        mobile_no: document.getElementById('number').value,
        prev_balance: parseInt(document.getElementById('previousBalance').value) || 0,
        amounr: parseInt(document.getElementById('amount').value) || 0 ,
        cash: parseInt(document.getElementById('bill_cash').value) || 0 ,
        online: parseInt(document.getElementById('online').value) || 0 ,
        SupplierAccount:  document.getElementById('SupplierAccount').value || "Dummy",
        discount: parseInt(document.getElementById('discount').value) || 0 ,
        added_by: sessionData[0].name     
    };
    var loader = document.getElementById('loader');
    loader.style.display = 'block';


    await fetch('http://localhost:3000/paymentData/insertPayment', {
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
        console.log(result.insertId)
        openModal(result.insertId)
        // Swal.fire({
        //     icon: 'success',
        //     title: 'Success!',
        //     text: 'Payment Data is added Successfully',
        //     })
        // window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });

});



function openModal(item) {
    // Your code to open the modal with the data from 'item'
    console.log("Opening modal for item:", item);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    fetch('http://103.174.102.89:3000/paymentData/' + String(item))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            console.log("AJAJAJ",data[0].date)
            loader.style.display = 'none';
            var utcDate = new Date(data[0].date);
            var options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'Asia/Kolkata'
            };


            var tableBody = document.getElementById("TableBody");
            tableBody.innerHTML = ""; // Clear existing rows

            var billDetails = [
                
                { label: "तारीख:", value: utcDate.toLocaleString('en-IN', options) },
                { label: "Payment Id", value:  data[0].p_id},
                { label: "Supplier:", value: data[0].to_account },
                { label: "prev_balance", value: data[0].prev_balance },
                { label: "Cash", value: data[0].cash },
                { label: "Bank Account:", value: data[0].from_account },
                { label: "Online", value: data[0].online },
                { label: "Discount", value: data[0].discount },
                { label: "comment", value: data[0].comment },
                { label: "Net balance", value: data[0].amounr }
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
<div> <h6> Mobile:- 9960607512  </h6> </div>
    <div class="logo">
        <img src="../../assets/img/logo.png" alt="Company Logo">
    </div>
    <div>
        <h1>सावता फ्रुट सप्लायर्स</h1>
        <p>ममु.पोस्ट- काष्टी ता.- श्रीगोंदा, जि. अहमदनगर - 414701</p>
        <p>मोबाईल नं:- 9860601102  / 9922676380 / 9156409970</p>
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



