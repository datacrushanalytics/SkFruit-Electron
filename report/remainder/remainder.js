let accountInfo = [];

async function remainder() {
    console.log("product function executed");
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    try {
        const response = await fetch('http://65.2.144.249/remainderReport');
        loader.style.display = 'none';

        if (response.status === 404) {
            alert("No data found.");
            throw new Error('Data not found');
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        accountInfo = data.reports;
        populateTable(accountInfo);
        return data; // Return the data
    } catch (error) {
        loader.style.display = 'none';
        console.error('Error:', error);
        throw error; // Rethrow the error for further handling
    }
}

async function searchData() {
    console.log("Searching execute noticed");
    const query = document.getElementById('searchBox').value.toLowerCase();
    console.table(accountInfo);
    const filteredResults = accountInfo.filter(item => {
        return (
            (item.name?.toLowerCase() ?? '').includes(query) ||
            (item.address?.toLowerCase() ?? '').includes(query) ||
            (item.mobile_no?.toString().toLowerCase() ?? '').includes(query)
        );
    });
    populateTable(filteredResults);
}

function populateTable(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var isAdmin = JSON.parse(localStorage.getItem('sessionData'))[0].usertype === 'Admin';
    var columnsToDisplay = ['name', 'address', 'mobile_no', 'last_update', 'current_balance'];
    var counter = 1;
    if (data.length === 0) {
        alert("No Data Found");
    }
    data.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            if (key === 'last_update') {
                if (item[key] === null || item[key] === undefined) {
                    cell.textContent = 'null';
                } else {
                    var utcDate = new Date(item[key]);
                    var options = {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        timeZone: 'Asia/Kolkata'
                    };
                    cell.textContent = utcDate.toLocaleString('en-IN', options);
                }
            } else {
                cell.textContent = item[key];
            }
        });

        if (isAdmin) {
            var editCell = row.insertCell();
            var editButton = document.createElement('button');
            editButton.className = 'button edit-button';
            var editLink = document.createElement('a');
            editLink.href = '../remainder/update_remainder.html'; // Edit link destination
            editLink.textContent = 'Edit';
            editButton.appendChild(editLink);
            editButton.addEventListener('click', function() {
                editUser(item); // Pass the user data to the edit function
            });
            editCell.appendChild(editButton);
        }
    });
}

function editUser(user) {
    console.log("jhsgjhwdgjhgjh");
    localStorage.setItem('remainderData', JSON.stringify(user));
    window.location.href = '../remainder/update_remainder.html';
}

remainder();

async function exportToExcel() {
    try {
        await remainder(); // Wait for remainder to fetch data
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        // Define custom headers
        const customHeaders = ['name', 'address', 'mobile_no', 'last_update', 'current_balance'];
        
        // Add header details
        doc.setFontSize(10);
        doc.text('Mobile:- 9960607512', 10, 10);
        doc.addImage('../../assets/img/logo.png', 'PNG', 10, 15, 30, 30); // Adjust the position and size as needed
        doc.setFontSize(16);
        doc.text('Savata Fruits Suppliers', 50, 10);
        doc.setFontSize(12);
        doc.text('At post Kasthi Tal: Shreegonda, District Ahamadnagar - 414701', 50, 20);
        doc.text('Mobile NO:- 9860601102 / 9175129393/ 9922676380 / 9156409970', 50, 30);

        // Adjust startY to leave space for header
        let startY = 50;

        // Map data for autoTable
        const reportsData = accountInfo.map(report => [
            report.name,
            report.address,
            report.mobile_no,
            new Date(report.last_update).toLocaleString('en-IN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'Asia/Kolkata'
            }),
            report.current_balance
        ]);
        
        // Calculate grand total for current_balance
        const grandTotal = accountInfo.reduce((total, report) => total + parseFloat(report.current_balance), 0);

        // Add grand total row
        const grandTotalRow = ['Grand Total', '', '', '', grandTotal];
        reportsData.push(grandTotalRow);
        
        // Add table to PDF
        doc.autoTable({
            head: [customHeaders],
            body: reportsData,
            startY: 50, // Adjusted to ensure header is shown
            theme: 'grid',
        });

        // Save the PDF
        doc.save('Reminder_Report.pdf');
    } catch (error) {
        console.error('Error exporting data:', error);
    }
}
