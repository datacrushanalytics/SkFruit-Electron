
function product() {
    console.log("product function executed");

    var loader = document.getElementById('loader');
    loader.style.display = 'block';
    fetch('http://65.2.144.249/categoryData')
    .then(response => {
        if (response.status === 404) {
            loader.style.display = 'none';
            alert("No data found.");
            throw new Error('Data not found');
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {
            loader.style.display = 'none';
            console.log(data);
            populateTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function populateTable(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['name'];
    var counter = 1;
    data.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            cell.textContent = item[key];
        });
 
         // Add Delete button
         var deleteCell = row.insertCell();
         var deleteButton = document.createElement('button');
         deleteButton.className = 'button delete-button';
         deleteButton.textContent = 'Delete';
         deleteButton.addEventListener('click', function() {
            deleteProduct(item.id); // Pass the user id to the delete function
        });
        deleteCell.appendChild(deleteButton);
    });
}

function deleteProduct(userId) {
    // Perform delete operation based on userId
    fetch('http://65.2.144.249/categoryData/deletecategoryId/' + userId, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('User deleted successfully');
        alert("category is successfully Deleted");
        // Refresh the table or update UI as needed
        product(); // Assuming you want to refresh the table after delete
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

product();

