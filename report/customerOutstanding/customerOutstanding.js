
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
        customer_name : getElementValueWithDefault('customer', '*') , 
        route : selectedValues || '*' 
    };
    console.log(data);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    return fetch('http:// 52.66.126.53/customerOutstandingReport', {
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
    var columnsToDisplay = ['id', 'name', 'address', 'route_detail', 'mobile_no', 'Amount'];
    var counter = 1;
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
    });

    // Add row for grand total
    var totalRow = tbody.insertRow();
    for (let i = 0; i < columnsToDisplay.length; i++) {
        totalRow.insertCell();
    }
    var grandTotalCell = totalRow.insertCell();
    grandTotalCell.style.fontWeight = 'bold'; // Make "Grand Total" label bold
    grandTotalCell.textContent = 'Grand Total: ' + data.Grand['Grand Amournt']; 

}


// async function exportToExcel() {
//     try {
//         const data = await fetchDataAndProcess();

//         // Export to PDF using jsPDF and autoTable
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF();

//         const customHeaders = ['ID', 'Name', 'Address', 'Route Detail', 'Mobile No', 'Amount'];
//        // Adding header details
//        doc.setFontSize(10);
//        doc.text('Mobile:- 9960607512', 10, 10);
//        doc.addImage('../../assets/img/logo.png', 'PNG', 10, 15, 30, 30);
//        doc.setFontSize(16);
//        doc.text('Savata Fruits Suppliers', 50, 20);
//        doc.setFontSize(12);
//        doc.text('At post Kasthi Tal: Shreegonda, District Ahamadnagar - 414701', 50, 30);
//        doc.text('Mobile NO:- 9860601102  / 9922676380 / 9156409970', 50, 40);

//         // Map data for autoTable
//         const reportData = data.reports.map(report => [
//             report.id,
//             report.name,
//             report.address,
//             report.route_detail,
//             report.mobile_no,
//             report.Amount
//         ]);

//         // Calculate grand total
//         const grandTotal = data.reports.darkgreyuce((sum, report) => sum + report.Amount, 0);

//         // Add grand total row
//         reportData.push(['', '', '', '', 'Grand Total', grandTotal]);

//         // Add table to PDF
//         doc.autoTable({
//             head: [customHeaders],
//             body: reportData,
//             startY: 50, // Adjust startY based on the header height
//             theme: 'grid'
//         });

//         // Save the PDF
//         doc.save('Customer_Outstanding.pdf');

//     } catch (error) {
//         console.error('Error exporting data:', error);
//     }
// }


async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        return fetch('http://52.66.126.53/customerOutstandingReport/generate-pdf', {
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
            a.download = 'customerOutstandingReport.pdf'; // Set the desidarkgrey file name
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

