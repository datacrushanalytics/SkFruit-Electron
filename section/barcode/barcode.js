// Fetch data from API
document.addEventListener('DOMContentLoaded', function () {

    fetch('http://65.0.168.11/purchaseproductData/')
    .then(response => {
        if (response.status === 404) {
            alert("No data found.");
            throw new Error('Data not found');
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {
            // Populate dropdown with API data
            populateDropdown1(data);
            populateDropdown2(data);
            populateDropdown3(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
});



function populateDropdown1(data) {
    var userNameDropdown = document.getElementById('Route');
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
    var userNameDropdown = document.getElementById('grahk');
    userNameDropdown.innerHTML = ''; // Clear existing options

    // Create and append new options based on API data
    data.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item.product_name; // Set the value
        option.textContent = item.product_name; // Set the display text
        userNameDropdown.appendChild(option);
    });

    // Add a placeholder option
    var placeholderOption = document.createElement('option');
    placeholderOption.value = ""; // Set an empty value
    placeholderOption.textContent = "Select Product"; // Set placeholder text
    placeholderOption.disabled = true; // Disable the option
    placeholderOption.selected = true; // Select the option by default
    userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
}





function populateDropdown3(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows

    var columnsToDisplay = ['purchase_id','p_date','product_name', 'bata', 'mark', 'purchase_price', 'selling_price',];
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
            document.getElementById("popup").style.display = "block"; // Pass the user id to the delete function
        });
        deleteCell.appendChild(deleteButton);

    });
}

function deleteUser(userId) {
    // Perform delete operation based on userId
    fetch('http://65.0.168.11/saleproductData/deletesaleproduct/' + userId, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('User deleted successfully');
            alert("Barcode is successfully Deleted");
            // Refresh the table or update UI as needed
            user(); // Assuming you want to refresh the table after delete
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

