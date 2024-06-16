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
        supplier_name: getElementValueWithDefault('supplier', '*')
    };
    console.log(data);
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    return fetch('http://65.2.144.249/supplierLedger', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        loader.style.display = 'none';
        if (response.status === 404) {
            alert("No data found.");
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
        populateTable5(result);
        return result;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['id', 'date', 'supplier_name', 'gadi_number', 'total_quantity'];
    var counter = 1;
    console.log(data.reports);
    if (data.reports.length === 0) {
        alert("No Data Found");
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
                if (key === 'total_quantity') {
                    grandTotalQuantity += item[key];
                }
            }
        });
    });

    // Append grand total row
    var row = tbody.insertRow();
    row.insertCell().textContent = ''; // Empty cell for serial number
    row.insertCell().textContent = ''; // Empty cell for date
    row.insertCell().textContent = ''; // Empty cell for supplier_name
    row.insertCell().textContent = ''; // Empty cell for gadi_number

    // Cell for Grand Total label
    var labelCell = row.insertCell();
    labelCell.textContent = 'Grand Total:';
    labelCell.style.fontWeight = 'bold'; // Make label text bold

    // Cell for Grand Total value
    var valueCell = row.insertCell();
    valueCell.textContent = grandTotalQuantity;
    valueCell.style.fontWeight = 'bold'; // Make value text bold
}

function populateTable5(data) {
    var tbody = document.getElementById('tableBody1');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['p_id','date','from_account','to_account','comment','prev_balance','amounr'];
    var counter = 1;
    console.log(data.Receipt);
    if (data.Receipt.length === 0) {
        alert("No Data Found");
    }
    let grandTotalPreBalance = 0;
    let grandTotalAmounr = 0;
    data.Receipt.forEach(function(item) {
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
                if (key === 'pre_balance') {
                    grandTotalPreBalance += item[key];
                }
                if (key === 'amounr') {
                    grandTotalAmounr += item[key];
                }
            }
        });
    });

    // Append grand total row
    var row = tbody.insertRow();
    row.insertCell().textContent = ''; // Empty cell for serial number
    row.insertCell().textContent = ''; // Empty cell for date
    row.insertCell().textContent = ''; // Empty cell for from_account
    row.insertCell().textContent = ''; // Empty cell for to_account
    row.insertCell().textContent = ''; // Empty cell for comment

    // Cell for Grand Total label
    var labelCell = row.insertCell();
    labelCell.textContent = 'Grand Total:';
    labelCell.style.fontWeight = 'bold'; // Make label text bold

    // Cell for Grand Total pre_balance
    var preBalanceCell = row.insertCell();
    preBalanceCell.textContent = grandTotalPreBalance;
    preBalanceCell.style.fontWeight = 'bold'; // Make value text bold

    // Cell for Grand Total amounr
    var amounrCell = row.insertCell();
    amounrCell.textContent = grandTotalAmounr;
    amounrCell.style.fontWeight = 'bold'; // Make value text bold
}

async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        // Export to PDF using jsPDF and autoTable
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const customHeaders = ['id', 'date', 'supplier_name', 'gadi_number', 'total_quantity'];

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

        // Map data for autoTable (Reports)
        const reportData = data.reports.map(report => [
            report.id,
            new Date(report.date).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }),
            report.supplier_name,
            report.gadi_number,
            report.total_quantity
        ]);

        // Calculate grand total for reports
        let grandTotalQuantity = data.reports.reduce((acc, report) => acc + report.total_quantity, 0);
        
        // Append grand total row to Reports table data
        reportData.push(['', '', '', 'Grand Total:', grandTotalQuantity]);

        // Add Reports table to PDF
        doc.autoTable({
            head: [customHeaders],
            body: reportData,
            startY: startY,
            theme: 'grid',
            headStyles: { fillColor: [255, 0, 0] },
            margin: { top: 10 }
        });

        const customHeaders1 = ['p_id', 'date', 'from_account', 'to_account', 'comment', 'prev_balance', 'amounr'];

        // Map data for autoTable (Receipts)
        const receiptData = data.Receipt.map(receipt => [
            receipt.p_id,
            new Date(receipt.date).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }),
            receipt.from_account,
            receipt.to_account,
            receipt.comment,
            receipt.pre_balance,
            receipt.amounr
        ]);

        // Calculate grand total for receipts
        let grandTotalPreBalance = data.Receipt.reduce((acc, receipt) => acc + receipt.pre_balance, 0);
        let grandTotalAmounr = data.Receipt.reduce((acc, receipt) => acc + receipt.amounr, 0);

        // Append grand total row to Receipts table data
        receiptData.push(['', '', '', '', 'Grand Total:', grandTotalPreBalance, grandTotalAmounr]);

        // Add Receipts table to PDF
        doc.autoTable({
            head: [customHeaders1],
            body: receiptData,
            startY: doc.autoTable.previous.finalY + 10,
            theme: 'grid',
            headStyles: { fillColor: [0, 255, 0] },
            margin: { top: 10 }
        });

        // Save the PDF
        doc.save('Supplier Ledger Report.pdf');

    } catch (error) {
        console.error('Error exporting data:', error);
    }
}
