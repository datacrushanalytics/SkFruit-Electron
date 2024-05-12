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
//         customer_name : getElementValueWithDefault('customer', '*') , 
//         route : getElementValueWithDefault('route', '*') 
//     };
//     console.log(data);

//     fetch('http://65.0.168.11/customerOutstandingReport', {
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
        customer_name : getElementValueWithDefault('customer', '*') , 
        route : getElementValueWithDefault('route', '*') 
    };
    console.log(data);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    return fetch('http://65.0.168.11/customerOutstandingReport', {
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
    var columnsToDisplay = ['id','name','address','route_detail','mobile_no',"Amount"];
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
     totalCell.textContent = 'Grand Total: ' + data.Grand['Grand Amournt'] + ' ("Grand Amournt") ';                                                                                                                                                                                                                                                     
}




async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        const customHeaders = ['id','name','address','route_detail','mobile_no',"Amount"];

        // Create a new worksheet with custom headers
        const worksheet = XLSX.utils.aoa_to_sheet([customHeaders]);

        // Append the data to the worksheet
        data.reports.forEach((report) => {
            const rowData = [
                report.id,
                report.name,
                report.address,
                report.route_detail,
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
        XLSX.writeFile(workbook, 'Customer_Outstanding.xlsx');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
}

