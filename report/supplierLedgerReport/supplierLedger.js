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
        supplier_name : getElementValueWithDefault('supplier', '*') 
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
        populateTable5(result)
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
    var columnsToDisplay = ['id','date','supplier_name','gadi_number','total_quantity'];
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
            if(key=='date'){
                console.log(item[key])
                var utcDate = new Date(item[key]);
                var options = { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    timeZone: 'Asia/Kolkata' 
                };
                cell.textContent = utcDate.toLocaleString('en-IN', options);
            
            }else{
            cell.textContent = item[key];
            }
        });
    });    
}


function populateTable5(data) {
    var tbody = document.getElementById('tableBody1');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['p_id','date','from_account','to_account','comment','prev_balance','amounr'];
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
            if(key=='date'){
                console.log(item[key])
                var utcDate = new Date(item[key]);
                var options = { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    timeZone: 'Asia/Kolkata' 
                };
                cell.textContent = utcDate.toLocaleString('en-IN', options);
            
            }else{
            cell.textContent = item[key];
            }
        });
    });    
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
        doc.text('Savata Fruits Suppliers', 50, 10);
        doc.setFontSize(12);
        doc.text('At post Kasthi Tal: Shreegonda, District Ahamadnagar - 414701', 50, 20);
        doc.text('Mobile NO:- 9860601102 / 9175129393/ 9922676380 / 9156409970', 50, 30);

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
         let grandTotalamounr = data.Receipt.reduce((acc, receipt) => acc + receipt.amounr, 0);
 
         // Append grand total row to Receipts table data
         receiptData.push(['', '', '', '', 'Grand Total:', grandTotalPreBalance, grandTotalamounr]);

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




