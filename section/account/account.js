function account() {
  console.log("user function executed");

  fetch('http://43.205.230.120/accountData')
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
  var columnsToDisplay = ['name', 'account_group','address','mobile_no'];
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
       editLink.href = '../account/updateAccount.html'; // Edit link destination
       editLink.textContent = 'Edit';
       editButton.appendChild(editLink);

      editButton.addEventListener('click', function() {
        editAccount(item); // Pass the user data to the edit function
      });
      editCell.appendChild(editButton);

       // Add Delete button
       var deleteCell = row.insertCell();
       var deleteButton = document.createElement('button');
       deleteButton.className = 'button delete-button';
       deleteButton.textContent = 'Delete';
       deleteButton.addEventListener('click', function() {
          deleteaccount(item.id); // Pass the user id to the delete function
      });
      deleteCell.appendChild(deleteButton);
  });
}

function editAccount(user) {
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
   window.location.href = '../account/updateAccount.html';
}


function deleteaccount(userId) {
  // Perform delete operation based on userId
  fetch('http://43.205.230.120/accountData/deleteaccountId/' + userId, {
      method: 'DELETE'
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
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
        // const formData = new FormData();
        // formData.append("is_ative", 1);
        // formData.append("name", name);
        // formData.append("address", address);
        // formData.append("mobile_no", mobileNo);
        // formData.append("account_group", accountGroup);
        // formData.append("route_detail", routeDetails);
        // formData.append("prev_balance", prevBalance);
        // formData.append("cr_dr_type", crDrType);
      
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
      .then(data => alert(data)) // Alert the response
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  




// function insertAccount() {
//     console.log("INTO insertion Block");
//     try {
//       fetch('http://3.109.121.46/accountData/insertaccount', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json' 
//         },
//         body: JSON.stringify({
//           "is_ative": 1,
//           "name": document.getElementById("name"),
//           "address": "hah",
//           "mobile_no": 9852,
//           "account_group": "fsdf",
//           "route_detail": "trs",
//           "prev_balance": 123,
//           "cr_dr_type": "cr"
//         })
//       })
//       .then(response => {
//         if (!response.ok) {
//             console.log(response)
//           throw new Error('Network response was not ok');
//         }
//         return response.text(); // Read response as text
//       })
//       .then(data => alert(data)) // Alert the response
//       .catch(error => {
//         console.error('There was a problem with the fetch operation:', error);
//       });
//     } catch (error) {
//       console.error('An error occurred:', error);
//     }
//   }

