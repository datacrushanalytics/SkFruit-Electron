// // Fetch data from API
// document.addEventListener('DOMContentLoaded', function () {

//     fetch('http://localhost:3000/list/Customer')
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


//     fetch('http://localhost:3000/routeData')
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
//     placeholderOption.textContent = "Select Customer type"; // Set placeholder text
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



// document.getElementById('loginForm1').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent form submission
//     var data = {
//         from_date : formatDate(document.getElementById("fromdate").value),
//         to_date : formatDate(document.getElementById("todate").value),
//         customer_name : getElementValueWithDefault('customer', '*') , 
//         route : getElementValueWithDefault('route', '*') 
//     };
//     console.log(data);

//     fetch('http://localhost:3000/ledgerReport', {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(result => {
//         console.log(result)
//         populateTable4(result)
//         // Optionally, you can redirect or show a success message here
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         // Optionally, you can display an error message here
//     });
// });


document.getElementById('loginForm1').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    fetchDataAndProcess();
});


function fetchDataAndProcess() {
    var data = {
        from_date : formatDate(document.getElementById("fromdate").value),
        to_date : formatDate(document.getElementById("todate").value),
        customer_name : getElementValueWithDefault('customer', '*') , 
        route : getElementValueWithDefault('route', '*') 
    };
    console.log(data);

    return fetch('http://localhost:3000/ledgerReport', {
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
    var columnsToDisplay = ['date','route', 'customer_name','summary', 'balance','out_carate','total_balance','cash','online','discount','in_carate','remaining'];
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
     totalCell.textContent = 'Grand Total: ' + data.Grand['"Grand Balance"'] + ' ("Grand Balance"), ' + data.Grand['Grand outCarate'] + ' (Grand outCarate)' + data.Grand['Total Balance'] + ' (Total Balance), ' + data.Grand['Total Cash'] + ' (Total Cash)' + data.Grand['Total Online'] + ' (Total Online), ' + data.Grand['Grand Discount'] + ' (Grand Discount)' + data.Grand['Grand inCarate'] + ' (Grand inCarate), ' + data.Grand['Grand Remaining Amount'] + ' (Grand Remaining Amount)';                                                                                                                                                                                                                                                     
}



async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        const customHeaders = ['date','route', 'customer_name','summary', 'balance','out_carate','total_balance','cash','online','discount','in_carate','remaining'];

        // Create a new worksheet with custom headers
        const worksheet = XLSX.utils.aoa_to_sheet([customHeaders]);

        // Append the data to the worksheet
        data.reports.forEach((report) => {
            const rowData = [
                new Date(report.date).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }),
                report.route,
                report.customer_name,
                report.balance,
                report.total_balance,
                report.cash,
                report.online,
                report.discount,
                report.in_carate,
                report.remaining
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: -1 });
        });

        // Add Grand Totals to a new sheet
        const grandTotals = [                                                                                                                                                       
            ["Grand Balance", "Grand outCarate", "Total Balance", "Total Cash", "Total Online", "Grand Discount", "Grand inCarate", "Grand Remaining Amount"],
            [data.Grand["Grand Balance"], data.Grand['Grand outCarate'], data.Grand['Total Balance'], data.Grand['Total Cash'],  data.Grand['Total Online'], data.Grand['Grand Discount'], data.Grand['Grand inCarate'], data.Grand['Grand Remaining Amount'] ]
        ];
        const grandTotalsWorksheet = XLSX.utils.aoa_to_sheet(grandTotals);

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Add the worksheet with data
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

        // Add the worksheet with grand totals
        XLSX.utils.book_append_sheet(workbook, grandTotalsWorksheet, 'Grand Totals');

        /* generate XLSX file and prompt to download */
        XLSX.writeFile(workbook, 'Ledger_Report.xlsx');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
}
