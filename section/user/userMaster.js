

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    var formData = new FormData(document.getElementById('loginForm'));
    var data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    console.log(data);

    fetch('http://13.201.94.88/userData/insertUser', {
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
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'User is successfully Added',
            })
        window.location.href = './user.html';
        // Optionally, you can darkgreyirect or show a success message here
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, you can display an error message here
    });
});
