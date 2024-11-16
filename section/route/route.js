
function route() {
    console.log("user function executed");
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    fetch('http://103.174.102.89:3000/routeData')
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
            editButton.style.backgroundColor = 'green';
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
            deleteButton.style.backgroundColor = 'red';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                // SweetAlert2 confirmation dialog
                Swal.fire({
                    title: 'Are you sure?',
                    text: "Do you really want to delete this Route?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Call the deleteUser function only if confirmed
                        deleteRoute(item.id); // Pass the user id to the delete function
        
                        // Optional: Show success message
                        Swal.fire(
                            'Deleted!',
                            'The Route has been deleted.',
                            'success'
                        );
                    }
                });
            });
            deleteCell.appendChild(deleteButton);
        }
    });
}

function editRoute(user) {
    localStorage.setItem('userData', JSON.stringify(user));
     // darkgreyirect to user_update.html
     window.location.href = '../route/update_route.html';
}



function deleteRoute(userId) {
    // Perform delete operation based on userId
    fetch('http://103.174.102.89:3000/routeData/deleterouteId/' + userId, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Route deleted successfully');
     
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Route is successfully Deleted',
            })
        // Refresh the table or update UI as needed
        route(); // Assuming you want to refresh the table after delete
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

route();

