// Fetch data from API
document.addEventListener('DOMContentLoaded', function () {
    // Get the current date
    var currentDate = new Date();
    // Format the date as mm/dd/yyyy
    var formattedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    // Set the placeholder of the input field to the formatted date
    document.getElementById('date').value = formattedDate;
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

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


    fetch('http://localhost:3000/list/Bank Account')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loader.style.display = 'none';
            // Populate dropdown with API data
            populateDropdown1(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


function populateDropdown(data) {
    var userNameDropdown = document.getElementById('bata');
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
    placeholderOption.textContent = "Select Supplier Name"; // Set placeholder text
    placeholderOption.disabled = true; // Disable the option
    placeholderOption.selected = true; // Select the option by default
    userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
}

function populateDropdown1(data) {
    var userNameDropdown = document.getElementById('product');
    userNameDropdown.innerHTML = ''; // Clear existing options
    // Add a hardcoded option
    var hardcodedOption = document.createElement('option');
    hardcodedOption.value = "CASH"; // Set the value for the hardcoded option
    hardcodedOption.textContent = "CASH"; // Set the display text for the hardcoded option
    userNameDropdown.appendChild(hardcodedOption);

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
    placeholderOption.textContent = "Select Online Account"; // Set placeholder text
    placeholderOption.disabled = true; // Disable the option
    placeholderOption.selected = true; // Select the option by default
    userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
}



document.getElementById('loginForm1').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
console.log("jahsafhfa")
// function form2(){
    var formData = {
        date: document.getElementById('date').value,
        from_account: document.getElementById('product').value,
        to_account: document.getElementById('bata').value,
        comment: document.getElementById('comment').value,
        prev_balance: parseInt(document.getElementById('previousBalance').value) || 0,
        amounr: parseInt(document.getElementById('amount').value) || 0        
    };
    var loader = document.getElementById('loader');
    loader.style.display = 'block';


    await fetch('http://localhost:3000/paymentData/insertPayment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        console.log("DTAASS")
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        loader.style.display = 'none';
        console.log('Entry added successfully:', result);
        alert("Payment Data is added Successfully");
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });

});



