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
        from_date : formatDate(document.getElementById("fromdate").value),
        to_date : formatDate(document.getElementById("todate").value),
    };

    var loader = document.getElementById('loader');
    loader.style.display = 'block';
    return fetch('http://65.2.144.249/dailyReport', {
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
        populateTable4(result);
        populateTable5(result);
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
    var columnsToDisplay = ['bill_no', 'date', 'cust_name','route', 'amount','cash','online_amt','discount','inCarat','carate_amount'];
    var counter = 1;
    console.log(data.reports)
    if (data.reports.length === 0) {
        alert("No Data Found");
    }
    data.reports.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            if(key == 'date') {
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
    totalRow.insertCell(); // Add empty cell at the beginning for shifting
    columnsToDisplay.forEach(function(key) {
        var totalCell = totalRow.insertCell();
        switch (key) {
            case 'amount':
                totalCell.textContent = data.GrandSale['saleAmount'];
                break;
            case 'online_amt':
                totalCell.textContent = data.GrandSale['saleOnline'];
                break;
            case 'cash':
                totalCell.textContent = data.GrandSale['saleCash'];
                break;
            case 'discount':
                totalCell.textContent = data.GrandSale['saleDiscount'];
                break;
            case 'inCarat':
                totalCell.textContent = data.GrandSale['saleInCarat'];
                break;
            case 'carate_amount':
                totalCell.textContent = data.GrandSale['saleCarate'];
                break;
            default:
                totalCell.textContent = '';
        }
    });






}

function populateTable5(data) {
    var tbody = document.getElementById('tableBody1');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['receipt_id', 'date', 'Customer','mobile_no','note', 'cash','online','discount',"inCarat","Amt"];
    var counter = 1;
    console.log(data.Receipt)
    if (data.Receipt.length === 0) {
        alert("No Data Found");
    }
    data.Receipt.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            if(key == 'date') {
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
    totalRow.insertCell(); // Add empty cell at the beginning for shifting
    columnsToDisplay.forEach(function(key) {
        var totalCell = totalRow.insertCell();
        switch (key) {
            case 'Amt':
                totalCell.textContent = data.GrandReceipt['receiptAmt'];
                break;
            case 'online':
                totalCell.textContent = data.GrandReceipt['receiptOnline'];
                break;
            case 'cash':
                totalCell.textContent = data.GrandReceipt['receiptCash'];
                break;
            case 'discount':
                totalCell.textContent = data.GrandReceipt['receiptDiscount'];
                break;
            case 'inCarat':
                totalCell.textContent = data.GrandReceipt['receiptInCarat'];
                break;
            default:
                totalCell.textContent = '';
        }
    });

    
    




}

async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();
    
        // Export to PDF using jsPDF and autoTable
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Adding header details
        doc.setFontSize(10);
        doc.text('Mobile:- 9960607512', 10, 10);
        doc.addImage('../../assets/img/logo.png', 'PNG', 10, 15, 30, 30); // Adjust the position and size as needed
        doc.setFontSize(16);
        doc.text('Savata Fruits Suppliers', 50, 10);
        doc.setFontSize(12);
        doc.text('At post Kasthi Tal: Shreegonda, District Ahamadnagar - 414701', 50, 20);
        doc.text('Mobile NO:- 9860601102 / 9175129393/ 9922676380 / 9156409970', 50, 30);
        
        const customHeaders = ['bill_no', 'date', 'cust_name', 'route', 'amount', 'cash', 'online_amt', 'discount', 'inCarat', 'carate_amount'];

        // Map data for autoTable (Reports)
        const reportData = data.reports.map(report => [
            report.bill_no,
            report.date,
            report.cust_name,
            report.route,
            report.amount,
            report.cash,
            report.online_amt,
            report.discount,
            report.inCarat,
            report.carate_amount
        ]);

        // Calculate grand totals for Reports
        const grandTotalReports = {
            amount: data.reports.reduce((total, item) => total + item.amount, 0),
            cash: data.reports.reduce((total, item) => total + item.cash, 0),
            online_amt: data.reports.reduce((total, item) => total + item.online_amt, 0),
            discount: data.reports.reduce((total, item) => total + item.discount, 0),
            inCarat: data.reports.reduce((total, item) => total + item.inCarat, 0),
            carate_amount: data.reports.reduce((total, item) => total + item.carate_amount, 0)
        };

        // Add Reports table to PDF
        doc.autoTable({
            head: [customHeaders],
            body: reportData,
            startY: 50,
            theme: 'grid',
            headStyles: { fillColor: [255, 0, 0] },
            margin: { top: 10 }
        });

        // Append grand totals to Reports table
        doc.autoTable({
            head: [['Grand Total', '', '', '', grandTotalReports.amount, grandTotalReports.cash, grandTotalReports.online_amt, grandTotalReports.discount, grandTotalReports.inCarat, grandTotalReports.carate_amount]],
            body: [],
            startY: doc.autoTable.previous.finalY,
            theme: 'grid'
        });

        const customHeaders1 = ['receipt_id', 'date', 'Customer', 'mobile_no', 'note', 'cash', 'online', 'discount', 'inCarat', 'Amt'];

        // Map data for autoTable (Receipts)
        const receiptData = data.Receipt.map(receipt => [
            receipt.receipt_id,
            receipt.date,
            receipt.Customer,
            receipt.mobile_no,
            receipt.note,
            receipt.cash,
            receipt.online,
            receipt.discount,
            receipt.inCarat,
            receipt.Amt
        ]);

        // Calculate grand totals for Receipts
        const grandTotalReceipts = {
            cash: data.Receipt.reduce((total, item) => total + item.cash, 0),
            online: data.Receipt.reduce((total, item) => total + item.online, 0),
            discount: data.Receipt.reduce((total, item) => total + item.discount, 0),
            inCarat: data.Receipt.reduce((total, item) => total + item.inCarat, 0),
            Amt: data.Receipt.reduce((total, item) => total + item.Amt, 0)
        };

        // Add Receipts table to PDF
        doc.autoTable({
            head: [customHeaders1],
            body: receiptData,
            startY: doc.autoTable.previous.finalY + 10,
            theme: 'grid',
            headStyles: { fillColor: [0, 255, 0] },
            margin: { top: 10 }
        });

        // Append grand totals to Receipts table
        doc.autoTable({
            head: [['Grand Total', '', '', '', '', grandTotalReceipts.cash, grandTotalReceipts.online, grandTotalReceipts.discount, grandTotalReceipts.inCarat, grandTotalReceipts.Amt]],
            body: [],
            startY: doc.autoTable.previous.finalY,
            theme: 'grid'
        });

        // Save the PDF

        // Save the PDF
        doc.save('Daily_Report.pdf');

    } catch (error) {
        console.error('Error exporting data:', error);
    }
}




