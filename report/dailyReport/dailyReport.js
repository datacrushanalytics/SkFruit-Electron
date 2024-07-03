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
    };
    var loader = document.getElementById('loader');
    loader.style.display = 'block';
    return fetch('http://52.66.126.53/dailyReport', {
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
    var columnsToDisplay = ['bill_no', 'date', 'cust_name', 'route', 'amount', 'cash', 'online_amt', 'discount', 'inCarat', 'carate_amount','validate'];
    var counter = 1;
    if (data.reports.length === 0) {
        alert("No Data Found");
    }
    var grandTotals = {
        amount: 0,
        cash: 0,
        online_amt: 0,
        discount: 0,
        inCarat: 0,
        carate_amount: 0
    };
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
            } else if(key === 'validate') {
                if(item[key]=='Pending'){
                    //let buttonContainer = document.getElementById('buttonContainer');
                    let button = document.createElement('button');
                    button.textContent = "Verify";
                    button.onclick = function() {
                        localStorage.removeItem('saleData');
                        console.log('Editing Sale: ' + JSON.stringify(item));
                        localStorage.setItem('saleData', JSON.stringify(item));
                        window.location.href = './validateSale.html';
                    };
                    cell.appendChild(button);
                }else {
                    cell.textContent = item[key];
                    row.style.backgroundColor = "#90EE90";
                }
            } else {
                cell.textContent = item[key];
                if (['amount', 'cash', 'online_amt', 'discount', 'inCarat', 'carate_amount'].includes(key)) {
                    grandTotals[key] += parseFloat(item[key]) || 0;
                }
            }
        });
    });
    // Add row for grand total
    var totalRow = tbody.insertRow();
    totalRow.insertCell(); // Add empty cell for counter column
    totalRow.insertCell(); // Add empty cell for date column
    totalRow.insertCell(); // Add empty cell for customer name column
    totalRow.insertCell(); // Add empty cell for route column
    var grandTotalLabelCell = totalRow.insertCell();
    grandTotalLabelCell.textContent = 'Grand Total';
    grandTotalLabelCell.style.fontWeight = 'bold'; // Make "Grand Total" label bold

    columnsToDisplay.slice(4).forEach(function(key) {
        var totalCell = totalRow.insertCell();
        totalCell.textContent = grandTotals[key] || '';
        totalCell.style.fontWeight = 'bold'; // Make grand total values bold
    });
}

function populateTable5(data) {
    var tbody = document.getElementById('tableBody1');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['receipt_id', 'date', 'Customer', 'mobile_no', 'note', 'cash', 'online', 'discount', 'inCarat', 'Amt','validate'];
    var counter = 1;
    if (data.Receipt.length === 0) {
        alert("No Data Found");
    }
    var grandTotals = {
        cash: 0,
        online: 0,
        discount: 0,
        inCarat: 0,
        Amt: 0
    };
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
            } else if(key === 'validate') {
                if(item[key]=='Pending'){
                    //let buttonContainer = document.getElementById('buttonContainer');
                    let button = document.createElement('button');
                    button.textContent = "Verify";
                    button.onclick = function() {
                        window.location.href = './validateSale.html';
                    };
                    cell.appendChild(button);
                }else {
                    cell.textContent = item[key];
                    row.style.backgroundColor = "#90EE90";
                }
            } else {
                cell.textContent = item[key];
                if (['cash', 'online', 'discount', 'inCarat', 'Amt'].includes(key)) {
                    grandTotals[key] += parseFloat(item[key]) || 0;
                }
            }
        });
    });
    // Add row for grand total
    var totalRow = tbody.insertRow();
    totalRow.insertCell(); // Add empty cell for counter column
    totalRow.insertCell(); // Add empty cell for date column
    totalRow.insertCell(); // Add empty cell for customer column
    totalRow.insertCell(); // Add empty cell for mobile number column
    totalRow.insertCell(); // Add empty cell for note column
    var grandTotalLabelCell = totalRow.insertCell();
    grandTotalLabelCell.textContent = 'Grand Total';
    grandTotalLabelCell.style.fontWeight = 'bold'; // Make "Grand Total" label bold

    columnsToDisplay.slice(5).forEach(function(key) {
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
        totalCell.style.fontWeight = 'bold'; // Make grand total values bold
    });



    document.getElementById('sale').textContent = data.GrandSale['saleAmount'] || 0;
    document.getElementById('saleCash').textContent =data.GrandSale['saleCash'] || 0;
    document.getElementById('receiptCash').textContent = data.GrandReceipt['receiptCash'] || 0;
    document.getElementById('receiptOnline').textContent = data.GrandReceipt['receiptOnline'] || 0;
    document.getElementById('saleOnline').textContent = data.GrandSale['saleOnline'] || 0;
    document.getElementById('saleDiscount').textContent = data.GrandSale['saleDiscount'] || 0;
    document.getElementById('receiptDiscount').textContent = data.GrandReceipt['receiptDiscount'] || 0;
    document.getElementById('grandSale').textContent = data.GrandSale['saleAmount'] || 0;
    document.getElementById('grandCash').textContent = data.GrandSale['saleCash'] + data.GrandReceipt['receiptCash'];
    document.getElementById('grandOnline').textContent = data.GrandReceipt['receiptOnline'] + data.GrandSale['saleOnline'];
    document.getElementById('grandDiscount').textContent = data.GrandReceipt['receiptDiscount'] + data.GrandSale['saleDiscount'];
    document.getElementById('grandTotal').textContent = data.GrandSale['saleCash'] + data.GrandReceipt['receiptCash'] + data.GrandReceipt['receiptOnline'] + data.GrandSale['saleOnline'];

}




async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        // Adding header details
        doc.setFontSize(10);
        doc.text('Mobile:- 9960607512', 10, 10);
        doc.addImage('../../assets/img/logo.png', 'PNG', 10, 15, 30, 30); // Adjust the position and size as needed
        doc.setFontSize(16);
        doc.text('Savata Fruits Suppliers', 50, 20);
        doc.setFontSize(12);
        doc.text('At post Kasthi Tal: Shreegonda, District Ahamadnagar - 414701', 50, 30);
        doc.text('Mobile NO:- 9860601102 / 9175129393/ 9922676380 / 9156409970', 50, 40);
        const customHeaders = ['bill_no', 'date', 'cust_name', 'route', 'amount', 'cash', 'online_amt', 'discount', 'inCarat', 'carate_amount'];
        // Map data for autoTable (Reports)
        const reportData = data.reports.map(report => [
            report.bill_no,
            new Date(report.date).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }),
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
            startY: doc.autoTable.previous.finalY + 10, // Adjust the startY position for spacing
            theme: 'grid'
        });
        const customHeaders1 = ['receipt_id', 'date', 'Customer', 'mobile_no', 'note', 'cash', 'online', 'discount', 'inCarat', 'Amt'];
        // Map data for autoTable (Receipts)
        const receiptData = data.Receipt.map(receipt => [
            receipt.receipt_id,
            new Date(receipt.date).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }),
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

        // Add grand total row
        receiptData.push(['', '', '', '', 'Grand Total', grandTotalReceipts]);
        // Add Receipts table to PDF
        doc.autoTable({
            head: [customHeaders1],
            body: receiptData,
            startY: doc.autoTable.previous.finalY + 10,
            theme: 'grid',
            headStyles: { fillColor: [0, 255, 0] },
            margin: { top: 10 }
        });
        // // Append grand totals to Receipts table
        // doc.autoTable({
        //     head: [['Grand Total', '', '', '', '', grandTotalReceipts.cash, grandTotalReceipts.online, grandTotalReceipts.discount, grandTotalReceipts.inCarat, grandTotalReceipts.Amt]],
        //     body: [],
        //     startY: doc.autoTable.previous.finalY + 10, // Adjust the startY position for spacing
        //     theme: 'grid'
        // });
        // Save the PDF
        doc.save('Daily_Report.pdf');
    } catch (error) {
        console.error('Error exporting data:', error);
    }
}









