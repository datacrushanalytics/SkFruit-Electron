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