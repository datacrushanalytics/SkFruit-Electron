// Fetch data from API
document.addEventListener('DOMContentLoaded', function() {
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
            document.getElementById('bill_no1').value = parseInt(data[0]['num']) + 1;
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
            console.log(data);
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
            console.log(data);
            populateDropdown1(data);
            populateDropdown2(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });


function populateDropdown(data) {
    var userNameDropdown = document.getElementById('name');
    userNameDropdown.innerHTML = ''; // Clear existing options

    // Create and append new options based on API data
    data.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item.name; // Set the value
        option.textContent =item.name; // Set the display text
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
    data.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item.bata; // Set the value
        option.textContent =item.bata; // Set the display text
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
    var userNameDropdown = document.getElementById('product_name');
    userNameDropdown.innerHTML = ''; // Clear existing options

    // Create and append new options based on API data
    data.forEach(function(item) {
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



// Function to handle form submission
// function handleSubmit(event) {
//     event.preventDefault(); // Prevent default form submission

//     var selectedValue = document.getElementById('name').value; // Get the selected value
//     var selectedValueDisplay = document.getElementById('selectedValue'); // Get element to display selected value
//     selectedValueDisplay.textContent = "Selected value: " + selectedValue; // Display selected value
// }

// // Attach event listener to form submit event
// document.getElementById('userForm').addEventListener('submit', handleSubmit);

// fetchname();


// document.addEventListener('DOMContentLoaded', function() {
//     // Submit event listener for the internal form
    document.getElementById('loginForm1').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Collect form data
        var formData = {
            bata: document.getElementById('bata').value,
            mark: document.getElementById('mark').value,
            product_name: document.getElementById('product_name').value,
            quantity: document.getElementById('quantity').value,
            rate: document.getElementById('rate').value,
            price: document.getElementById('price').value
        };

        // Send form data to the backend for database insertion
        fetch('http://localhost:3000/sale/addEntry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            console.log('Entry added successfully:', result);
            // Update table with the added entry
            updateTable(result);
        })
        .catch(error => {
            console.error('Error:', error);
            // Optionally, you can display an error message here
        });
    });
// });

// Function to update the table with the added entry
function updateTable(entry) {
    var tableBody = document.getElementById('tableBody1');
    var newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${entry.product_name}</td>
        <td>${entry.bata}</td>
        <td>${entry.mark}</td>
        <td>${entry.quantity}</td>
        <td>${entry.rate}</td>
        <td>${entry.price}</td>
    `;
    tableBody.appendChild(newRow);
}



