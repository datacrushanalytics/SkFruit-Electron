// Fetch data from API
document.addEventListener('DOMContentLoaded', function () {
    // Get the current date
    var currentDate = new Date();
    // Format the date as mm/dd/yyyy
    var formattedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    // Set the placeholder of the input field to the formatted date
    document.getElementById('date').value = formattedDate;

    fetch('http://localhost:3000/fetchReceiptid')
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


    fetch('http://localhost:3000/list/Bank Account')
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
});


function populateDropdown(data) {
    var userNameDropdown = document.getElementById('account_group');
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
    placeholderOption.textContent = "Select Customer Name"; // Set placeholder text
    placeholderOption.disabled = true; // Disable the option
    placeholderOption.selected = true; // Select the option by default
    userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
}

function populateDropdown1(data) {
    var userNameDropdown = document.getElementById('route_detail');
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


function populateDropdown2(data) {
    var userNameDropdown = document.getElementById('input1');
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

    await fetch('http://localhost:3000/receiptData/insertReceipt', {
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
























function receipt(){
    console.log("into insertion block");
    try{
        const recipt_no=document.querySelector('.recipt_no input').value;
        const date=document.querySelector('.date input').value;
        const from_account=parseInt(document.querySelector('.acc input').value);
        const to_account=parseInt(document.querySelector('.to_acc input').value);
        const note=document.querySelector('.note input').value;
        const prev_balance=parseInt(document.querySelector('.prev_balance input').value);
        const deposit=parseInt(document.querySelector('.deposit input').value);
        const online_dep_bnk=parseInt(document.querySelector('.online_dep_bnk input').value);
        const online_deposit=parseInt(document.querySelector('online_deposit input').value);
        const discount=parseInt(document.querySelector('discount input').value);
        const caret=parseInt(document.querySelector('.caret input').value);
        const deposite_carate_price=parseInt(document.querySelector('deposite_carate_price input').value);
        const remaining=parseInt(document.querySelector('remaining input').value);



        console.log(recipt_no,date,from_account,to_account,note,prev_balance,deposit,online_dep_bnk,online_deposit,discount,caret,deposite_carate_price,remaining)
        fetch('http://3.109.121.46/receiptData/insertreceiptData',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "recipt_no":1,
                "date":date,
                "from_account":acc,
                "to_account":to_account,
                "note":note,
                "prev_balance":prev_balance,
                "deposit":deposit,
                "online_dep_bnk":online_dep_bnk,
                "online_deposit":online_deposit,
                "discount":discount,
                "caret":caret,
                "deposite_carate_price":deposite_carate_price,
                "remaining":remaining
            })
        })
            
.then(Response =>{
    if(!Response.ok){
        console.log(response)
        throw new Error('Network response was not ok');
    }
    return response.text();
})
    .then(data => alert(data))
    .catch(error =>{
        console.error('There was a problem with the fetch operation:',error);
     });
    } catch (error){
        console.error('An error occurred:', error);

    }
}
