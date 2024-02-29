function account() {
    console.log("login function executed");

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

try {
    fetch('http://3.109.121.46/accountData/insertaccount', {
      method: 'POST', // Specify the HTTP method
      body: new FormData(document.querySelector('id','is_ative','name','address','mobile_no','account_group','route_detail','prev_balance','cr_dr_type','created_at','updated_at','current_balance')) // Collect form data
    })
}
