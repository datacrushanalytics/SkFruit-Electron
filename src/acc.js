try {
    fetch('http://3.109.121.46/accountData/insertaccount', {
      method: 'POST', // Specify the HTTP method
      body: new FormData(document.querySelector('id','is_ative','name','address','mobile_no','account_group','route_detail','prev_balance','cr_dr_type','created_at','updated_at','current_balance')) // Collect form data
    })
      .then(response => response.text()) // Read response as text
      .then(data => alert(data)); // Alert the response
  } catch (error) {
    alert('An error occurred!');
  }


  
// try {
//     fetch('http://3.109.121.46/accountData', {
//       method: 'POST', // Specify the HTTP method
//       body: new FormData(document.querySelector('id')) // Collect form data
//     })
//       .then(response => response.text()) // Read response as text
//       .then(data => alert(data)); // Alert the response
//   } catch (error) {
//     alert('An error occurred!');
//   }
