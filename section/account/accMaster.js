
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

    fetch('http://localhost:3000/accountData/insertaccount', {
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
        return response.json();
    })
    .then(result => {
        loader.style.display = 'none';
        console.log('Data added successfully:', result);
        alert("Account is successfully Added");
        window.location.href = './account.html';
        // Optionally, you can redirect or show a success message here
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, you can display an error message here
    });
});
