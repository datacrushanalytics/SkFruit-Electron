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
        supplier_name : getElementValueWithDefault('supplier', '*') , 
        bata : getElementValueWithDefault('bata', '*') , 
        gadi_number : getElementValueWithDefault('vehicleNumber', '*') 
    };
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    return fetch('http://65.0.168.11/purchaseReport', {
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
    var columnsToDisplay = ['id', 'date', 'gadi_number','bata','supplier_name', 'BillAmount','TotalQuantity'];
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
            } else {
                cell.textContent = item[key];
            }
        });
    });

    // Add row for grand total
    var totalRow = tbody.insertRow();
    var totalCell = totalRow.insertCell();
    totalCell.colSpan = columnsToDisplay.length - 1; // Adjusting for the delete button column
    totalCell.textContent = 'Grand Total:';
    
    // Add cell for Bill Amount
    var billAmountCell = totalRow.insertCell();
    billAmountCell.textContent = data.Grand['Grand Amournt'];

    // Add cell for Total Quantity
    var totalQuantityCell = totalRow.insertCell();
    totalQuantityCell.textContent = data.Grand['Grand Quantity'];
}

async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        const customHeaders = ['id', 'date', 'gadi_number','bata','supplier_name', 'BillAmount','TotalQuantity'];

        // Create a new worksheet with custom headers
        const worksheet = XLSX.utils.aoa_to_sheet([customHeaders]);

        // Append the data to the worksheet
        data.reports.forEach((report) => {
            const rowData = [
                report.id,
                report.date,
                report.gadi_number,
                report.bata,
                report.supplier_name,
                report.BillAmount,
                report.TotalQuantity
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: -1 });
        });

        // Add Grand Totals to a new sheet
        const grandTotals = [
            ["BillAmount", "TotalQuantity"],
            [data.Grand['Grand Amournt'],  data.Grand['Grand Quantity']]
        ];
        const grandTotalsWorksheet = XLSX.utils.aoa_to_sheet(grandTotals);

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Add the worksheet with data
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

        // Add the worksheet with grand totals
        XLSX.utils.book_append_sheet(workbook, grandTotalsWorksheet, 'Grand Totals');

        /* generate XLSX file and prompt to download */
        XLSX.writeFile(workbook, 'Purchase_Report.xlsx');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
}
