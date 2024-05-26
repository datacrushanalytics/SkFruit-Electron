// // Fetch data from API
// document.addEventListener('DOMContentLoaded', function () {

//     fetch('http://65.0.168.11/list/Customer')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Populate dropdown with API data
//             populateDropdown(data);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });


//     fetch('http://65.0.168.11/routeData')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Populate dropdown with API data
//             populateDropdown4(data);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// });


// function populateDropdown(data) {
//     var userNameDropdown = document.getElementById('customer');
//     userNameDropdown.innerHTML = ''; // Clear existing options

//     // Create and append new options based on API data
//     data.forEach(function (item) {
//         var option = document.createElement('option');
//         option.value = item.name; // Set the value
//         option.textContent = item.name; // Set the display text
//         userNameDropdown.appendChild(option);
//     });

//     // Add a placeholder option
//     var placeholderOption = document.createElement('option');
//     placeholderOption.value = ""; // Set an empty value
//     placeholderOption.textContent = "Select Customer"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }

// function populateDropdown4(data) {
//     var userNameDropdown = document.getElementById('route');
//     userNameDropdown.innerHTML = ''; // Clear existing options

//     // Create and append new options based on API data
//     data.forEach(function (item) {
//         var option = document.createElement('option');
//         option.value = item.route_name; // Set the value
//         option.textContent = item.route_name; // Set the display text
//         userNameDropdown.appendChild(option);
//     });

//     // Add a placeholder option
//     var placeholderOption = document.createElement('option');
//     placeholderOption.value = ""; // Set an empty value
//     placeholderOption.textContent = "Select Route type"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }



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
    if (selectedValues.length === 0) {
        selectedValues = "*";
    }
    var data = {
        from_date: formatDate(document.getElementById("fromdate").value),
        to_date: formatDate(document.getElementById("todate").value),
        cust_name: getElementValueWithDefault('customer', '*'),
        route: selectedValues || '*',
    };
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    return fetch('http://65.0.168.11/khatawani', {
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
    var columnsToDisplay = [
        'bill_no', 'date', 'cust_name', 'route', 'amount', 'carate_amount',
        'TotalKalam', 'pre_balance', 'cash', 'online_amt', 'discount', 'inCarat', 'balance'
    ];
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
            if (key == 'date') {
                console.log(item[key]);
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
                totalCell.textContent = data.Grand['Grand Bill Amount'];
                break;
            case 'carate_amount':
                totalCell.textContent = data.Grand['Grand outCarate'];
                break;
            case 'TotalKalam':
                totalCell.textContent = data.Grand['Total Bill Amount'];
                break;
            case 'cash':
                totalCell.textContent = data.Grand['Cash'];
                break;
            case 'online_amt':
                totalCell.textContent = data.Grand['Online Amount'];
                break;
            case 'discount':
                totalCell.textContent = data.Grand['Grand Discount'];
                break;
            case 'inCarat':
                totalCell.textContent = data.Grand['Grand inCarate'];
                break;
            default:
                totalCell.textContent = '';
        }
    });
}

async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        const customHeaders = [
            'bill_no', 'date', 'cust_name', 'route', 'amount', 'carate_amount',
            'TotalKalam', 'pre_balance', 'cash', 'online_amt', 'discount', 'inCarat', 'balance'
        ];

        // Create a new worksheet with custom headers
        const worksheet = XLSX.utils.aoa_to_sheet([customHeaders]);

        // Append the data to the worksheet
        data.reports.forEach((report) => {
            const rowData = [
                report.bill_no,
                report.date,
                report.cust_name,
                report.route,
                report.amount,
                report.carate_amount,
                report.TotalKalam,
                report.pre_balance,
                report.cash,
                report.online_amt,
                report.discount,
                report.inCarat,
                report.balance
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: -1 });
        });

        // Add Grand Totals to a new sheet
        const grandTotals = [
            ["", "Grand Bill Amount", "Grand outCarate", "Total Bill Amount", "Total Cash", "Online Amount", "Grand Discount", "Grand inCarate"],
            [
                '',
                data.Grand['Grand Bill Amount'], data.Grand['Grand outCarate'], data.Grand['Total Bill Amount'],
                data.Grand['Cash'], data.Grand['Online Amount'], data.Grand['Grand Discount'], data.Grand['Grand inCarate']
            ]
        ];
        const grandTotalsWorksheet = XLSX.utils.aoa_to_sheet(grandTotals);

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Add the worksheet with data
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

        // Add the worksheet with grand totals
        XLSX.utils.book_append_sheet(workbook, grandTotalsWorksheet, 'Grand Totals');

        /* generate XLSX file and prompt to download */
        XLSX.writeFile(workbook, 'Khatawani.xlsx');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
}
