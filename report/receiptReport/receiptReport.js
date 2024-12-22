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


document.getElementById('loginForm1').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    fetchDataAndProcess();
});


function fetchDataAndProcess() {
    var data = {
        from_date: formatDate(document.getElementById("fromdate").value),
        to_date: formatDate(document.getElementById("todate").value),
        customer_name: getElementValueWithDefault('customer', '*'),
        route: getElementValueWithDefault('route', '*'),
        user: getElementValueWithDefault('user', '*')
    };
    console.log(data);
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    return fetch('http://103.174.102.89:3000/receiptReport', {
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
    var columnsToDisplay = ['receipt_id', 'date', 'Customer', 'mobile_no', 'note', 'PaidAmt', 'online_deposite_bank', "onlineAmt", 'discount', 'inCarat', 'Balance'];
    var counter = 1;
    var isAdmin = JSON.parse(localStorage.getItem('sessionData'))[0].usertype === 'Admin';
    var isSuperAdmin = JSON.parse(localStorage.getItem('sessionData'))[0].status === 'Super';
    console.log(data.reports)
    if (data.reports.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No data found.',
          });
    }
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
                cell.textContent = item[key];
            }
        });
        // Add button to open popup
        var buttonCell = row.insertCell();
        var openPopupButton = document.createElement('button');
        openPopupButton.className = 'button';
        openPopupButton.style.backgroundColor = '#26a653';
        openPopupButton.textContent = 'View';
        openPopupButton.addEventListener('click', function () {
            openModal(item); // Pass the data item to the openPopup function
        });
        buttonCell.appendChild(openPopupButton);



        //      // Add Edit button if user is admin
        // if (isAdmin) {
        //     var editCell = row.insertCell();
        //     var editButton = document.createElement('button');
        //     editButton.className = 'button edit-button';
        //     var editLink = document.createElement('a');
        //     editLink.href = '../account/updateAccount.html'; // Edit link destination
        //     editLink.textContent = 'Edit';
        //     editButton.appendChild(editLink);
        //     editButton.addEventListener('click', function() {
        //       editAccount(item); // Pass the user data to the edit function
        //     });
        //     editCell.appendChild(editButton);
        // }

        // Add Delete button if user is admin
        if (isSuperAdmin) {
            var deleteCell = row.insertCell();
            var deleteButton = document.createElement('button');
            deleteButton.className = 'button delete-button';
            deleteButton.style.backgroundColor = '#ff355f';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function () {
                // deleteaccount(item.receipt_id); // Pass the user id to the delete function
                // SweetAlert2 confirmation dialog
                Swal.fire({
                    title: 'Are you sure?',
                    text: "Do you really want to delete this user?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Call the deleteUser function only if confirmed
                        deleteaccount(item.receipt_id);// Pass the user id to the delete function
        
                        // Optional: Show success message
                        Swal.fire(
                            'Deleted!',
                            'The Product has been deleted.',
                            'success'
                        );
                    }
                });
            });
            deleteCell.appendChild(deleteButton);
        }





    });

}


function deleteaccount(userId) {
    // Perform delete operation based on userId
    fetch('http://103.174.102.89:3000/receiptReport/deleteReceiptReport/' + userId, {
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




async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        return fetch('http://103.174.102.89:3000/receiptReport/generate-pdf', {
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
            a.download = 'receiptReport.pdf'; // Set the desidarkgrey file name
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
    console.log("Opening receipt modal for item:", item);
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

            var footerDetails = [
                //{ label: "गेलेले कॅरेट : +", value: data.results[0].carate_amount },
                //{ label: "चालू कलम रक्कम:", value: data.results[0].amount },
                { label: "मागील बाकी:", value: data.reports[0].previous_balance },
                // { label: "बाकी कॅरेट : 100 X  " + data.reports[0].carate_100 + "  150 X  " + data.reports[0].carate_150 + "  250 X  " + data.reports[0].carate_250 + "  350 X  " +  data.reports[0].carate_350, value: ''},
                { label: label.trim(), value: ''},
                //{ label: "एकूण रक्कम:", value: data.results[0].total_amount },
                { label: "रोख जमा रक्कम:", value: data.reports[0].PaidAmt },
                { label: "ऑनलाईन जमा बँक (जमा रक्कम) :", value: data.reports[0].online_deposite_bank + '(' + data.reports[0].onlineAmt + ')' },
                // { label: "ऑनलाईन जमा रक्कम:", value: data.reports[0].onlineAmt },
                { label: "सूट रक्कम:", value: data.reports[0].discount },
                // { label: "जमा कॅरेट:  -" + "100 * " +data.reports[0].c100 +" | 150 * " + data.reports[0].c150+ " | 250 * " +data.reports[0].c250 + " | 350 * " + data.reports[0].c350, value: data.reports[0].inCarat },
                { label: label1.trim(), value: data.reports[0].inCarat },
                { label: label2.trim(), value: '' },  
                { label: "आत्ता पर्यंतचे येणे बाकी:", value: data.reports[0].Balance },  
                // Add other bill details similarly
            ];
            

            footerDetails.forEach(function (detail) {
                var row = document.createElement("tr");
                row.innerHTML = `
                    <td align="right" colspan="6" style="text-align: right;"><font color="black" >${detail.label}</font></td>
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

// function closePopup() {
//     document.querySelector('.popup').style.display = 'none';
// }




