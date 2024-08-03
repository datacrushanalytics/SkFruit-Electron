
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    var formData = new FormData(document.getElementById('loginForm'));
    var data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    console.log(data);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    fetch('http://13.201.94.88/accountData/insertaccount', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        form2 = {
            userName : document.getElementById("name").value,
            carate_100 : parseInt(document.getElementById("carate2100").value) || 0,
            carate_150 : parseInt(document.getElementById("carate2150").value) || 0,
            carate_250 : parseInt(document.getElementById("carate2250").value) || 0,
            carate_350 : parseInt(document.getElementById("carate2350").value) || 0
        }
        console.log(form2)
        const response1 =  fetch('http://13.201.94.88/carateuserData/insertcarateuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form2)
        });
       
        return response.json();
        
    })
    .then(result => {
        loader.style.display = 'none';
        console.log('Data added successfully:', result);
    
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Account is successfully Added',
            })
        window.location.href = './account.html';
        // Optionally, you can darkgreyirect or show a success message here
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, you can display an error message here
    });
});
