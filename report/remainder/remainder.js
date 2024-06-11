let accountInfo = [];

function remainder() {
    console.log("product function executed");
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    return fetch('http://65.2.144.249/remainderReport')
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
        .then(data => {
            loader.style.display = 'none';
            console.log(data);
            accountInfo = data.reports;
            populateTable(accountInfo);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function searchData() {
    console.log("Searching execute noticed");
    const query = document.getElementById('searchBox').value.toLowerCase();
    await console.table(accountInfo);
    const filteredResults = accountInfo.filter(item => {
        return (
            (item.name?.toLowerCase() ?? '').includes(query) ||
            (item.address?.toLowerCase() ?? '').includes(query) ||
            (item.mobile_no?.toString().toLowerCase() ?? '').includes(query)
        );
    });
    populateTable(filteredResults);
}

function populateTable(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var isAdmin = JSON.parse(localStorage.getItem('sessionData'))[0].usertype === 'Admin';
    var columnsToDisplay = ['name', 'address', 'mobile_no', "last_update", 'current_balance'];
    var counter = 1;
    var totalCurrentBalance = 0;

    if (data.length === 0) {
        alert("No Data Found");
    }

    data.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            if (key === 'last_update') {
                if (item[key] === null || item[key] === undefined) {
                    cell.textContent = 'null';
                } else {
                    var utcDate = new Date(item[key]);
                    var options = {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        timeZone: 'Asia/Kolkata'
                    };
                    cell.textContent = utcDate.toLocaleString('en-IN', options);
                }
            } else {
                cell.textContent = item[key];
                if (key === 'current_balance') {
                    totalCurrentBalance += parseFloat(item[key]);
                }
            }
        });

        if (isAdmin) {
            var editCell = row.insertCell();
            var editButton = document.createElement('button');
            editButton.className = 'button edit-button';
            var editLink = document.createElement('a');
            editLink.href = '../remainder/update_remainder.html'; // Edit link destination
            editLink.textContent = 'Edit';
            editButton.appendChild(editLink);
            editButton.addEventListener('click', function() {
                editUser(item); // Pass the user data to the edit function
            });
            editCell.appendChild(editButton);
        }
    });

    // Add a row for the grand total
    var totalRow = tbody.insertRow();

    // Create empty cells before the 'Grand Total' label and the total amount cell
    for (let i = 0; i < columnsToDisplay.length - 1; i++) {
        var emptyCell = totalRow.insertCell();
        emptyCell.textContent = '';
    }

    // Add the 'Grand Total' label
    var grandTotalLabelCell = totalRow.insertCell();
    grandTotalLabelCell.textContent = 'Grand Total';
    grandTotalLabelCell.style.fontWeight = 'bold';
    grandTotalLabelCell.style.textAlign = 'right';

    // Add the total amount cell
    var totalCell = totalRow.insertCell();
    totalCell.textContent = totalCurrentBalance.toFixed(2); // Assuming you want 2 decimal places
    totalCell.style.fontWeight = 'bold';
    totalCell.style.textAlign = 'right';

    // Add an empty cell after the total amount if there are admin columns
    if (isAdmin) {
        var adminCell = totalRow.insertCell();
        adminCell.textContent = '';
    }
}

function editUser(user) {
    console.log("Editing user data");
    localStorage.setItem('remainderData', JSON.stringify(user));
    // Redirect to user_update.html
    window.location.href = '../remainder/update_remainder.html';
}

remainder();
