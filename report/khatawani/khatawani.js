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
        from_date : formatDate(document.getElementById("fromdate").value),
        to_date : formatDate(document.getElementById("todate").value),
        cust_name : getElementValueWithDefault('customer', '*') , 
        route : selectedValues || '*',
    };
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    return fetch('http://localhost:3000/khatawani', {
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
    var columnsToDisplay = ['bill_no', 'date', 'cust_name','route','amount', 'carate_amount',"TotalKalam",'pre_balance','cash','online_acc','online_amt', 'discount','inCarat', 'balance'];
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

     // Add row for grand total
     var totalRow = tbody.insertRow();
     var totalCell = totalRow.insertCell();
     totalCell.colSpan = columnsToDisplay.length;
     totalCell.textContent = 'Grand Total: ' + data.Grand['Grand Bill Amount'] + ' (Grand Bill Amount), ' + data.Grand['Grand outCarate'] + ' (Grand outCarate)' + data.Grand['Total Bill Amount'] + ' (Total Bill Amount), ' + data.Grand['Cash'] + ' (Total Cash), '  + data.Grand['Online Amount'] + ' (Online Amount)' + data.Grand['Grand Discount'] + ' (Grand Discount), ' + data.Grand['Grand inCarate'] + ' (Grand inCarate)';
}



async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        // Function to format dates in IST without time
        const formatDateToIST = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
        };

        const customHeaders = ['bill_no', 'date', 'cust_name', 'route', 'amount', 'carate_amount', "TotalKalam", 'pre_balance', 'cash', 'online_acc', 'online_amt', 'discount', 'inCarat', 'balance'];

        // Create a new worksheet with custom headers
        const worksheet = XLSX.utils.aoa_to_sheet([customHeaders]);

        // Append the data to the worksheet with formatted dates
        data.reports.forEach((report) => {
            const rowData = [
                report.bill_no,
                formatDateToIST(report.date), // Format date to IST
                report.cust_name,
                report.route,
                report.amount,
                report.carate_amount,
                report.TotalKalam,
                report.pre_balance,
                report.cash,
                report.online_acc,
                report.online_amt,
                report.discount,
                report.inCarat,
                report.balance
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: -1 });
        });

        // Add Grand Totals to a new sheet
        const grandTotals = [
            ["Grand Bill Amount", "Grand outCarate", "Total Bill Amount", "Total Cash", "Online Amount", "Grand Discount", "Grand inCarate"],
            [data.Grand['Grand Bill Amount'], data.Grand['Grand outCarate'], data.Grand['Total Bill Amount'], data.Grand['Cash'], data.Grand['Online Amount'], data.Grand['Grand Discount'], data.Grand['Grand inCarate']]
        ];
        const grandTotalsWorksheet = XLSX.utils.aoa_to_sheet(grandTotals);

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Add the worksheet with data
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

        // Add the worksheet with grand totals
        XLSX.utils.book_append_sheet(workbook, grandTotalsWorksheet, 'Grand Totals');

        // Generate XLSX file and prompt to download
        XLSX.writeFile(workbook, 'Khatawani.xlsx');

        // Export to PDF using jsPDF and autoTable
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Adding the headers and data
        const reportData = data.reports.map(report => [
            report.bill_no,
            formatDateToIST(report.date), // Format date to IST
            report.cust_name,
            report.route,
            report.amount,
            report.carate_amount,
            report.TotalKalam,
            report.pre_balance,
            report.cash,
            report.online_acc,
            report.online_amt,
            report.discount,
            report.inCarat,
            report.balance
        ]);

        doc.autoTable({
            head: [customHeaders],
            body: reportData,
            startY: 10,
            theme: 'grid'
        });

        // Adding Grand Totals
        const grandTotalsData = [
            ["Grand Bill Amount", data.Grand['Grand Bill Amount']],
            ["Grand outCarate", data.Grand['Grand outCarate']],
            ["Total Bill Amount", data.Grand['Total Bill Amount']],
            ["Total Cash", data.Grand['Cash']],
            ["Online Amount", data.Grand['Online Amount']],
            ["Grand Discount", data.Grand['Grand Discount']],
            ["Grand inCarate", data.Grand['Grand inCarate']]
        ];

        doc.autoTable({
            head: [['Description', 'Amount']],
            body: grandTotalsData,
            startY: doc.autoTable.previous.finalY + 10,
            theme: 'grid'
        });

        // Save the PDF
        doc.save('Khatawani.pdf');

    } catch (error) {
        console.error('Error exporting data:', error);
    }
}
