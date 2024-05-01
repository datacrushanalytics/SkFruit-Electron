// // Fetch data from API
// document.addEventListener('DOMContentLoaded', function() {

//     fetch('http://65.0.168.11/accountgroupData')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Populate dropdown with API data
//             console.log(data);
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
//             console.log(data);
//             populateDropdown1(data);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
//     });


// function populateDropdown(data) {
//     var userNameDropdown = document.getElementById('account_group');
//     userNameDropdown.innerHTML = ''; // Clear existing options

//     // Create and append new options based on API data
//     data.forEach(function(item) {
//         var option = document.createElement('option');
//         option.value = item.name; // Set the value
//         option.textContent =item.name; // Set the display text
//         userNameDropdown.appendChild(option);
//     });

//     // Add a placeholder option
//     var placeholderOption = document.createElement('option');
//     placeholderOption.value = ""; // Set an empty value
//     placeholderOption.textContent = "Select user type"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }


// function populateDropdown1(data) {
//     var userNameDropdown = document.getElementById('route_detail');
//     userNameDropdown.innerHTML = ''; // Clear existing options

//     // Create and append new options based on API data
//     data.forEach(function(item) {
//         var option = document.createElement('option');
//         option.value = item.route_name; // Set the value
//         option.textContent =item.route_name; // Set the display text
//         userNameDropdown.appendChild(option);
//     });

//     // Add a placeholder option
//     var placeholderOption = document.createElement('option');
//     placeholderOption.value = ""; // Set an empty value
//     placeholderOption.textContent = "Select user type"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }


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



document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    var formData = new FormData(document.getElementById('loginForm'));
    var data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    console.log(data);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    fetch('http://65.0.168.11/accountData/insertaccount', {
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
        loader.style.display = 'none';
        console.log('Data added successfully:', result);
        alert("Account is successfully Added");
        window.location.href = './account.html';
        // Optionally, you can redirect or show a success message here
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, you can display an error message here
    });
});
