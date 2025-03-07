async function updateUser() {
    try {
        var loader = document.getElementById('loader');
        loader.style.display = 'block';
        var status = document.getElementById("isActive").checked ? '1' : '0';
        var userData = {
            name: document.getElementById("name").value,
            route: document.getElementById("route").value,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            usertype: document.getElementById("usertype").value,
            status: status
        };

        const response = await fetch('http://103.174.102.89:3000/userData/updateUser/'+ parseInt(document.getElementById("id").value), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        loader.style.display = 'none';
        console.log('Data added successfully:', result);
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Data Updated successfully',
            })
        // Optionally, you can darkgreyirect or show a success message here
    } catch (error) {
        console.error('Error:', error);
        // Optionally, you can display an error message here
    }

    // Perform the update operation (e.g., send data to server)
    console.log("Update user:", userData);
    window.location.href = './user.html';
}

// Add event listener to the "Update" button
document.getElementById("updateButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission
    updateUser(); // Call the updateUser function to handle the update operation
});









      