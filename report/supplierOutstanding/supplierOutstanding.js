
function getElementValueWithDefault(id, defaultValue) {
    var element = document.getElementById(id);
    return element && element.value ? element.value : defaultValue;
}



document.getElementById('loginForm1').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    fetchDataAndProcess();
});



function fetchDataAndProcess() {
    var data = {
        supplier_name : getElementValueWithDefault('customer', '*') , 
    };
    console.log(data);

    var loader = document.getElementById('loader');
        loader.style.display = 'block';
    return fetch('http://65.2.144.249/supplierOutstanding', {
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
        return response.json();
    })
    .then(result => {
        loader.style.display = 'none';
        console.log(result)
        populateTable4(result)
        return result;
        // Optionally, you can redirect or show a success message here
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, you can display an error message here
    });
}


function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['name', 'address', 'mobile_no', 'Amount'];
    var counter = 1;
    console.log(data.reports)
    if (data.reports.length === 0) {
        alert("No Data Found");
    }
    data.reports.forEach(function (item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function (key) {
            var cell = row.insertCell();
            if (key === 'date') {
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
    var totalCell = totalRow.insertCell();
    totalCell.colSpan = columnsToDisplay.length - 3; // Skip the first three columns

    columnsToDisplay.forEach(function (key) {
        var cell = totalRow.insertCell();
        if (key === 'Amount') {
            cell.textContent = data.Grand['Grand Amount'];
        } else {
            cell.textContent = '';
        }
    });
}


async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        // Initialize jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const customHeaders = ['name', 'address', 'mobile_no', 'Amount'];
        // Adding header details
        doc.setFontSize(10);
        doc.text('Mobile:- 9960607512', 10, 10);
        doc.addImage('../../assets/img/logo.png', 'PNG', 10, 15, 30, 30); // Adjust the position and size as needed
        doc.setFontSize(16);
        doc.text('Savata Fruits Suppliers', 50, 20);
        doc.setFontSize(12);
        doc.text('At post Kasthi Tal: Shreegonda, District Ahamadnagar - 414701', 50, 30);
        doc.text('Mobile NO:- 9860601102 / 9175129393/ 9922676380 / 9156409970', 50, 40);

        let startY = 50;
        
        // Map data for autoTable
        const reportData = data.reports.map(report => [
            report.name,
            report.address,
            report.mobile_no,
            report.Amount
        ]);

        // Calculate grand total
        const grandTotal = reportData.reduce((acc, curr) => acc + curr[3], 0);

        // Add grand total to the report data
        const reportDataWithTotal = [...reportData, ['Grand Total', '', '', grandTotal]];

        // Add report data to PDF
        doc.autoTable({
            head: [customHeaders],
            body: reportDataWithTotal,
            startY: 50, // Adjust startY to leave space for header details and logo
            theme: 'grid',
        });

        // Save the PDF
        doc.save('Supplier_Outstanding_Report.pdf');

    } catch (error) {
        console.error('Error exporting data:', error);
    }
}