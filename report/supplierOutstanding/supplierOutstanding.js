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
        supplier_name: getElementValueWithDefault('customer', '*')
    };
    console.log(data);

    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    return fetch('http://65.0.168.11/supplierOutstanding', {
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
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['name', 'address', 'mobile_no', "Amount"];
    var counter = 1;
    console.log(data.reports);
    if (data.reports.length === 0) {
        alert("No Data Found");
    }
    data.reports.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            cell.textContent = item[key];
        });
    });

    // Add row for grand total
    var totalRow = tbody.insertRow();
    for (let i = 0; i < columnsToDisplay.length; i++) {
        var cell = totalRow.insertCell();
        // Shift the grand total one more column to the right
        if (i === columnsToDisplay.length - 2) {
            cell = totalRow.insertCell(); // Insert empty cell
        } else if (i === columnsToDisplay.length - 1) {
            cell.textContent = 'Grand Total: ' + data.Grand['Grand Amount'];
        }
    }
}

async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        const customHeaders = ['name', 'address', 'mobile_no', "Amount"];

        // Create a new worksheet with custom headers
        const worksheet = XLSX.utils.aoa_to_sheet([customHeaders]);

        // Append the data to the worksheet
        data.reports.forEach((report) => {
            const rowData = [
                report.name,
                report.address,
                report.mobile_no,
                report.Amount
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: -1 });
        });

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Add the worksheet with data
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

        /* generate XLSX file and prompt to download */
        XLSX.writeFile(workbook, 'Supplier_Outstanding_Report.xlsx');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
}
