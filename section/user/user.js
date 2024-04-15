
function user() {
    console.log("user function executed");

    fetch('http://3.109.5.164/userData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
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
    var columnsToDisplay = ['name', 'address','mobile_no','username','password','status','usertype'];
    var counter = 1;
    data.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            cell.textContent = item[key];
        });

         // Add Edit button
         var editCell = row.insertCell();
         var editButton = document.createElement('button');
         editButton.className = 'button edit-button';
         var editLink = document.createElement('a');
         editLink.href = '../user/update_user.html'; // Edit link destination
         editLink.textContent = 'Edit';
         editButton.appendChild(editLink);

        editButton.addEventListener('click', function() {
            editUser(item); // Pass the user data to the edit function
        });
        editCell.appendChild(editButton);
 
         // Add Delete button
         var deleteCell = row.insertCell();
         var deleteButton = document.createElement('button');
         deleteButton.className = 'button delete-button';
         deleteButton.textContent = 'Delete';
         deleteButton.addEventListener('click', function() {
            deleteUser(item.id); // Pass the user id to the delete function
        });
        deleteCell.appendChild(deleteButton);
    });
}

function editUser(user) {
    // Convert user data to JSON and encode it for URL
    // var userData = encodeURIComponent(JSON.stringify(user));
    // console.log("Jell")
    // console.log(userData)
    // console.log(user.id);
    // document.getElementById("id1").value = user.id;

    // Redirect to user_master.html with user data in query parameter
    // window.location.href = "../user/User_Master.html"
    // window.location.href = '../user/user_update.html?userData=' + '%7B"id"%3A31%2C"name"%3A"Deepali"%2C"address"%3A"nsk"%2C"mobile_no"%3A1234567890%2C"username"%3A"dee"%2C"password"%3A"asd"%2C"status"%3A"1"%2C"usertype"%3A"Admin"%7D';
    localStorage.setItem('userData', JSON.stringify(user));
     // Redirect to user_update.html
     window.location.href = '../user/update_user.html';
}



function deleteUser(userId) {
    // Perform delete operation based on userId
    fetch('http://3.109.5.164/userData/deleteUser/' + userId, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('User deleted successfully');
        alert("User is successfully Deleted");
        // Refresh the table or update UI as needed
        user(); // Assuming you want to refresh the table after delete
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

user();

