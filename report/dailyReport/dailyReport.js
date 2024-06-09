
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
        populateTable4(result)
        populateTable5(result)
        return result
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

        const customHeaders = ['bill_no', 'date', 'cust_name', 'route', 'amount', 'cash', 'online_amt', 'discount', 'inCarat', 'carate_amount'];

        // Create a new worksheet with custom headers
        const worksheet = XLSX.utils.aoa_to_sheet([customHeaders]);

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

        const customHeaders1 = ['receipt_id', 'date', 'Customer', 'mobile_no', 'note', 'cash', 'online', 'discount', 'inCarat', 'Amt'];

        // Create a new worksheet with custom headers
        const worksheet1 = XLSX.utils.aoa_to_sheet([customHeaders1]);


        // Add Reports table to PDF
        doc.autoTable({
            head: [customHeaders],
            body: reportData,
            startY: 10,
            theme: 'grid',
            headStyles: { fillColor: [255, 0, 0] },
            margin: { top: 10 }
        });

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
        doc.save('Daily_Report.pdf');

    } catch (error) {
        console.error('Error exporting data:', error);
    }
}




