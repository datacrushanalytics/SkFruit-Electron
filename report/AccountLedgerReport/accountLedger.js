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
        account_name: getElementValueWithDefault('account', '*')
    };
    console.log(data);
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    return fetch('http://103.174.102.89:3000/accountLedger', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        loader.style.display = 'none';
        if (response.status === 404) {
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
        console.log(result);
        populateTable4(result);
        // populateTable5(result);
        return result;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows

    var columnsToDisplay = ['date', 'bill_no', 'cust_name','online_acc', 'online_amt'];
    var counter = 1;
    console.log(data.reports);
    if (data.reports.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No data found.',
          });

    }
    let grandTotalQuantity = 0;
    data.reports.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            if (key === 'date') {
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
                if (key === 'online_amt') {
                    grandTotalQuantity += item[key];
                }
            }
        });
    });

    // Add the Grand Total Row
    var totalRow = tbody.insertRow();

    // Empty cells for serial number, date, etc.
    totalRow.insertCell().textContent = ''; // Serial number
    totalRow.insertCell().textContent = ''; // Date
    totalRow.insertCell().textContent = ''; // From account
    totalRow.insertCell().textContent = ''; // To account
    // totalRow.insertCell().textContent = ''; // Comment

    // Cell for "Grand Total" label
    var grandTotalLabelCell = totalRow.insertCell();
    grandTotalLabelCell.textContent = 'Grand Total:';
    grandTotalLabelCell.style.fontWeight = 'bold';
    grandTotalLabelCell.colSpan = 1; // Adjust if needed to span across columns

    // Cell for the Grand Total value for "amounr"
    var grandTotalValueCell = totalRow.insertCell();
    grandTotalValueCell.textContent = grandTotalQuantity.toFixed(2); // Display grand total with 2 decimal places
    grandTotalValueCell.style.fontWeight = 'bold';
    grandTotalValueCell.style.textAlign = 'right'; // Align to the right

}

// function populateTable5(data) {
//     var tbody = document.getElementById('tableBody1');
//     tbody.innerHTML = ''; // Clear existing rows
//     var columnsToDisplay = ['p_id', 'date', 'from_account', 'to_account', 'comment', 'prev_balance', 'amounr'];
//     var counter = 1;
//     console.log(data.Receipt);
//     if (data.Receipt.length === 0) {
//         Swal.fire({
//             icon: 'error',
//             title: 'Oops...',
//             text: 'No data found.',
//           });

//         return;
//     }
//     let grandTotalPreBalance = 0;
//     let grandTotalAmounr = 0;
//     let lastPreBalance = 0; // Variable to store the previous balance of the last entry
//     let lastAmounr = 0; // Variable to store the amount of the last entry

//     data.Receipt.forEach(function (item, index) {
//         var row = tbody.insertRow();
//         var cell = row.insertCell();
//         cell.textContent = counter++;
//         columnsToDisplay.forEach(function (key) {
//             var cell = row.insertCell();
//             if (key === 'date') {
//                 var utcDate = new Date(item[key]);
//                 var options = {
//                     year: 'numeric',
//                     month: '2-digit',
//                     day: '2-digit',
//                     timeZone: 'Asia/Kolkata'
//                 };
//                 cell.textContent = utcDate.toLocaleString('en-IN', options);
//             } else {
//                 cell.textContent = item[key];
//                 if (key === 'prev_balance') {
//                     grandTotalPreBalance += item[key];
//                     if (index === data.Receipt.length - 1) {
//                         lastPreBalance = item[key]; // Capture the previous balance of the last entry
//                     }
//                 }
//                 if (key === 'amounr') {
//                     grandTotalAmounr += item[key];
//                     if (index === data.Receipt.length - 1) {
//                         lastAmounr = item[key]; // Capture the amount of the last entry
//                     }
//                 }
//             }
//         });
//     });

   
    // // Append last entry's previous balance row
    // var lastPreBalanceRow = tbody.insertRow();
    // lastPreBalanceRow.insertCell().textContent = ''; // Empty cell for serial number
    // lastPreBalanceRow.insertCell().textContent = ''; // Empty cell for date
    // lastPreBalanceRow.insertCell().textContent = ''; // Empty cell for from_account
    // lastPreBalanceRow.insertCell().textContent = ''; // Empty cell for to_account
    // lastPreBalanceRow.insertCell().textContent = ''; // Empty cell for comment

    // // Cell for Last Entry Previous Balance label
    // var lastPreBalanceLabelCell = lastPreBalanceRow.insertCell();
    // lastPreBalanceLabelCell.textContent = 'Previous Balance:';
    // lastPreBalanceLabelCell.style.fontWeight = 'bold'; // Make label text bold

    // // Cell for Last Entry Previous Balance value
    // var lastPreBalanceValueCell = lastPreBalanceRow.insertCell();
    // lastPreBalanceValueCell.textContent = lastPreBalance;
    // lastPreBalanceValueCell.style.fontWeight = 'bold'; // Make value text bold

    // Append last entry's balance after subtraction row
// }
function populateTable5(data) {
    // Clear the existing rows in the table
    var tbody = document.getElementById('tableBody1');
    tbody.innerHTML = ''; // Clear any existing rows
    
    if (!data.Receipt || data.Receipt.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No data found.',
        });
        return;
    }

    var columnsToDisplay = ['p_id', 'date', 'from_account', 'to_account', 'comment', 'prev_balance', 'amounr'];
    var counter = 1;
    let grandTotalPreBalance = 0;
    let grandTotalAmounr = 0;

    // Loop through each item in the Receipt data
    data.Receipt.forEach(function (item, index) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;

        columnsToDisplay.forEach(function (key) {
            var cell = row.insertCell();

            if (key === 'date') {
                var utcDate = new Date(item[key]);
                var options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' };
                cell.textContent = utcDate.toLocaleString('en-IN', options);
            } else {
                cell.textContent = item[key];
                if (key === 'prev_balance') {

                    grandTotalPreBalance += parseFloat(item[key] || 0);

                }
                if (key === 'amounr') {
                    grandTotalAmounr += item[key];
                }
            }
        });
    });

    // Add the Grand Total Row
    var totalRow = tbody.insertRow();

    // Empty cells for serial number, date, etc.
    // totalRow.insertCell().textContent = ''; // Serial number
    // totalRow.insertCell().textContent = ''; // Date
    // totalRow.insertCell().textContent = ''; // From account

    // Cell for "Grand Total" label


    // Cell for the Grand Total value
    var grandTotalValueCell = totalRow.insertCell();
    grandTotalValueCell.textContent = grandTotalAmounr.toFixed(2); // Display grand total with 2 decimal places
    grandTotalValueCell.style.fontWeight = 'bold';

    // Ensure the DOM is refreshed after changes
    console.log('Table populated, grand total: ', grandTotalAmounr.toFixed(2));
}

async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        return fetch('http://103.174.102.89:3000/supplierLedger/generate-pdf', {
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
            a.download = 'supplierLedgerReport.pdf'; // Set the desidarkgrey file name
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

