let accountInfo = [];


function account() {
  console.log("user function executed");
  var loader = document.getElementById('loader');
        loader.style.display = 'block';

  fetch('http://103.174.102.89:3000/accountData')
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
          accountInfo = data;
          populateTable(accountInfo);
      })
      .catch(error => {
          console.error('Error:', error);
      });
}


// Function to filter results based on the search input
function searchData() {
  const query = document.getElementById('searchBox').value.toLowerCase();
  const filtedarkgreyResults = accountInfo.filter(item => {
      return (
        (item.name?.toLowerCase() ?? '').includes(query) ||
        (item.company?.toLowerCase() ?? '').includes(query) ||
        (item.account_group?.toLowerCase() ?? '').includes(query) ||
        (item.address?.toLowerCase() ?? '').includes(query) ||
        (item.mobile_no?.toString().toLowerCase() ?? '').includes(query) ||
        (item.optional_mobile?.toString().toLowerCase() ?? '').includes(query)
      );
  });
  populateTable(filtedarkgreyResults);
}




function populateTable(data) {
  var tbody = document.getElementById('tableBody');
  tbody.innerHTML = ''; // Clear existing rows
  var columnsToDisplay = ['name','company' ,'account_group','address','mobile_no','optional_mobile','cr_dr_type'];
  var counter = 1;
  var isAdmin = JSON.parse(localStorage.getItem('sessionData'))[0].usertype === 'Admin';
  var isSuperAdmin = JSON.parse(localStorage.getItem('sessionData'))[0].status === 'Super';
  data.forEach(function(item) {
      var row = tbody.insertRow();
      var cell = row.insertCell();
      cell.textContent = counter++;
      columnsToDisplay.forEach(function(key) {
          var cell = row.insertCell();
          cell.textContent = item[key];
      });

      // Add Edit button if user is admin
      if (isSuperAdmin) {
        var editCell = row.insertCell();
        var editButton = document.createElement('button');
        editButton.className = 'button edit-button';
        editButton.style.backgroundColor = '#26a653';
        var editLink = document.createElement('a');
        editLink.href = '../account/updateAccount.html'; // Edit link destination
        editLink.textContent = 'Edit';
        editButton.appendChild(editLink);
        editButton.addEventListener('click', function() {
          editAccount(item); // Pass the user data to the edit function
        });
        editCell.appendChild(editButton);
    }

    // Add Delete button if user is admin
    if (isSuperAdmin) {
        var deleteCell = row.insertCell();
        var deleteButton = document.createElement('button');
        deleteButton.className = 'button delete-button';
        deleteButton.style.backgroundColor = '#ff355f';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
          // SweetAlert2 confirmation dialog
          Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this Account?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Call the deleteUser function only if confirmed
                deleteaccount(item.id); // Pass the user id to the delete function

                // Optional: Show success message
                Swal.fire(
                    'Deleted!',
                    'The Account has been deleted.',
                    'success'
                );
            }
          });
        });
        deleteCell.appendChild(deleteButton);
    }

  });
}

function editAccount(user) {
  localStorage.removeItem('userData');
  console.log('Editing user: ' + JSON.stringify(user));
  localStorage.setItem('userData', JSON.stringify(user));
   // darkgreyirect to user_update.html
   window.location.href = '../account/updateAccount.html';
}


function deleteaccount(userId) {
  // Perform delete operation based on userId
  fetch('http://103.174.102.89:3000/accountData/deleteaccountId/' + userId, {
      method: 'DELETE'
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Account is successfully Deleted',
        })
      console.log('User deleted successfully');
      // Refresh the table or update UI as needed
      account(); // Assuming you want to refresh the table after delete
  })
  .catch(error => {
      console.error('Error:', error);
  });
}


account();


function insertAccount() {
    console.log("INTO insertion Block");
    try {
        // const id = document.querySelector('.id input').value;
        // const date = document.querySelector('.date input').value;
        const name = document.querySelector('.name input').value;
        const address = document.querySelector('.address input').value;
        const mobileNo = parseInt(document.querySelector('.no input').value);
        const accountGroup = document.getElementById('account1').value;
        const routeDetails = document.getElementById('route1').value;
        const prevBalance = parseInt(document.querySelector('.balance input').value);
        const crDrType = document.querySelector('input[name="cr_dr_type"]:checked').id;

        console.log(name,address,mobileNo,accountGroup,routeDetails,prevBalance,crDrType)
        var loader = document.getElementById('loader');
        loader.style.display = 'block';
      
      fetch('http://3.109.121.46/accountData/insertaccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            "is_ative": 1,
            "name": name,
            "address": address,
            "mobile_no": mobileNo, 
            "account_group": accountGroup,
            "route_detail": routeDetails,
            "prev_balance": prevBalance,
            "cr_dr_type": crDrType
          })
      })
      .then(response => {
        if (!response.ok) {
            console.log(response)
          throw new Error('Network response was not ok');
        }
        return response.text(); // Read response as text
      })
      .then(data => {
        loader.style.display = 'none';
     
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Account is inserted',
          })
      }) 
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    } catch (error) {
      console.error('An error occurdarkgrey:', error);
    }
  }

