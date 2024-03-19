// Fetch data from API
document.addEventListener('DOMContentLoaded', function () {
    // Get the current date
    var currentDate = new Date();

    // Format the date as mm/dd/yyyy
    var formattedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

    // Set the placeholder of the input field to the formatted date
    document.getElementById('date').value = formattedDate;

    fetch('http://localhost:3000/fetchSaleid')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            document.getElementById('bill_no').value = parseInt(data[0]['num']) + 1;

        })
        .catch(error => {
            console.error('Error:', error);
        });

    fetch('http://localhost:3000/list/Customer')
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
            populateDropdown2(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    fetch('http://localhost:3000/saleproductData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            populateDropdown3(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    fetch('http://localhost:3000/routeData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            populateDropdown4(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


function populateDropdown(data) {
    var userNameDropdown = document.getElementById('name');
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
    placeholderOption.textContent = "Select user type"; // Set placeholder text
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
    var userNameDropdown = document.getElementById('product');
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

function deleteUser(userId) {
    // Perform delete operation based on userId
    fetch('http://localhost:3000/saleproductData/deletesaleproduct/' + userId, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('User deleted successfully');
            // Refresh the table or update UI as needed
            user(); // Assuming you want to refresh the table after delete
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function populateDropdown4(data) {
    var userNameDropdown = document.getElementById('Route');
    userNameDropdown.innerHTML = ''; // Clear existing options

    // Create and append new options based on API data
    data.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item.route_name; // Set the value
        option.textContent = item.route_name; // Set the display text
        userNameDropdown.appendChild(option);
    });

    // Add a placeholder option
    var placeholderOption = document.createElement('option');
    placeholderOption.value = ""; // Set an empty value
    placeholderOption.textContent = "Select Route type"; // Set placeholder text
    placeholderOption.disabled = true; // Disable the option
    placeholderOption.selected = true; // Select the option by default
    userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
}


function getProducts() {
    var bataId = document.getElementById('bata').value;
    console.log(bataId)
    fetch('http://localhost:3000/purchaseproductData/getBataProduct/' + bataId)
        .then(response => response.json())
        .then(data => {
            console.log(data[0].product_name)
            document.getElementById('rate').value = data[0].selling_price;
            // document.getElementById('product').value = data.product_name
            var productDropdown = document.getElementById('product');
            // Loop through the options in the dropdown
            for (var i = 0; i < productDropdown.options.length; i++) {
                console.log(data.product_name);
                // Check if the current option's value matches the fetched data
                if (productDropdown.options[i].value == data.product_name) {
                    // Set the selected attribute of the matched option
                    productDropdown.options[i].selected = true;
                    // Exit the loop since we found the matching option
                    break;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

