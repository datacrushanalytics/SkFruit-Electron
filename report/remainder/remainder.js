let accountInfo = [];

document.getElementById('loginForm1').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    remainder();
});

function getElementValueWithDefault(id, defaultValue) {
    var element = document.getElementById(id);
    return element && element.value ? element.value : defaultValue;
}


async function remainder() {
    console.log("product function executed");
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    try {
        const sessionData = JSON.parse(localStorage.getItem('sessionData'));
        const isAdmin = sessionData && sessionData[0].usertype === 'Admin';

        const url = isAdmin 
            ? 'http://103.174.102.89:3000/remainderReport' 
            : `http://103.174.102.89:3000/remainderReport/${sessionData[0].route}`;
        
        var data1 = {
            customer: getElementValueWithDefault('customer', '*')
        };
        
        const response = await fetch(url,{
            method: 'POST',
            body: JSON.stringify(data1),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        loader.style.display = 'none';

        if (response.status === 404) {
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
    const filtedarkgreyResults = accountInfo.filter(item => {
        return (
            (item.name?.toLowerCase() ?? '').includes(query) ||
            (item.address?.toLowerCase() ?? '').includes(query) ||
            (item.mobile_no?.toString().toLowerCase() ?? '').includes(query)
        );
    });
    populateTable(filtedarkgreyResults);
}

function convertUTCToISTDate(dateString) {
    // Parse the date string
    const date = new Date(dateString);
  
    // Calculate the IST time offset (UTC+5:30)
    const offset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  
    // Adjust for IST
    const istDate = new Date(date.getTime() + offset);
  
    // Extract the date part (year, month, day)
    const year = istDate.getUTCFullYear();
    const month = ('0' + (istDate.getUTCMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + istDate.getUTCDate()).slice(-2);
  
    // Return date in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  }

function populateTable(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var isAdmin = JSON.parse(localStorage.getItem('sessionData'))[0].usertype === 'Admin';
    var columnsToDisplay = ['name', 'address', 'mobile_no', 'last_update', 'current_balance'];
    var counter = 1;
    var totalCurrentBalance = 0;

    if (data.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No data found.',
          });
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
                if (key === 'current_balance') {
                    totalCurrentBalance += parseFloat(item[key]);
                }
            }
        });

        
          

        // if (isAdmin) {
            var editCell = row.insertCell();
            var editButton = document.createElement('button');
            editButton.className = 'button edit-button';
            editButton.style.backgroundColor = '#26a653';
            var editLink = document.createElement('a');
            editLink.href = '../remainder/update_remainder.html'; // Edit link destination
            editLink.textContent = 'Edit';
            editButton.appendChild(editLink);
            editButton.addEventListener('click', function() {
                editUser(item); // Pass the user data to the edit function
            });
            editCell.appendChild(editButton);
        // }

        var buttonCell = row.insertCell();

        // Container for the buttons
        var buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        var openPopupButton = document.createElement('button');
        openPopupButton.className = 'button';
        var billIcon = document.createElement('i');
        billIcon.className = 'fa-sharp fa-regular fa-envelope'; 
        openPopupButton.style.backgroundColor = '#C48B58';  
        openPopupButton.appendChild(billIcon);
        //openPopupButton.textContent = 'Bill';
        openPopupButton.addEventListener('click', async function () {
            
            var loader = document.getElementById('loader');
            loader.style.display = 'block';
            await fetch('http://103.174.102.89:3000/sms/remainderMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        "mobile_no" : item.mobile_no,
                        "name": item.name,
                        "date": convertUTCToISTDate(item.last_update),
                        "remaining": item.current_balance
                })
            })
                .then(response => {
                    console.log("DTAASS")
                    if (!response.ok) {
                        loader.style.display = 'none';
    
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'SMS is failed with some error',
                          });
                        throw new Error('Network response was not ok');
                        
                    }
                    return response.json();
                })
                .then(result => {
                    loader.style.display = 'none';
                    console.log('Entry added successfully:', result);
            
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'SMS Sent Successfully',
                        })
                    //window.location.reload();
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        });
        buttonContainer.appendChild(openPopupButton);
        
        // Second button
        var secondButton = document.createElement('button');
        secondButton.className = 'button';
        secondButton.style.backgroundColor = 'green'; 
        var secondIcon = document.createElement('i');
        secondIcon.className = 'fa-brands fa-whatsapp';
        secondButton.appendChild(secondIcon);
        //secondButton.textContent = 'Second Button'; // Change the text as needed
        secondButton.addEventListener('click', async function () {

            var loader = document.getElementById('loader');
            loader.style.display = 'block';
            await fetch('http://103.174.102.89:3000/whatsapp/remainderMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "campaignName" : "SK_fruits_remainder",
                    "mobile_no" : item.mobile_no,
                    "userName" : item.name,
                    "remainderDate" : convertUTCToISTDate(item.last_update),
                    "remaining" : item.current_balance
                })
            })
                .then(response => {
                    console.log("DTAASS")
                    if (!response.ok) {
                        loader.style.display = 'none';
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Whatsapp message is failed with some error',
                          });
             
                        throw new Error('Network response was not ok');
                        
                    }
                    return response.json();
                })
                .then(result => {
                    loader.style.display = 'none';
                    console.log('Entry added successfully:', result);
                 
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Whatsapp message Sent Successfully',
                        })
                    //window.location.reload();
                })
                .catch(error => {
                    console.error('Error:', error);
                });


        });
        buttonContainer.appendChild(secondButton);

        // Append the button container to the cell
        buttonCell.appendChild(buttonContainer);


    });

    // Add a row for the grand total
    var totalRow = tbody.insertRow();

    // Create empty cells before the 'Grand Total' label and the total amount cell
    for (let i = 0; i < columnsToDisplay.length - 1; i++) {
        var emptyCell = totalRow.insertCell();
        emptyCell.textContent = '';
    }

    // Add the 'Grand Total' label
    var grandTotalLabelCell = totalRow.insertCell();
    grandTotalLabelCell.textContent = 'Grand Total';
    grandTotalLabelCell.style.fontWeight = 'bold';
    grandTotalLabelCell.style.textAlign = 'right';

    // Add the total amount cell
    var totalCell = totalRow.insertCell();
    totalCell.textContent = totalCurrentBalance.toFixed(2); // Assuming you want 2 decimal places
    totalCell.style.fontWeight = 'bold';
    totalCell.style.textAlign = 'right';

    // Add an empty cell after the total amount if there are admin columns
    if (isAdmin) {
        var adminCell = totalRow.insertCell();
        adminCell.textContent = '';
    }

    var buttonCell = totalRow.insertCell();

        // Container for the buttons
        var buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        var openPopupButton = document.createElement('button');
        openPopupButton.className = 'button';
        var billIcon = document.createElement('i');
        billIcon.className = 'fa-sharp fa-regular fa-envelope'; 
        openPopupButton.style.backgroundColor = '#C48B58';  
        openPopupButton.appendChild(billIcon);
        //openPopupButton.textContent = 'Bill';
        openPopupButton.addEventListener('click', async function () {
            await sendMessagesToAll('sms');
        });
        buttonContainer.appendChild(openPopupButton);
        
        // Second button
        var secondButton = document.createElement('button');
        secondButton.className = 'button';
        secondButton.style.backgroundColor = 'green'; 
        var secondIcon = document.createElement('i');
        secondIcon.className = 'fa-brands fa-whatsapp';
        secondButton.appendChild(secondIcon);
        //secondButton.textContent = 'Second Button'; // Change the text as needed
        secondButton.addEventListener('click', async function () {
            await sendMessagesToAll('whatsapp');
        });
        buttonContainer.appendChild(secondButton);

        // Append the button container to the cell
        buttonCell.appendChild(buttonContainer);

}

function editUser(user) {
    console.log("Editing user data");
    localStorage.setItem('remainderData', JSON.stringify(user));
    // darkgreyirect to user_update.html
    window.location.href = '../remainder/update_remainder.html';
}

async function sendMessagesToAll(type) {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
    console.log("accountInfo", accountInfo)

    try {
        // Loop through all users in accountInfo
        for (const item of accountInfo) {
            const payload = type === 'sms' 
                ? {
                    "mobile_no": item.mobile_no,
                    "name": item.name,
                    "date": convertUTCToISTDate(item.last_update),
                    "remaining": item.current_balance
                }
                : {
                    "campaignName": "SK_fruits_remainder",
                    "mobile_no": item.mobile_no,
                    "userName": item.name,
                    "remainderDate": convertUTCToISTDate(item.last_update),
                    "remaining": item.current_balance
                };

            const endpoint = type === 'sms' 
                ? 'http://103.174.102.89:3000/sms/remainderMessage' 
                : 'http://103.174.102.89:3000/whatsapp/remainderMessage';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            console.log("response",response)
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Failed to send ${type} for ${item.name}:`, errorText);
                continue;
            }
        }

        Swal.fire({
            icon: 'success',
            title: `Success!`,
            text: `${type === 'sms' ? 'SMS' : 'WhatsApp'} messages sent successfully to all users.`,
        });

    } catch (error) {
        console.error('Error sending messages:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Failed to send ${type === 'sms' ? 'SMS' : 'WhatsApp'} messages.`,
        });
    } finally {
        loader.style.display = 'none';
    }
}


remainder();



async function exportToExcel() {
    try {
        const data1 = await remainder(); // Wait for remainder to fetch data

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        return fetch('http://103.174.102.89:3000/remainderReport/generate-pdf', {
            method: 'POST',
            body: JSON.stringify(data1),
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
            return response.blob(); // Get the response as a Blob
        })
        .then(blob => {
            loader.style.display = 'none';

            // Create a URL for the Blob and trigger a download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'Reminder_Report.pdf'; // Set the desidarkgrey file name
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url); // Release the URL

            console.log('PDF downloaded successfully');
        })
        .catch(error => {
            loader.style.display = 'none';
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error generating PDF. Please try again.',
              });
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error generating PDF. Please try again.',
          });
    }
}
