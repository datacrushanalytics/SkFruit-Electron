
// Fetch data from API
document.addEventListener('DOMContentLoaded', function () {
    // Get the current date

    
    var currentDate = new Date();
    // Format the date as mm/dd/yyyy
    var formattedDate = currentDate.getFullYear() + '-' + (String(currentDate.getMonth() + 1).padStart(2, '0')) + '-' + (String(currentDate.getDate()).padStart(2, '0'));
    // Set the placeholder of the input field to the formatted date
    console.log(formattedDate);
    document.getElementById('date').value = formattedDate;
        // Retrieve session data from localStorage
    var sessionData = JSON.parse(localStorage.getItem('sessionData'));
    // Check if session data exists and if the user is an admin
    var isAdmin = sessionData && sessionData[0].usertype === 'Admin';
    // Check if the user is an admin and show/hide the button accordingly
    if (!isAdmin) {
        document.getElementById('date').readOnly = true; // Hide the button for non-admin users
    }
    


    fetch('http://65.2.144.249/fetchPurchaseid')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            document.getElementById('no').value = parseInt(data[0]['num']) + 1;
            fetch('http://65.2.144.249/purchaseproductData/' + (parseInt(data[0]['num']) + 1))
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Populate dropdown with API data
                    // updateTable(data);
                    // populateDropdown3(data);

                    data.forEach(function (item) {
                        updateTable(item,item.id);
                    });  
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })
        .catch(error => {
            console.error('Error:', error);
        });


});


document.getElementById('Form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
// function form2(){
    var formData = {
        date: document.getElementById('date').value,
        supplier_name: document.getElementById('supplier').value,
        gadi_number: document.getElementById('vehicle').value,
        total_quantity: parseInt(document.getElementById('total').value) || 0
    };
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    await fetch('http://65.2.144.249/purchaseData/insertPurchase', {
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
        alert("Purchase Data is added Successfully");
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });

});












