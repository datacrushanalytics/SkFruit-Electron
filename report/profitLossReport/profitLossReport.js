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
        customer: getElementValueWithDefault('customer', '*'),
        vehicle: getElementValueWithDefault('vehicle', '*'),
        bata: getElementValueWithDefault('bata', '*'),
        user: getElementValueWithDefault('user', '*'),
        route: getElementValueWithDefault('route', '*'),
        bill: getElementValueWithDefault('bill', '*')
    };
    console.log(data);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    return fetch('http://52.66.126.53/profitLossReport', {
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
            console.log(result);
            populateTable4(result);
            return result;
            // Optionally, you can redirect or show a success message here
        })
        .catch(error => {
            console.error('Error:', error);
            // Optionally, you can display an error message here
        });
}


// function populateTable4(data) {
//     var tbody = document.getElementById('tableBody');
//     tbody.innerHTML = ''; // Clear existing rows
//     var columnsToDisplay = ['bill_no', 'gadi_number', 'bata', 'product', 'sold_quantity', 'purchase_price', "selling_price", 'Amount', 'profit_loss'];
//     var counter = 1;
//     var grandTotals = {
//         sold_quantity: 0,
//         purchase_price: 0,
//         selling_price: 0,
//         Amount: 0,
//         profit_loss: 0
//     };
//     console.log(data.reports);
//     if (data.reports.length === 0) {
//         return;
//     }
//     data.reports.forEach(function (item) {
//         var row = tbody.insertRow();
//         var cell = row.insertCell();
//         cell.textContent = counter++;
//         columnsToDisplay.forEach(function (key) {
//             var cell = row.insertCell();
//             if (key === 'profit_loss') {
//                 if (item[key].startsWith('Loss')) {
//                     cell.style.color = 'red';
//                 } else {
//                     cell.style.color = 'green';
//                 }
//                 grandTotals[key] += parseFloat(item[key].replace(/[^0-9.-]+/g, "")) || 0;
//             } else if (['sold_quantity', 'purchase_price', "selling_price", 'Amount'].includes(key)) {
//                 grandTotals[key] += parseFloat(item[key]) || 0;
//             }
//             cell.textContent = item[key];
//         });
//     });

//     // Create the grand total row
//     var totalRow = tbody.insertRow();
    
//     // Create cell for 'Grand Total' heading
//     var headingCell = totalRow.insertCell();
//     headingCell.textContent = 'Grand Total';
//     headingCell.style.fontWeight = 'bold';
//     headingCell.colSpan = 4; // Span across the first four columns

//     // Create cells for the total values
//     columnsToDisplay.forEach(function (key, index) {
//         if (index >= 4) { // Start populating totals after the first four columns
//             var cell = totalRow.insertCell();
//             if (['sold_quantity', 'purchase_price', "selling_price", 'Amount', 'profit_loss'].includes(key)) {
//                 if (key === 'profit_loss') {
//                     cell.style.color = grandTotals[key] < 0 ? 'red' : 'green';
//                 }
//                 cell.textContent = grandTotals[key].toFixed(2); // Format the total to 2 decimal places
//             } else {
//                 cell.textContent = ''; // Empty cells for the specified columns
//             }
//         }
//     });
// }


function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['bill_no', 'gadi_number','cust_name', 'bata', 'product', 'sold_quantity', 'purchase_price', "selling_price", 'Amount', 'profit_loss'];
    var counter = 1;
    var grandTotals = {
        sold_quantity: 0,
        purchase_price: 0,
        selling_price: 0,
        Amount: 0,
        profit_loss: 0
    };
    console.log(data.reports);
    if (data.reports.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No data found.',
          });

        return;
    }
    data.reports.forEach(function (item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function (key) {
            var cell = row.insertCell();
            if (key === 'profit_loss') {
                if (item[key].startsWith('Loss')) {
                    cell.style.color = 'red';
                } else {
                    cell.style.color = 'green';
                }
                grandTotals[key] += parseFloat(item[key].replace(/[^0-9.-]+/g, "")) || 0;
            } else if (['sold_quantity', 'purchase_price', "selling_price", 'Amount'].includes(key)) {
                grandTotals[key] += parseFloat(item[key]) || 0;
            }
            cell.textContent = item[key];
        });
    });

    // Create the grand total row
    var totalRow = tbody.insertRow();
    
    // Create cell for 'Grand Total' heading
    var headingCell = totalRow.insertCell();
    headingCell.textContent = 'Grand Total';
    headingCell.style.fontWeight = 'bold';
    headingCell.colSpan = 4; // Span across the first four columns

    // Create an empty cell to shift the totals to the right
    var emptyCell = totalRow.insertCell();
    emptyCell.textContent = ''; // Empty cell to shift totals to the right

    // Create cells for the total values
    columnsToDisplay.forEach(function (key, index) {
        if (index >= 4) { // Start populating totals after the first four columns
            var cell = totalRow.insertCell();
            if (['sold_quantity', 'purchase_price', "selling_price", 'Amount', 'profit_loss'].includes(key)) {
                if (key === 'profit_loss') {
                    cell.style.color = grandTotals[key] < 0 ? 'red' : 'green';
                }
                cell.textContent = grandTotals[key].toFixed(2); // Format the total to 2 decimal places
            } else {
                cell.textContent = ''; // Empty cells for the specified columns
            }
        }
    });
}






// async function exportToExcel() {
//     let customHeaders; // Define customHeaders outside the try block
//     try {
//         const data = await fetchDataAndProcess();

//         // Export to PDF using jsPDF and autoTable
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF();

//         customHeaders = ['bill_no','gadi_number','bata', 'product', 'sold_quantity', 'purchase_price', "selling_price", 'Amount', 'profit_loss']; // Assign customHeaders value here
        
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
        
//         // Map data for autoTable
//         const reportData = data.reports.map(report => [
//             report.bill_no,
//             report.gadi_number,
//             report.bata,
//             report.product,
//             report.sold_quantity,
//             report.purchase_price,
//             report.selling_price,
//             report.Amount,
//             report.profit_loss

//         ]);

//         // Calculate grand totals
//         const grandTotalAmount = data.reports.reduce((total, report) => total + parseFloat(report.purchase_price), 0);
//         const grandTotalQuantity = data.reports.reduce((total, report) => total + parseFloat(report.selling_price), 0);
        
    
//         // Add grand totals row to reportData
//         reportData.push(['Grand Total:', '', '', '','', grandTotalAmount.toFixed(2), grandTotalQuantity.toFixed(2)]);

//         // Add Reports table to PDF
//         doc.autoTable({
//             head: [customHeaders],
//             body: reportData,
//             startY: 50,
//             theme: 'grid'
//         });

//         // Save the PDF
//         doc.save('profit Loss Report.pdf');

//     } catch (error) {
//         console.error('Error exporting data:', error);
//     }
// }


async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        return fetch('http://localhost:3000/profitLossReport/generate-pdf', {
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
            a.download = 'ProfitLossReport.pdf'; // Set the desired file name
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




