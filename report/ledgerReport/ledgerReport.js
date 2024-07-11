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
async function fetchDataAndProcess() {
    var data = {
        from_date: formatDate(document.getElementById("fromdate").value),
        to_date: formatDate(document.getElementById("todate").value),
        customer_name: getElementValueWithDefault('customer', '*'),
        route: getElementValueWithDefault('route', '*')
    };
    console.log(data);
    var loader = document.getElementById('loader');
    loader.style.display = 'block';
    try {
        const response = await fetch('http://52.66.126.53/ledgerReport', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 404) {
            loader.style.display = 'none';
            alert("No data found.");
            throw new Error('Data not found');
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        loader.style.display = 'none';
        console.log(result);
        populateTable4(result);
        // Return the data along with the result
        return { ...data, reports: result.reports, Grand: result.Grand };
    } catch (error) {
        console.error('Error:', error);
        loader.style.display = 'none';
    }
}



function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['date', 'route', 'customer_name', 'summary', 'balance', 'out_carate', 'total_balance', 'cash', 'online', 'discount', 'in_carate', 'remaining'];
    var counter = 1;

    if (data.reports.length === 0) {
        alert("No Data Found");
    }

    data.reports.forEach(function (item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function (key) {
            var cell = row.insertCell();
            if (key == 'date') {
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
    });

    // Display grand totals for all columns except 'remaining'
    var grandTotalRow = tbody.insertRow();
    var grandTotalCell = grandTotalRow.insertCell();
    grandTotalCell.textContent = 'Grand Total:';
    grandTotalCell.style.fontWeight = 'bold';

    columnsToDisplay.forEach(function (key) {
        var cell = grandTotalRow.insertCell();
        if (key !== 'remaining') {
            switch (key) {
                case 'balance':
                    cell.textContent = data.Grand['Grand Balance'];
                    break;
                case 'out_carate':
                    cell.textContent = data.Grand['Grand outCarate'];
                    break;
                case 'total_balance':
                    cell.textContent = data.Grand['Total Balance'];
                    break;
                case 'cash':
                    cell.textContent = data.Grand['Total Cash'];
                    break;
                case 'online':
                    cell.textContent = data.Grand['Total Online'];
                    break;
                case 'discount':
                    cell.textContent = data.Grand['Grand Discount'];
                    break;
                case 'in_carate':
                    cell.textContent = data.Grand['Grand inCarate'];
                    break;
                default:
                    cell.textContent = '';
                    break;
            }
            cell.style.fontWeight = 'bold'; // Make grand total values bold
        } else {
            cell.textContent = ''; // Leave 'remaining' column empty for grand total row
        }
    });

    // Display remaining amount from the last entry
    if (data.reports.length > 0) {
        var lastEntry = data.reports[data.reports.length - 1];
        var remainingRow = tbody.insertRow();
        var remainingCellLabel = remainingRow.insertCell();
        var remainingCellLabel = remainingRow.insertCell();
        var remainingCellLabel = remainingRow.insertCell();
        var remainingCellLabel = remainingRow.insertCell();
        var remainingCellLabel = remainingRow.insertCell();
        var remainingCellLabel = remainingRow.insertCell();
        var remainingCellLabel = remainingRow.insertCell();
        var remainingCellLabel = remainingRow.insertCell();
        var remainingCellLabel = remainingRow.insertCell();
        var remainingCellLabel = remainingRow.insertCell();
        var remainingCellLabel = remainingRow.insertCell();
        var remainingCellLabel = remainingRow.insertCell();
        remainingCellLabel.textContent = 'Remaining Amount:';
        remainingCellLabel.style.fontWeight = 'bold';

        var remainingValueCell = remainingRow.insertCell();
        remainingValueCell.textContent = lastEntry['remaining'];
    } else {
        var noDataRow = tbody.insertRow();
        var noDataCell = noDataRow.insertCell();
        noDataCell.textContent = 'No Data Available';
        noDataCell.colSpan = columnsToDisplay.length;
        noDataCell.style.textAlign = 'center';
    }

    // Conditional logic for additional content based on customer selection
    if (document.getElementById('customer').value !== '') {
        console.log("Customer selected");
        fetch('http://52.66.126.53/carateuserData/' + document.getElementById('customer').value)
            .then(response => {
                if (!response.ok) {
                    loader.style.display = 'none';
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data1 => {
                // Assuming 'totalCell' is defined somewhere in your context
                totalCell.innerHTML = 'Remaining Carate of Customer :<br>' +
                    '100 => ' + data1[0]['carate_100'] + '<br>' +
                    '150 => ' + data1[0]['carate_150'] + '<br>' +
                    '250 => ' + data1[0]['carate_250'] + '<br>' +
                    '350 => ' + data1[0]['carate_350'];
            });
    } else {
        // Assuming 'totalCell' is defined somewhere in your context
        totalCell.textContent = ''; // Clear the totalCell if no customer is selected
    }
}



// async function exportToExcel() {
//     try {
//         // Export to PDF using jsPDF and autoTable
//         const { jsPDF } = window.jspdf;
//         const data = await fetchDataAndProcess();
//         const doc = new jsPDF();

//         console.log("AJAJAJ",data)
//         // Adding header details
//         doc.setFontSize(10);
//         doc.text('Mobile:- 9960607512', 10, 10);
//         doc.addImage('../../assets/img/logo.png', 'PNG', 10, 15, 30, 30); // Adjust the position and size as needed
//         doc.setFontSize(16);
//         doc.text('Savata Fruits Suppliers', 50, 20);
//         doc.setFontSize(12);
//         doc.text('At post Kasthi Tal: Shreegonda, District Ahamadnagar - 414701', 50, 30);
//         doc.text('Mobile NO:- 9860601102 / 9175129393/ 9922676380 / 9156409970', 50, 40);

//         // Add customer name and route
//         if (document.getElementById('customer').value !== '') {
//             doc.text(`Customer Name: ${data.customer_name}`, 50, 40);
//         }
//         if (document.getElementById('route').value !== '') {
//             doc.text(`Route: ${data.route}`, 50, 50);
//         }
//         // Add some space before the table
//         doc.setFontSize(12);
//         doc.text(' ', 10, 60);
//         // Map data for autoTable
//         const reportData = data.reports.map(report => [
//             new Date(report.date).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }),
//             report.summary,
//             report.balance,
//             report.out_carate,
//             report.total_balance,
//             report.cash,
//             report.online,
//             report.discount,
//             report.in_carate,
//             report.remaining
//         ]);
//         const customHeaders = [
//             'Date', 'Summary', 'Balance', 'Out Carate', 'Total Balance', 'Cash', 'Online', 'Discount', 'In Carate', 'Remaining'
//         ];
//         // Append the grand total row
//         const grandTotalRow = [
//             'Grand Total',

//             '',
//             data.Grand["Grand Balance"],
//             data.Grand['Grand outCarate'],
//             data.Grand['Total Balance'],
//             data.Grand['Total Cash'],
//             data.Grand['Total Online'],
//             data.Grand['Grand Discount'],
//             data.Grand['Grand inCarate'],
//             data.Grand['Grand Remaining Amount']
//         ];
//         reportData.push(grandTotalRow);
//         // Add Reports table to PDF
//         doc.autoTable({
//             head: [customHeaders],
//             body: reportData,
//             startY: 70, // Adjust startY based on the header height
//             theme: 'grid'
//         });
//         // Save the PDF
//         doc.save('Ledger_Report.pdf');
//     } catch (error) {
//         console.error('Error exporting data:', error);
//     }
// }


async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        return fetch('http://52.66.126.53/ledgerReport/generate-pdf', {
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
            a.download = 'LedgerReport.pdf'; // Set the desired file name
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

