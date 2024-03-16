// Fetch data from API
document.addEventListener('DOMContentLoaded', function () {

    fetch('http://localhost:3000/list/Supplier')
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

    fetch('http://localhost:3000/purchaseproductData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            populateDropdown1(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    fetch('http://localhost:3000/vehicleData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            populateDropdown2(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


function populateDropdown(data) {
    var userNameDropdown = document.getElementById('supplier');
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
    placeholderOption.textContent = "Select Supplier type"; // Set placeholder text
    placeholderOption.disabled = true; // Disable the option
    placeholderOption.selected = true; // Select the option by default
    userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
}

function populateDropdown1(data) {
    var userNameDropdown = document.getElementById('bata');
    userNameDropdown.innerHTML = ''; // Clear existing options

    // Create and append new options based on API data
    data.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item.bata; // Set the value
        option.textContent = item.bata; // Set the display text
        userNameDropdown.appendChild(option);
    });

    // Add a placeholder option
    var placeholderOption = document.createElement('option');
    placeholderOption.value = ""; // Set an empty value
    placeholderOption.textContent = "Select Bata"; // Set placeholder text
    placeholderOption.disabled = true; // Disable the option
    placeholderOption.selected = true; // Select the option by default
    userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
}


function populateDropdown2(data) {
    var userNameDropdown = document.getElementById('vehicleNumber');
    userNameDropdown.innerHTML = ''; // Clear existing options

    // Create and append new options based on API data
    data.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item.vehicle_no; // Set the value
        option.textContent = item.vehicle_no; // Set the display text
        userNameDropdown.appendChild(option);
    });

    // Add a placeholder option
    var placeholderOption = document.createElement('option');
    placeholderOption.value = ""; // Set an empty value
    placeholderOption.textContent = "Select Vehicle"; // Set placeholder text
    placeholderOption.disabled = true; // Disable the option
    placeholderOption.selected = true; // Select the option by default
    userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
}























function populateDropdown3(data) {
    var tbody = document.getElementById('tableBody1');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['product', 'bata', 'mark', 'quantity', 'rate', 'price'];
    data.forEach(function (item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        columnsToDisplay.forEach(function (key) {
            var cell = row.insertCell();
            cell.textContent = item[key];
        });
        // Add Delete button
        var deleteCell = row.insertCell();
        var deleteButton = document.createElement('button');
        deleteButton.className = 'button delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            deleteUser(item.id); // Pass the user id to the delete function
        });
        deleteCell.appendChild(deleteButton);

    });
}


