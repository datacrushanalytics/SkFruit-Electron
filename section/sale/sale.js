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
    

    fetch('http://103.174.102.89:3000/fetchSaleid')
    .then(response => {
        if (response.status === 404) {
            loader.style.display = 'none';
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No data found.',
              });
            throw new Error('Data not found');
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {
            // Populate dropdown with API data
            document.getElementById('bill').value = parseInt(data[0]['num']) + 1 || 1;
            fetch('http://103.174.102.89:3000/saleproductData/' + (parseInt(data[0]['num']) + 1) || 1)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Populate dropdown with API data
                    //populateDropdown3(data);
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



function populateDropdown3(data) {
    var tbody = document.getElementById('tableBody1');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['product', 'bata', 'mark', 'quantity', 'rate', 'price'];
    data.forEach(function (item) {
        var row = tbody.insertRow();
        columnsToDisplay.forEach(function (key) {
            var cell = row.insertCell();
            cell.textContent = item[key];
        });
        // Add Delete button
        var deleteCell = row.insertCell();
        var deleteButton = document.createElement('button');
        deleteButton.className = 'button delete-button';
        deleteButton.style.backgroundColor = '#ff355f';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            deleteUser(item.id); // Pass the user id to the delete function
        });
        deleteCell.appendChild(deleteButton);

    });
}

function deleteUser(userId) {
    // Perform delete operation based on userId
    fetch('http://103.174.102.89:3000/saleproductData/deletesaleproduct/' + userId, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('User deleted successfully');

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Sale Data is successfully Deleted',
                })
            // Refresh the table or update UI as needed
            user(); // Assuming you want to refresh the table after delete
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



function getProducts() {
    var bataId = document.getElementById('bta').value;
    console.log(bataId)
    var loader = document.getElementById('loader');
    loader.style.display = 'block';
    fetch('http://103.174.102.89:3000/purchaseproductData/getBataProduct/' + bataId)
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            console.log(data[0].product_name)
            document.getElementById('mark').value = data[0].mark;
            document.getElementById('kimmat').value = data[0].selling_price;
            
            // Get the Select2 dropdown element
            var $productDropdown = $('#product');
            
            // Set the value of the Select2 dropdown
            $productDropdown.val(data[0].product_name).trigger('change');
            $productDropdown.prop('disabled', true);
            document.getElementById('mark').readOnly = true;

        })
        .catch(error => {
            console.error('Error:', error);
        });


    fetch('http://103.174.102.89:3000/fetchStock/' + bataId)
        .then(response => {
            if (!response.ok) {
                loader.style.display = 'none';
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            // Update label with additional content
            var nagLabel = document.getElementById('nagLabel');
            nagLabel.innerHTML = 'नग: (Remaining : ' + data[0].closing + ' '+ data[0].unit +')'; 
            document.getElementById('nag1').value = data[0].closing;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
}


function updateTotal() {
    if (parseInt(document.getElementById("nag").value) > parseInt(document.getElementById('nag1').value)){
        console.log("AJAJAJ",document.getElementById('nag1').value)
        console.log("JJJJJJ",document.getElementById('nag').value)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Inventory Is not available',
          });
        document.getElementById("nag").value = 0;
    }
    document.getElementById("total").value = document.getElementById("kimmat").value * document.getElementById("nag").value
}



function getCust() {
    var number = document.getElementById('number').value;
    console.log(number)
    fetch('http://103.174.102.89:3000/fetchName/mobile/' + number)
        .then(response => {
            if (!response.ok) {
                loader.style.display = 'none';
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data[0].name)
            // Get the Select2 dropdown element
            var $productDropdown = $('#grahk');
            
            // Set the value of the Select2 dropdown if it's different
            if ($productDropdown.val() !== data[0].name) {
                $productDropdown.val(data[0].name).trigger('change');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
