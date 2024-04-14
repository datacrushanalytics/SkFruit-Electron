// // Fetch data from API
// document.addEventListener('DOMContentLoaded', function () {

//     fetch('http://13.126.106.17/vehicleData')
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
// });


// function populateDropdown(data) {
//     var userNameDropdown = document.getElementById('vehicleNumber');
//     userNameDropdown.innerHTML = ''; // Clear existing options

//     // Create and append new options based on API data
//     data.forEach(function (item) {
//         var option = document.createElement('option');
//         option.value = item.vehicle_no; // Set the value
//         option.textContent = item.vehicle_no; // Set the display text
//         userNameDropdown.appendChild(option);
//     });

//     // Add a placeholder option
//     var placeholderOption = document.createElement('option');
//     placeholderOption.value = ""; // Set an empty value
//     placeholderOption.textContent = "Select Vehicle"; // Set placeholder text
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
//         vehicle_no : getElementValueWithDefault('vehicleNumber', '*') 
//     };
//     console.log(data);

//     fetch('http://13.126.106.17/dailyReport', {
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
//         populateTable5(result)
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
        vehicle_no : getElementValueWithDefault('vehicleNumber', '*') 
    };

    return fetch('http://13.126.106.17/dailyReport', {
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
    var columnsToDisplay = ['bill_no', 'date', 'cust_name','vehicle_no','route','driver_name', 'amount','cash','online_amt','discount','inCarat','carate_amount'];
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
}


function populateTable5(data) {
    var tbody = document.getElementById('tableBody1');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['receipt_id', 'date', 'Customer','to_account','note', 'cash','online','discount',"inCarat","Amt"];
    var counter = 1;
    console.log(data.Receipt)
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

        const customHeaders = ['bill_no', 'date', 'cust_name','vehicle_no','route','driver_name', 'amount','cash','online_amt','discount','inCarat','carate_amount'];

        // Create a new worksheet with custom headers
        const worksheet = XLSX.utils.aoa_to_sheet([customHeaders]);

        // Append the data to the worksheet
        data.reports.forEach((report) => {
            const rowData = [
                report.bill_no,
                report.date,
                report.cust_name,
                report.vehicle_no,
                report.route,
                report.driver_name,
                report.amount,
                report.cash,
                report.online_amt,
                report.discount,
                report.inCarat,
                report.carate_amount
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: -1 });
        });


        const customHeaders1 = ['receipt_id', 'date', 'Customer','to_account','note', 'cash','online','discount',"inCarat","Amt"];

        // Create a new worksheet with custom headers
        const worksheet1 = XLSX.utils.aoa_to_sheet([customHeaders1]);

        // Append the data to the worksheet
        data.Receipt.forEach((Receipt) => {
            const rowData = [
                Receipt.receipt_id,
                Receipt.date,
                Receipt.Customer,
                Receipt.to_account,
                Receipt.note,
                Receipt.cash,
                Receipt.online,
                Receipt.discount,
                Receipt.inCarat,
                Receipt.Amt
            ];
            XLSX.utils.sheet_add_aoa(worksheet1, [rowData], { origin: -1 });
        });


        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Add the worksheet with data
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
        XLSX.utils.book_append_sheet(workbook, worksheet1, 'Receipts');

        /* generate XLSX file and prompt to download */
        XLSX.writeFile(workbook, 'Daily_Report.xlsx');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
}





