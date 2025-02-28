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


document.getElementById('loginForm1').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    fetchDataAndProcess();
});



function fetchDataAndProcess() {
    var data = {
        from_date: formatDate(document.getElementById("fromdate").value),
        to_date: formatDate(document.getElementById("todate").value),
        customer_name: getElementValueWithDefault('customer', '*'),
        route: getElementValueWithDefault('route', '*'),
    };
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    return fetch('http://103.174.102.89:3000/carateReport', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.status === 404) {
                loader.style.display = 'none';
               
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No data found.',
            });

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
            return result; // Return the result to be used in the caller
        })
        .catch(error => {
            console.error('Error:', error);
            // Optionally, you can display an error message here
            throw error; // Rethrow the error for the caller to handle
        });
}



function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['carate_date', 'customer_name', 'route_detail','summary', "outCarate", 'out_carate_total', "inCarate", 'in_carate_total'];
    var counter = 1;
    console.log(data.reports);
    if (data.reports.length === 0) {
       
Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'No data found.',
  });

    }
    data.reports.forEach(function (item) {
        if (item.out_carate_total === 0 && item.in_carate_total === 0) {
            return;
        }
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function (key) {
            var cell = row.insertCell();
            if (key === 'carate_date') {
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

    console.log(document.getElementById('customer').value);

    // Add row for grand total
    var totalRow = tbody.insertRow();
    totalRow.insertCell().colSpan = 1; // Skip the first column

    columnsToDisplay.forEach(function (key) {
        var cell = totalRow.insertCell();
        if (key === 'summary') {
            cell.textContent = 'Grand Total';
            cell.style.fontWeight = 'bold'; // Make the label bold
        } else {
            switch (key) {
                case 'out_carate_total':
                    cell.textContent = data.Grand['Grand out_carate_total'];
                    cell.style.fontWeight = 'bold'; // Make the value bold
                    break;
                case 'in_carate_total':
                    cell.textContent = data.Grand['Grand in_carate_total'];
                    cell.style.fontWeight = 'bold'; // Make the value bold
                    break;
                default:
                    cell.textContent = '';
                    break;
            }
        }
    });

    if (document.getElementById('customer').value !== '') {
        fetch('http://103.174.102.89:3000/carateuserData/' + document.getElementById('customer').value)
            .then(response => {
                if (!response.ok) {
                    loader.style.display = 'none';
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data1 => {
                // Populate dropdown with API data
                console.log(data1);

                // Add remaining carate data in the last cell
                var lastCell = totalRow.insertCell();
                lastCell.colSpan = columnsToDisplay.length - totalRow.cells.length + 1;
                lastCell.innerHTML = 'Remaining Carate of Customer:<br>' +
                    '100 => ' + data1[0]['carate_100'] + '<br>' +
                    '150 => ' + data1[0]['carate_150'] + '<br>' +
                    '250 => ' + data1[0]['carate_250'] + '<br>' +
                    '350 => ' + data1[0]['carate_350'];
            });
    } else  if (document.getElementById('route').value !== '') {
        fetch('http://103.174.102.89:3000/carateuserData/route/' + document.getElementById('route').value)
        .then(response => {
            if (!response.ok) {
                loader.style.display = 'none';
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data1 => {
            // Populate dropdown with API data
            console.log(data1);

            // Add remaining carate data in the last cell
            var lastCell = totalRow.insertCell();
            lastCell.colSpan = columnsToDisplay.length - totalRow.cells.length + 1;
            lastCell.innerHTML = 'Remaining Carate of Customer:<br>' +
                '100 => ' + data1[0]['carate_100'] + '<br>' +
                '150 => ' + data1[0]['carate_150'] + '<br>' +
                '250 => ' + data1[0]['carate_250'] + '<br>' +
                '350 => ' + data1[0]['carate_350'];
        });
    
    }else {
        fetch('http://103.174.102.89:3000/carateuserData')
            .then(response => {
                if (!response.ok) {
                    loader.style.display = 'none';
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data1 => {
                // Populate dropdown with API data
                console.log(data1);

                // Add remaining carate data in the last cell
                var lastCell = totalRow.insertCell();
                lastCell.colSpan = columnsToDisplay.length - totalRow.cells.length + 1;
                lastCell.innerHTML = 'Remaining Carate of Customer:<br>' +
                    '100 => ' + data1[0]['carate_100'] + '<br>' +
                    '150 => ' + data1[0]['carate_150'] + '<br>' +
                    '250 => ' + data1[0]['carate_250'] + '<br>' +
                    '350 => ' + data1[0]['carate_350'];
            });
    }
}


async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        return fetch('http://103.174.102.89:3000/carateReport/generate-pdf', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 404) {
                loader.style.display = 'none';
               
Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'No data found.',
  });

                throw new Error('Data not found');
            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob(); // Get the response as a Blob
        })
        .then(blob => {
            loader.style.display = 'none';

            // Create a URL for the Blob and trigger a download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'carateReport.pdf'; // Set the desidarkgrey file name
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url); // Release the URL

            console.log('PDF downloaded successfully');
        })
        .catch(error => {
            loader.style.display = 'none';
            console.error('Error:', error);

Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Error generating PDF. Please try again.',
  });


        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error generating PDF. Please try again.',
          });
    }
}


