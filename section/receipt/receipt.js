// Fetch data from API
document.addEventListener('DOMContentLoaded', function () {
    // Get the current date
    var currentDate = new Date();
    // Format the date as mm/dd/yyyy
    var formattedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    // Set the placeholder of the input field to the formatted date
    document.getElementById('date').value = formattedDate;

    fetch('http://13.126.106.17/fetchReceiptid')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Populate dropdown with API data
        document.getElementById('pavti').value = parseInt(data[0]['num']) + 1;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


    // fetch('http://13.126.106.17/list/Customer')
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         // Populate dropdown with API data
    //         populateDropdown(data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });


    // fetch('http://13.126.106.17/list/Bank Account')
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         // Populate dropdown with API data
    //         populateDropdown1(data);
    //         populateDropdown2(data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });



// function populateDropdown(data) {
//     var userNameDropdown = document.getElementById('account_group');
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
//     placeholderOption.textContent = "Select Customer Name"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }

// function populateDropdown1(data) {
//     var userNameDropdown = document.getElementById('route_detail');
//     userNameDropdown.innerHTML = ''; // Clear existing options
//     // Add a hardcoded option
//     var hardcodedOption = document.createElement('option');
//     hardcodedOption.value = "CASH"; // Set the value for the hardcoded option
//     hardcodedOption.textContent = "CASH"; // Set the display text for the hardcoded option
//     userNameDropdown.appendChild(hardcodedOption);

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
//     placeholderOption.textContent = "Select Online Account"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }


// function populateDropdown2(data) {
//     var userNameDropdown = document.getElementById('input1');
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
//     placeholderOption.textContent = "Select Online Account"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }




document.getElementById('loginForm1').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
console.log("jahsafhfa")
// function form2(){
    var formData = {
        receiptId: parseInt(document.getElementById('pavti').value),
        date: document.getElementById('date').value,
        from_account: document.getElementById('account_group').value,
        to_account: document.getElementById('route_detail').value,
        note: document.getElementById('message').value,
        prev_balance: parseInt(document.getElementById('input3').value) || 0,
        deposite: parseInt(document.getElementById('input6').value) || 0,
        online_deposite_bank: document.getElementById('input1').value,
        online_deposite: parseInt(document.getElementById('input7').value) || 0,
        discount: parseInt(document.getElementById('input8').value) || 0,
        carate_100: parseInt(document.getElementById('carate100').value) || 0,
        carate_150: parseInt(document.getElementById('carate150').value) || 0,
        carate_250: parseInt(document.getElementById('carate250').value) || 0,
        carate_350: parseInt(document.getElementById('carate350').value) || 0,
        deposite_carate_price: parseInt(document.getElementById('input4').value) || 0,
        remaining: parseInt(document.getElementById('input5').value) || 0,     
    };

    await fetch('http://13.126.106.17/receiptData/insertReceipt', {
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
        console.log('Entry added successfully:', result);
        alert("Receipt Data is added Successfully");
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });

});


