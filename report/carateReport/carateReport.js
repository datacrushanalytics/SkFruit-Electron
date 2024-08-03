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
    };
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    return fetch('http://13.201.94.88/carateReport', {
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
            return result; // Return the result to be used in the caller
        })
        .catch(error => {
            console.error('Error:', error);
            // Optionally, you can display an error message here
            throw error; // Rethrow the error for the caller to handle
        });
}



function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['carate_date', 'customer_name', 'summary', "outCarate", 'out_carate_total', "inCarate", 'in_carate_total'];
    var counter = 1;
    console.log(data.reports);
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
            if (key === 'carate_date') {
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
            }
        });
    });

    console.log(document.getElementById('customer').value);

    // Add row for grand total
    var totalRow = tbody.insertRow();
    totalRow.insertCell().colSpan = 1; // Skip the first column

    columnsToDisplay.forEach(function (key) {
        var cell = totalRow.insertCell();
        if (key === 'summary') {
            cell.textContent = 'Grand Total';
            cell.style.fontWeight = 'bold'; // Make the label bold
        } else {
            switch (key) {
                case 'out_carate_total':
                    cell.textContent = data.Grand['Grand out_carate_total'];
                    cell.style.fontWeight = 'bold'; // Make the value bold
                    break;
                case 'in_carate_total':
                    cell.textContent = data.Grand['Grand in_carate_total'];
                    cell.style.fontWeight = 'bold'; // Make the value bold
                    break;
                default:
                    cell.textContent = '';
                    break;
            }
        }
    });

    if (document.getElementById('customer').value !== '') {
        console.log("Customer not selected ");
        fetch('http://13.201.94.88/carateuserData/' + document.getElementById('customer').value)
            .then(response => {
                if (!response.ok) {
                    loader.style.display = 'none';
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data1 => {
                // Populate dropdown with API data
                console.log(data1);

                // Add remaining carate data in the last cell
                var lastCell = totalRow.insertCell();
                lastCell.colSpan = columnsToDisplay.length - totalRow.cells.length + 1;
                lastCell.innerHTML = 'Remaining Carate of Customer:<br>' +
                    '100 => ' + data1[0]['carate_100'] + '<br>' +
                    '150 => ' + data1[0]['carate_150'] + '<br>' +
                    '250 => ' + data1[0]['carate_250'] + '<br>' +
                    '350 => ' + data1[0]['carate_350'];
            });
    } else {
        var lastCell = totalRow.insertCell();
        lastCell.colSpan = columnsToDisplay.length - totalRow.cells.length + 1;
        lastCell.textContent = '';
    }
}


// async function exportToExcel() {
//     try {
//         const data = await fetchDataAndProcess();

//         // Ensure jsPDF and autoTable are correctly imported
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


//         // Define custom headers
//         const customHeaders = ['Date', 'Customer Name', 'Summary', 'Out Carate', 'Out Carate Total', 'In Carate', 'In Carate Total'];

//         // Map data for autoTable
//         const reportData = data.reports.map(report => [
//             report.carate_date,
//             report.customer_name,
//             report.summary,
//             report.OutCarate,
//             report.out_carate_total,
//             report.inCarate,
//             report.in_carate_total
//         ]);

//         // Add grand totals as the last row in reportData
//         const grandTotalRow = [
//             'Grand Total', '', '', '', 
//             data.Grand['Grand out_carate_total'], 
//             '', 
//             data.Grand['Grand in_carate_total']
//         ];

//         reportData.push(grandTotalRow);

//         // Add report data and grand total to PDF
//         doc.autoTable({
//             head: [customHeaders],
//             body: reportData,
//             startY: 50,
//             theme: 'grid',
//         });

//         // Save the PDF
//         doc.save('Carate_Report.pdf');

//     } catch (error) {
//         console.error('Error exporting data:', error);
//     }
// }

async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        return fetch('http://13.201.94.88/carateReport/generate-pdf', {
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
            a.download = 'carateReport.pdf'; // Set the desidarkgrey file name
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


