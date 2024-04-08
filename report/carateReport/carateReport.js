// Fetch data from API
document.addEventListener('DOMContentLoaded', function () {

    fetch('http://43.205.230.120/list/Customer')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            populateDropdown(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

});


function populateDropdown(data) {
    var userNameDropdown = document.getElementById('customer');
    userNameDropdown.innerHTML = ''; // Clear existing options

    // Create and append new options based on API data
    data.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item.name; // Set the value
        option.textContent = item.name; // Set the display text
        userNameDropdown.appendChild(option);
    });

    // Add a placeholder option
    var placeholderOption = document.createElement('option');
    placeholderOption.value = ""; // Set an empty value
    placeholderOption.textContent = "Select Customer type"; // Set placeholder text
    placeholderOption.disabled = true; // Disable the option
    placeholderOption.selected = true; // Select the option by default
    userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
}





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
        customer_name: getElementValueWithDefault('customer', '*'),
    };

    return fetch('http://43.205.230.120/carateReport', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        console.log(result);
        populateTable4(result);
        return result; // Return the result to be used in the caller
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, you can display an error message here
        throw error; // Rethrow the error for the caller to handle
    });
}



async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        const customHeaders = ['Date', 'Customer Name', 'Summary', 'In Carat', 'In Carat Total', 'Out Carat', 'Out Carat Total'];

        // Create a new worksheet with custom headers
        const worksheet = XLSX.utils.aoa_to_sheet([customHeaders]);

        // Append the data to the worksheet
        data.reports.forEach((report) => {
            const rowData = [
                report.carate_date,
                report.customer_name,
                report.summary,
                report.inCarate,
                report.in_carate_total,
                report.OutCarate,
                report.out_carate_total
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: -1 });
        });

        // Add Grand Totals to a new sheet
        const grandTotals = [
            ["Grand in_carate_total", "Grand out_carate_total"],
            [data.Grand["Grand in_carate_total"], data.Grand["Grand out_carate_total"]]
        ];
        const grandTotalsWorksheet = XLSX.utils.aoa_to_sheet(grandTotals);

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Add the worksheet with data
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

        // Add the worksheet with grand totals
        XLSX.utils.book_append_sheet(workbook, grandTotalsWorksheet, 'Grand Totals');

        /* generate XLSX file and prompt to download */
        XLSX.writeFile(workbook, 'api_data.xlsx');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
}





function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['carate_date','customer_name','summary',"inCarate",'in_carate_total',"OutCarate",'out_carate_total'];
    var counter = 1;
    console.log(data.reports)
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
     totalCell.textContent = 'Grand Total: ' + data.Grand['Grand in_carate_total'] + ' (Grand in_carate_total), ' + data.Grand['Grand out_carate_total'] + ' (Grand out_carate_total)';
}



