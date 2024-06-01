
function route() {
    console.log("user function executed");
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    fetch('http://65.2.144.249/routeData')
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
    var columnsToDisplay = ['route_name', 'details','mobile_no'];
    var counter = 1;
    var isAdmin = JSON.parse(localStorage.getItem('sessionData'))[0].usertype === 'Admin';
    data.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            cell.textContent = item[key];
        });

        // Add Edit button if user is admin
        if (isAdmin) { 
            var editCell = row.insertCell();
            var editButton = document.createElement('button');
            editButton.className = 'button1 edit-button';
            var editLink = document.createElement('a');
            editLink.href = '../route/update_route.html'; // Edit link destination
            editLink.textContent = 'Edit';
            editButton.appendChild(editLink);
            editButton.addEventListener('click', function() {
                editRoute(item); // Pass the user data to the edit function
            });
            editCell.appendChild(editButton);
        }
 
        // Add Delete button if user is admin
        if (isAdmin) {
            var deleteCell = row.insertCell();
            var deleteButton = document.createElement('button');
            deleteButton.className = 'button delete-button';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                deleteRoute(item.id); // Pass the user id to the delete function
            });
            deleteCell.appendChild(deleteButton);
        }
    });
}

function editRoute(user) {
    localStorage.setItem('userData', JSON.stringify(user));
     // Redirect to user_update.html
     window.location.href = '../route/update_route.html';
}



function deleteRoute(userId) {
    // Perform delete operation based on userId
    fetch('http://65.2.144.249/routeData/deleterouteId/' + userId, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Route deleted successfully');
        alert("Route is successfully Deleted");
        // Refresh the table or update UI as needed
        route(); // Assuming you want to refresh the table after delete
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

route();

