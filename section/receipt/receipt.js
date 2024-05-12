// Fetch data from API
document.addEventListener('DOMContentLoaded', function () {
    // Get the current date
    var currentDate = new Date();
    // Format the date as mm/dd/yyyy
    var formattedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    // Set the placeholder of the input field to the formatted date
    document.getElementById('date').value = formattedDate;

    fetch('http://65.0.168.11/fetchReceiptid')
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

document.getElementById('loginForm1').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
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
    var loader = document.getElementById('loader');
    loader.style.display = 'block';
    await fetch('http://65.0.168.11/receiptData/insertReceipt', {
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
        alert("Receipt Data is added Successfully");
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });

});


