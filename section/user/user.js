
function user() {
    console.log("user function executed");
    var loader = document.getElementById('loader');
    loader.style.display = 'block';
    fetch('http://103.174.102.89:3000/userData')
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
    var columnsToDisplay = ['name', 'route','address','mobile_no','username','password','status','usertype'];
    var counter = 1;
    var isAdmin = JSON.parse(localStorage.getItem('sessionData'))[0].usertype === 'Admin';
    data.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            // cell.textContent = item[key];
            if(key=='status'){
                console.log(item[key])
                if(item[key]==1){
                    cell.textContent = 'Active';
                }else{
                    cell.textContent = 'Deactive';
                }
            
            }else{
            cell.textContent = item[key];
            }
        });

         // Add Edit button if user is admin
        if (isAdmin) {
            var editCell = row.insertCell();
            var editButton = document.createElement('button');
            editButton.className = 'button edit-button';
            editButton.style.backgroundColor = 'darkgrey';
            var editLink = document.createElement('a');
            editLink.href = '../user/update_user.html'; // Edit link destination
            editLink.textContent = 'Edit';
            editButton.appendChild(editLink);
            editButton.addEventListener('click', function() {
                editUser(item); // Pass the user data to the edit function
            });
            editCell.appendChild(editButton);
        }
 
        // Add Delete button if user is admin
        if (isAdmin) {
            var deleteCell = row.insertCell();
            var deleteButton = document.createElement('button');
            deleteButton.className = 'button delete-button';
            deleteButton.style.backgroundColor = 'darkgrey';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                deleteUser(item.id); // Pass the user id to the delete function
            });
            deleteCell.appendChild(deleteButton);
        }
    });
}

function editUser(user) {
    localStorage.setItem('userData', JSON.stringify(user));
     // darkgreyirect to user_update.html
     window.location.href = '../user/update_user.html';
}



function deleteUser(userId) {
    // Perform delete operation based on userId
    fetch('http://103.174.102.89:3000/userData/deleteUser/' + userId, {
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
            text: 'User is successfully Deleted',
            })

        // Refresh the table or update UI as needed
        user(); // Assuming you want to refresh the table after delete
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

user();

