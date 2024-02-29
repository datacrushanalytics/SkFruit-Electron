function account() {
    console.log("account function executed");

    fetch('http://3.109.121.46/accountData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
  



a