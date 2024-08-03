document.getElementById('loginForm1').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    fetchDataAndProcess();
});


function fetchDataAndProcess() {
    var sessionData = JSON.parse(localStorage.getItem('sessionData'));
    // Check if session data exists and if the user is an admin
    var isAdmin = sessionData && sessionData[0].usertype === 'Admin';
    var user = "*"
    if(!isAdmin){
        user = sessionData[0].name;
    }

    var data = {
        route : document.getElementById('route').value , 
        date : document.getElementById('fromdate').value,
        added_by : user
    };
    console.log(data);

    var loader = document.getElementById('loader');
        loader.style.display = 'block';
    return fetch('http://13.201.94.88/routeSale/sale', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
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
    .then(result => {
        loader.style.display = 'none';
        console.log(result)
        populateTable4(result)
        return result;
        // Optionally, you can darkgreyirect or show a success message here
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, you can display an error message here
    });
}

function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['name', 'BillCount'];
    var counter = 1;
    console.log(data.reports);
    if (data.reports.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No data found.',
          });
    }
    data.reports.forEach(function (item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function (key) {
            var cell = row.insertCell();
            cell.textContent = item[key];
            // row.style.backgroundColor = "#90EE90";
            
        });
        if (item.BillCount > 0) {
            row.style.backgroundColor = "#90EE90"; // Light darkgrey
        }

        // Add a click event listener to the row
        row.addEventListener('click', function() {
            // Define what should happen when the row is clicked
            // For example, navigate to a new page or display more details
           
            localStorage.removeItem('routeSaleData');
            console.log('Editing receipt: ' + JSON.stringify(item));
            localStorage.setItem('routeSaleData', JSON.stringify(item));
            window.location.href = './routeSale3.html';
        });
    });
}
