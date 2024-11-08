function getElementValueWithDefault(id, defaultValue) {
    var element = document.getElementById(id);
    return element && element.value ? element.value : defaultValue;
}
function formatDate(dateString) {
    var date = new Date(dateString);
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
}


document.getElementById('loginForm1').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    fetchDataAndProcess();
});


function fetchDataAndProcess(data = null) {
    if(!data){
        var data = {
            from_date: formatDate(document.getElementById("fromdate").value),
            to_date: formatDate(document.getElementById("todate").value),
            added_by : getElementValueWithDefault('user', '*'),
            route: getElementValueWithDefault('route', '*')
        };
    }
    
    var loader = document.getElementById('loader');
    loader.style.display = 'block';
    return fetch('http://103.174.102.89:3000/dailyReport', {
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
        console.log(result);
        populateTable4(result);
        populateTable5(result);
        return result;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['added_by','bill_no', 'date', 'cust_name', 'route','amount', 'cash', 'online_amt', 'discount', 'inCarat', 'carate_amount','balance','validate'];
    var counter = 1;
    if (data.reports.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No data found.',
          });       
    }
    var grandTotals = {
        amount: 0,
        cash: 0,
        online_amt: 0,
        discount: 0,
        inCarat: 0,
        carate_amount: 0
    };
    data.reports.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            if (key === 'date') {
                var utcDate = new Date(item[key]);
                var options = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    timeZone: 'Asia/Kolkata'
                };
                cell.textContent = utcDate.toLocaleString('en-IN', options);
            } else if(key === 'validate') {
                if(item[key]=='Pending'){
                    //let buttonContainer = document.getElementById('buttonContainer');

                    var buttonContainer = document.createElement('div');
                    buttonContainer.className = 'button-container';


                    let button = document.createElement('button');
                    button.textContent = "Edit";
                    button.className = 'button';
                    button.style.backgroundColor = 'green';
                    button.onclick = function() {
                        localStorage.removeItem('saleData');
                        console.log('Editing Sale: ' + JSON.stringify(item));
                        localStorage.setItem('saleData', JSON.stringify(item));
                        window.location.href = './validateSale.html';
                    };

                    buttonContainer.appendChild(button);
                    //cell.appendChild(button);


                    // Create the second button
                    let button2 = document.createElement('button');
                    button2.textContent = "Verify"; // Change this to the desidarkgrey button text
                    button2.className = 'button';
                    button2.onclick = async function() {
                        // Add the functionality for the second button here
                        console.log('Another action for receipt: ' + JSON.stringify(item));
                        // You can add more actions or navigation here

                        var loader = document.getElementById('loader');
            loader.style.display = 'block';
            await fetch('http://103.174.102.89:3000/saleData/validate/'+ String(item.bill_no), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log("DTAASS")
                    if (!response.ok) {
                        loader.style.display = 'none';
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: "Sale Bill is not Verified",
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
                        text: 'Sale Bill is Verified Successfully',
                        })
            
                    fetchDataAndProcess();
                    // window.location.reload();
                })
                .catch(error => {
                    console.error('Error:', error);
                });

                    };

                    buttonContainer.appendChild(button2);
                    cell.appendChild(buttonContainer);


                }else {
                    cell.textContent = item[key];
                    row.style.backgroundColor = "#90EE90";
                }
            } else {
                cell.textContent = item[key];
                if (['amount', 'cash', 'online_amt', 'discount', 'inCarat', 'carate_amount'].includes(key)) {
                    grandTotals[key] += parseFloat(item[key]) || 0;
                }
            }
        });


        // Add button to open popup
        var buttonCell = row.insertCell();
        var openPopupButton = document.createElement('button');
        openPopupButton.className = 'button';
        openPopupButton.style.backgroundColor = 'green';
        openPopupButton.textContent = 'View';
        openPopupButton.addEventListener('click', function () {
            // console.log(item.summary.split('(')[0])
            openModal(item.bill_no); // Pass the data item to the openPopup function for Sale
            //openModal(item); // Pass the data item to the openPopup function
        });
        buttonCell.appendChild(openPopupButton);


        var buttonCell = row.insertCell();
        // Container for the buttons
        var buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        var openPopupButton = document.createElement('button');
        openPopupButton.className = 'button';
        openPopupButton.style.backgroundColor = '#C48B58';
        var billIcon = document.createElement('i');
        billIcon.className = 'fa-sharp fa-regular fa-envelope'; 
        openPopupButton.appendChild(billIcon);
        //openPopupButton.textContent = 'Bill';
        openPopupButton.addEventListener('click', async function () {
            
            var loader = document.getElementById('loader');
            loader.style.display = 'block';
            await fetch('http://103.174.102.89:3000/sms/saleMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        "mobile_no" : item.mobile_no,
                        "orderValue": item.amount,
                        "paid": item.cash + item.online_amt,
                        "remaining": item.balance
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
            await fetch('http://103.174.102.89:3000/whatsapp/saleMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "campaignName" : "SK_fruit_2",
                    "mobile_no" : item.mobile_no,
                    "userName" : item.cust_name,
                    "orderValue" : item.amount,
                    "paid" : item.cash + item.online_amt,
                    "remaining" : item.balance
                
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
                    // fetchDataAndProcess();
                })
                .catch(error => {
                    console.error('Error:', error);
                });


        });
        buttonContainer.appendChild(secondButton);

        // Append the button container to the cell
        buttonCell.appendChild(buttonContainer);



    });
    // Add row for grand total
    var totalRow = tbody.insertRow();
    totalRow.insertCell(); // Add empty cell for counter column
    totalRow.insertCell(); // Add empty cell for date column
    totalRow.insertCell(); // Add empty cell for customer name column
    totalRow.insertCell(); // Add empty cell for route column
    var grandTotalLabelCell = totalRow.insertCell();
    grandTotalLabelCell.textContent = 'Grand Total';
    grandTotalLabelCell.style.fontWeight = 'bold'; // Make "Grand Total" label bold

    columnsToDisplay.slice(4).forEach(function(key) {
        var totalCell = totalRow.insertCell();
        totalCell.textContent = grandTotals[key] || '';
        totalCell.style.fontWeight = 'bold'; // Make grand total values bold
    });
}

function populateTable5(data) {
    var tbody = document.getElementById('tableBody1');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['receipt_id', 'date', 'Customer', 'mobile_no','cash', 'online', 'discount', 'inCarat', 'Amt','added_by','note','previous_balance','validate'];
    var counter = 1;
    if (data.Receipt.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No data found.',
          });
    }
    var grandTotals = {
        cash: 0,
        online: 0,
        discount: 0,
        inCarat: 0,
        Amt: 0
    };
    data.Receipt.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            if (key === 'date') {
                var utcDate = new Date(item[key]);
                var options = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    timeZone: 'Asia/Kolkata'
                };
                cell.textContent = utcDate.toLocaleString('en-IN', options);
            } else if(key === 'validate') {
                if(item[key]=='Pending'){
                    //let buttonContainer = document.getElementById('buttonContainer');


                    var buttonContainer = document.createElement('div');
                    buttonContainer.className = 'button-container';

                    let button1 = document.createElement('button');
                    button1.textContent = "Edit";
                    button1.style.backgroundColor = 'green';
                    button1.className = 'button';
                    button1.onclick = function() {
                        localStorage.removeItem('receiptData');
                        console.log('Editing receipt: ' + JSON.stringify(item));
                        localStorage.setItem('receiptData', JSON.stringify(item));
                        window.location.href = './validateReceipt.html';
                    };

                    buttonContainer.appendChild(button1);
                    // cell.appendChild(button1);

                    // Create the second button
                    let button2 = document.createElement('button');
                    button2.textContent = "Verify"; // Change this to the desidarkgrey button text
                    button2.className = 'button';
                    button2.onclick = async function() {
                        // Add the functionality for the second button here
                        console.log('Another action for receipt: ' + JSON.stringify(item));
                        // You can add more actions or navigation here

                        var loader = document.getElementById('loader');
            loader.style.display = 'block';
            await fetch('http://103.174.102.89:3000/receiptData/validate/'+ String(item.receipt_id), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log("DTAASS")
                    if (!response.ok) {
                        loader.style.display = 'none';
            

 Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Receipt is not Verified',
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
                        text: 'Receipt is Verified Successfully',
                        })
                    fetchDataAndProcess();
                    
                })
                .catch(error => {
                    console.error('Error:', error);
                });

                    };

                    buttonContainer.appendChild(button2);

                    cell.appendChild(buttonContainer);
                    
                }else {
                    cell.textContent = item[key];
                    row.style.backgroundColor = "#90EE90";
                }
            } else {
                cell.textContent = item[key];
                if (['cash', 'online', 'discount', 'inCarat', 'Amt'].includes(key)) {
                    grandTotals[key] += parseFloat(item[key]) || 0;
                }
            }
        });


        // Add button to open popup
        var buttonCell = row.insertCell();
        var openPopupButton = document.createElement('button');
        openPopupButton.className = 'button';
        openPopupButton.style.backgroundColor = 'green';
        openPopupButton.textContent = 'View';
        openPopupButton.addEventListener('click', function () {
            // console.log(item.summary.split('(')[0])
            openModal1(item); // Pass the data item to the openPopup function for Sale
            //openModal(item); // Pass the data item to the openPopup function
        });
        buttonCell.appendChild(openPopupButton);


        var buttonCell = row.insertCell();

        // Container for the buttons
        var buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        var openPopupButton = document.createElement('button');
        openPopupButton.className = 'button';
        openPopupButton.style.backgroundColor = '#C48B58';
        var billIcon = document.createElement('i');
        billIcon.className = 'fa-sharp fa-regular fa-envelope'; 
        openPopupButton.appendChild(billIcon);
        //openPopupButton.textContent = 'Bill';
        openPopupButton.addEventListener('click', async function () {
            
            var loader = document.getElementById('loader');
            loader.style.display = 'block';
            await fetch('http://103.174.102.89:3000/sms/receiptMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "mobile_no" : item.mobile_no,
                    "cash": item.cash,
                    "online": item.online,
                    "remaining": item.remaining
                })
            })
                .then(response => {
                    console.log("DTAASS")
                    if (!response.ok) {
                        loader.style.display = 'none';
                    

 Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: "SMS is failed with some error",
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
            await fetch('http://103.174.102.89:3000/whatsapp/receiptMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "campaignName" : "SK_fruits_Reciept",
                    "mobile_no" : item.mobile_no,
                    "userName" : item.Customer,
                    "paid" : parseInt(item.cash) + parseInt(item.online),
                    "remaining" : item.remaining
                })
            })
                .then(response => {
                    console.log("DTAASS")
                    if (!response.ok) {
                        loader.style.display = 'none';
                    
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: "Whatsapp message is failed with some error",
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
    // Add row for grand total
    var totalRow = tbody.insertRow();
    totalRow.insertCell(); // Add empty cell for counter column
    totalRow.insertCell(); // Add empty cell for date column
    totalRow.insertCell(); // Add empty cell for customer column
    totalRow.insertCell(); // Add empty cell for mobile number column
    totalRow.insertCell(); // Add empty cell for note column
    var grandTotalLabelCell = totalRow.insertCell();
    grandTotalLabelCell.textContent = 'Grand Total';
    grandTotalLabelCell.style.fontWeight = 'bold'; // Make "Grand Total" label bold

    columnsToDisplay.slice(5).forEach(function(key) {
        var totalCell = totalRow.insertCell();
        switch (key) {
            case 'Amt':
                totalCell.textContent = data.GrandReceipt['receiptAmt'];
                break;
            case 'online':
                totalCell.textContent = data.GrandReceipt['receiptOnline'];
                break;
            case 'cash':
                totalCell.textContent = data.GrandReceipt['receiptCash'];
                break;
            case 'discount':
                totalCell.textContent = data.GrandReceipt['receiptDiscount'];
                break;
            case 'inCarat':
                totalCell.textContent = data.GrandReceipt['receiptInCarat'];
                break;
            default:
                totalCell.textContent = '';
        }
        totalCell.style.fontWeight = 'bold'; // Make grand total values bold
    });



    document.getElementById('sale').textContent = data.GrandSale['saleAmount'] || 0;
    document.getElementById('saleCash').textContent =data.GrandSale['saleCash'] || 0;
    document.getElementById('receiptCash').textContent = data.GrandReceipt['receiptCash'] || 0;
    document.getElementById('receiptOnline').textContent = data.GrandReceipt['receiptOnline'] || 0;
    document.getElementById('saleOnline').textContent = data.GrandSale['saleOnline'] || 0;
    document.getElementById('saleDiscount').textContent = data.GrandSale['saleDiscount'] || 0;
    document.getElementById('receiptDiscount').textContent = data.GrandReceipt['receiptDiscount'] || 0;
    document.getElementById('grandSale').textContent = data.GrandSale['saleAmount'] || 0;
    document.getElementById('grandCash').textContent = data.GrandSale['saleCash'] + data.GrandReceipt['receiptCash'];
    document.getElementById('grandOnline').textContent = data.GrandReceipt['receiptOnline'] + data.GrandSale['saleOnline'];
    document.getElementById('grandDiscount').textContent = data.GrandReceipt['receiptDiscount'] + data.GrandSale['saleDiscount'];
    document.getElementById('grandTotal').textContent = data.GrandSale['saleCash'] + data.GrandReceipt['receiptCash'] + data.GrandReceipt['receiptOnline'] + data.GrandSale['saleOnline'];

}

async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        return fetch('http://103.174.102.89:3000/dailyReport/generate-pdf', {
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
            return response.blob(); // Get the response as a Blob
        })
        .then(blob => {
            loader.style.display = 'none';

            // Create a URL for the Blob and trigger a download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'dailyReport.pdf'; // Set the desidarkgrey file name
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




function openModal(item) {
    // Your code to open the modal with the data from 'item'
    console.log("Opening modal for item:", item);
    

    fetch('http://103.174.102.89:3000/bill/' + item)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            console.log(data)

            var utcDate = new Date(data.results[0].date);
            var options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'Asia/Kolkata'
            };


            var tableBody = document.getElementById("TableBody");
            tableBody.innerHTML = ""; // Clear existing rows

            var billDetails = [
                { label: "बिल क्र.:", value: item },
                { label: "तारीख:", value: utcDate.toLocaleString('en-IN', options) },
                { label: "ग्राहकाचे नाव:", value: data.results[0].cust_name },
                { label: "संपर्क क्र.:", value: data.results[0].mobile_no },
                { label: "पत्ता:", value: data.results[0].address },
                // Add other bill details similarly
            ];

            billDetails.forEach(function (detail) {
                var row = document.createElement("tr");
                row.innerHTML = `
                        <td><b>${detail.label}</b></td>
                        <td>${detail.value}</td>
                    `;
                tableBody.appendChild(row);
            });


            var tablefooter = document.getElementById("tablefooter");
            tablefooter.innerHTML = ""; // Clear existing rows

            const label = 
                "बाकी कॅरेट : " +
                (data.results[0].carate_100 > 0 ? "100 X " + data.results[0].carate_100 + " " : "") +
                (data.results[0].carate_150 > 0 ? "150 X " + data.results[0].carate_150 + " " : "") +
                (data.results[0].carate_250 > 0 ? "250 X " + data.results[0].carate_250 + " " : "") +
                (data.results[0].carate_350 > 0 ? "350 X " + data.results[0].carate_350 : "");

            const label1 = 
                "गेलेले कॅरेट : " +
                (data.results[0].in_carate_100 > 0 ? "100 X " + data.results[0].in_carate_100 + " " : "") +
                (data.results[0].in_carate_150 > 0 ? "150 X " + data.results[0].in_carate_150 + " " : "") +
                (data.results[0].in_carate_250 > 0 ? "250 X " + data.results[0].in_carate_250 + " " : "") +
                (data.results[0].in_carate_350 > 0 ? "350 X " + data.results[0].in_carate_350 : "");

            const label2 = 
                "जमा कॅरेट : " +
                (data.results[0].out_carate_100 > 0 ? "100 X " + data.results[0].out_carate_100 + " " : "") +
                (data.results[0].out_carate_150 > 0 ? "150 X " + data.results[0].out_carate_150 + " " : "") +
                (data.results[0].out_carate_250 > 0 ? "250 X " + data.results[0].out_carate_250 + " " : "") +
                (data.results[0].out_carate_350 > 0 ? "350 X " + data.results[0].out_carate_350 : "");

            var showLabels  = true
            if (data.results[0].cr_dr_type == 'no') { showLabels = false }

            var footerDetails = [
                // { label: "गेलेले कॅरेट : 100 X  " + data.results[0].in_carate_100 + "  150 X  " + data.results[0].in_carate_150 + "  250 X  " + data.results[0].in_carate_250 + "  350 X  " +  data.results[0].in_carate_350, value: data.results[0].carate_amount },
                { label: label1.trim(), value: data.results[0].carate_amount,visible: showLabels  },
                { label: "चालू कलम रक्कम:", value: data.results[0].amount, visible: true },
                { label: "मागील बाकी:", value: data.results[0].pre_balance, visible: true },
                { label: "एकूण रक्कम:", value: data.results[0].total_amount, visible: true },
                { label: "रोख जमा रक्कम:", value: data.results[0].cash, visible: true },
                { label: "ऑनलाईन जमा बँक :", value: data.results[0].online_acc, visible: true },
                { label: "ऑनलाईन जमा रक्कम:", value: data.results[0].online_amt, visible: true },
                { label: "सूट रक्कम:", value: data.results[0].discount, visible: true },
                // { label: "जमा कॅरेट: 100 X  " + data.results[0].out_carate_100 + "  150 X  " + data.results[0].out_carate_150 + "  250 X  " + data.results[0].out_carate_250 + "  350 X  " +  data.results[0].out_carate_350, value: data.results[0].inCarat },
                { label: label2.trim(), value: data.results[0].inCarat ,visible: showLabels },
                { label: "आत्ता पर्यंतचे येणे बाकी:", value: data.results[0].balance , visible: true},
                //{ label: "बाकी कॅरेट : 100 X  " + data.results[0].carate_100 + "  150 X  " + data.results[0].carate_150 + "  250 X  " + data.results[0].carate_250 + "  350 X  " +  data.results[0].carate_350, value: ''} 
                { label: label.trim(), value: '',visible: showLabels } 
                // Add other bill details similarly
            ];

            footerDetails.forEach(function (detail) {
                if (detail.visible) {
                var row = document.createElement("tr");
                row.innerHTML = `
                    <td align="right" colspan="6"><font color="black">${detail.label}</font></td>
                    <td align="right" colspan="1"><font color="black">${detail.value}</font></td>
                    `;
                tablefooter.appendChild(row);
                }
            });

            // Populate table with fetched data
            var itemsTableBody = document.getElementById("itemsTableBody");
            itemsTableBody.innerHTML = ""; // Clear existing rows
            var columnsToDisplay = ['bata', 'product', 'quantity', 'rate', 'price'];
            var counter = 1;
            data.products.forEach(function (item) {
                var row = itemsTableBody.insertRow();
                var cell = row.insertCell();
                cell.textContent = counter++;
                columnsToDisplay.forEach(function (key) {
                    var cell = row.insertCell();

                    cell.textContent = item[key];
                });
            });


        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Create a modal element
    var modal = document.createElement('div');
    modal.className = 'modal';

    // Create modal content
    var modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    // Add close button
    var closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function () {
        modalContent.innerHTML = '';
        modal.style.display = 'none'; // Close the modal when close button is clicked
    };
    modalContent.appendChild(closeButton);
   

    // Add item data to modal content
    var itemData = document.createElement('div');
    itemData.innerHTML = `
    <style>   
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
    }
    
    .box-container {
        background-color: #fff;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    h6{
        top: -17px;
       position: absolute;
       font-size: 12px;
    }
    
    .label {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 31px;
        position: relative;
        top: 17px;
        right: -47px;

    }
    
    .row {
        display: flex;
        flex-wrap: wrap;
    }
    
    .carate-box {
        background-color: #e9e9e9;
        padding: 4px;
        margin: 7px;
        position: relative;
        top: 10px;
        max-width: 66px;
        max-height: 24px;
        left: -23px;
        border: 1px solid #ccc;
        border-radius: 5px;
        flex: 1 1 calc(25% - 20px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box; /* Ensures padding and border are included in the width calculation */
    }
    
    
    .carate {
        font-weight: bold;
    }
    
    .data {
        margin-left: 10px;
        color: #333;
    }
         
    .header {
        background-color: #f9f9f9;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .header .logo {
        width: auto; /* Adjust as needed */
        margin-right: 20px; /* Adjust as needed */
    }
    .header .logo img {
        height: 80px; /* Adjust as needed */
    }
    .header .details {
        width: 80%; /* Adjust as needed */
        text-align: right;
    }
    .header h1, .header p {
        margin: 5px 0;
        font-size: 16px;
    }


    .container2 {
        max-width: 600px;
        margin: 0 auto;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 12px; /* Adjust font size */
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
    }
    th, td {
        border: 1px solid #ccc;
        padding: 6px; /* Adjust padding */
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }
    .total {
        font-weight: bold;
    }
    .details {
        text-align: center;
        margin-top: 10px;
    }

    /* CSS styles for the print button */
.header-details button {
padding: 10px 20px;
background-color: #808080;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
transition: background-color 0.3s;
}


@media print {
.details, .header-details, .close{
    display: none; /* Hide the print button and header details when printing */
}
}
.container3 {
max-width: 800px;
margin: 0 auto;
padding: 20px;
text-align: center;
}
.box-container {
display: flex;
justify-content: space-around;
margin: 16px
}
.carate {
font-size: 16px;
color: #333;
}
.data {
font-size: 14px;
color: #666;
}
    </style>
    <div class="header">
   <div> <h6> Mobile:- 9960607512  </h6> </div>
    <div class="logo">
        <img src="../../assets/img/logo.png" alt="Company Logo">
    </div>
    <div >
      <center><h1>सावता फ्रुट सप्लायर्स</h1> 
        <p>ममु.पोस्ट- काष्टी ता.- श्रीगोंदा, जि. अहमदनगर - 414701</p>
        <p>मोबाईल नं:- 9860601102  / 9922676380 / 9156409970</p>
    </div> </center>
</div>
<div class="container2">

    <!-- Bill details -->
    <table>
        <tbody id = 'TableBody'>
        </tbody>
    </table>
    <br><br>
    <!-- Items table -->
    <table>
        <thead>
            <tr>
                <th>अनु क्र.</th>
                <th>बटा</th>
                <th>Product</th>
                <th>नग</th>
                <th>किंमत</th>
                <th>रक्कम</th>
            </tr>
        </thead>
        <tbody id= 'itemsTableBody'>
        </tbody>
        <tfoot style="background-color: #e8e6e4;"  id ="tablefooter">
            
        </tfoot>
    </table>

        <!-- Thank you message -->
        <div class="details">
            <h4>Thank you, visit again!</h4>
            <p><a href="https://datacrushanalytics.com/" style="color: #B1B6BA; font-size: 14px;">www.DataCrushAnalytics.com (Contact No: 7040040015)</a></p>
        </div>
    </div>
    


        <!-- Print button -->
        <div class="header-details">
        <button id="printButton">Print</button>
        </div>

    `;

    // Assign ID to itemData
    itemData.id = 'printContent';
    // Append modal content to modal
    modalContent.appendChild(itemData);

    // Append modal content to modal
    modal.appendChild(modalContent);

    // Display the modal
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Add event listener to the print button
    var printButton = document.getElementById('printButton');
    printButton.addEventListener('click', function () {
        printJS({
            printable: 'printContent', // ID of the element to print
            type: 'html', // Type of content
            scanStyles: true, // Scan for styles
            targetStyles: ['*'] // Apply all styles
        });
    });
}


function openModal1(item) {
    // Your code to open the modal with the data from 'item'
    console.log("Opening receipt modal for item:", item);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    fetch('http://103.174.102.89:3000/receiptReport/' + item.receipt_id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            console.log(data)
            loader.style.display = 'none';
            var utcDate = new Date(data.reports[0].date);
            var options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'Asia/Kolkata'
            };


            var tableBody = document.getElementById("TableBody");
            tableBody.innerHTML = ""; // Clear existing rows

            var billDetails = [
                { label: "जमा पावती क्र.:", value: item.receipt_id },
                { label: "तारीख:", value: utcDate.toLocaleString('en-IN', options) },
                { label: "ग्राहकाचे नाव:", value: data.reports[0].Customer },
                { label: "संपर्क क्र.:", value: data.reports[0].mobile_no },
                { label: "पत्ता:", value: data.reports[0].address },
                // Add other bill details similarly
            ];

            billDetails.forEach(function (detail) {
                var row = document.createElement("tr");
                row.innerHTML = `
                        <td><b>${detail.label}</b></td>
                        <td>${detail.value}</td>
                    `;
                tableBody.appendChild(row);
            });

            // document.getElementById('carate3100').textContent = data.reports[0].carate_100;
            // document.getElementById('carate3150').textContent = data.reports[0].carate_150;
            // document.getElementById('carate3250').textContent = data.reports[0].carate_250;
            // document.getElementById('carate3350').textContent = data.reports[0].carate_350;


            var tablefooter = document.getElementById("tablefooter");
            tablefooter.innerHTML = ""; // Clear existing rows

            var footerDetails = [
                //{ label: "गेलेले कॅरेट : +", value: data.results[0].carate_amount },
                //{ label: "चालू कलम रक्कम:", value: data.results[0].amount },
                { label: "मागील बाकी:", value: data.reports[0].previous_balance },
                { label: "बाकी कॅरेट : 100 X  " + data.reports[0].carate_100 + "  150 X  " + data.reports[0].carate_150 + "  250 X  " + data.reports[0].carate_250 + "  350 X  " +  data.reports[0].carate_350, value: ''},
                //{ label: "एकूण रक्कम:", value: data.results[0].total_amount },
                { label: "रोख जमा रक्कम:", value: data.reports[0].PaidAmt },
                { label: "ऑनलाईन जमा बँक :", value: data.reports[0].online_deposite_bank },
                { label: "ऑनलाईन जमा रक्कम:", value: data.reports[0].onlineAmt },
                { label: "सूट रक्कम:", value: data.reports[0].discount },
                { label: "जमा कॅरेट:  -" + "100 * " +data.reports[0].c100 +" | 150 * " + data.reports[0].c150+ " | 250 * " +data.reports[0].c250 + " | 350 * " + data.reports[0].c350, value: data.reports[0].inCarat },
                { label: "आत्ता पर्यंतचे येणे बाकी:", value: data.reports[0].Balance },
                
                // Add other bill details similarly
            ];

            footerDetails.forEach(function (detail) {
                var row = document.createElement("tr");
                row.innerHTML = `
                    <td align="right" colspan="6"><font color="black">${detail.label}</font></td>
                    <td align="right" colspan="1"><font color="black">${detail.value}</font></td>
                    `;
                tablefooter.appendChild(row);
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Create a modal element
    var modal = document.createElement('div');
    modal.className = 'modal';

    // Create modal content
    var modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    // Add close button
    var closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function () {
        modalContent.innerHTML = '';
        modal.style.display = 'none'; // Close the modal when close button is clicked
        //window.location.reload();
    };
    modalContent.appendChild(closeButton);
   

    // Add item data to modal content
    var itemData = document.createElement('div');
    itemData.innerHTML = `
    <style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
    }

    .header {
        background-color: #f9f9f9;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .header .logo {
        width: auto; /* Adjust as needed */
        margin-right: 20px; /* Adjust as needed */
    }

    .header .logo img {
        height: 80px; /* Adjust as needed */
    }

    .header .details {
        width: 80%; /* Adjust as needed */
        text-align: right;
    }

    .header h1, .header p {
        margin: 5px 0;
        font-size: 16px;
    }

    .container2 {
        max-width: 600px;
        margin: 0 auto;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 12px; /* Adjust font size */
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
    }

    th, td {
        border: 1px solid #ccc;
        padding: 6px; /* Adjust padding */
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
    }

    .total {
        font-weight: bold;
    }

    .details {
        text-align: center;
        margin-top: 10px;
    }

    .header-details button {
        padding: 10px 20px;
        background-color: #808080;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    @media print {
        .details, .header-details, .close {
            display: none; /* Hide the print button and header details when printing */
        }
    }

    .container3 {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
    }

    .box-container {
        background-color: #fff;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        margin-left: 10%; /* Add left margin to make the container smaller from the left side */
        width: 70%; /* Adjust the width to make the container smaller */
        max-width: 600px; /* Optional: set a maximum width */
    }

    .row {
        display: flex;
        flex-wrap: wrap;
    }

    .carate-box {
        background-color: #e9e9e9;
        padding: 8px; /* darkgreyuced padding */
        margin: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        flex: 1 1 calc(20% - 20px); /* Adjusted flex-basis for smaller boxes */
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
    }

    .carate {
        font-weight: bold;
        font-size: 16px;
        color: #333;
    }

    .data {
        font-size: 14px;
        color: #666;
        margin-left: 10px;
    }
</style>
</head>
<body>
<div class="header">
    <div class="logo">
        <img src="../../assets/img/logo.png" alt="Company Logo">
    </div>
    <div>
        <h1>सावता फ्रुट सप्लायर्स</h1>
        <p>ममु.पोस्ट- काष्टी ता.- श्रीगोंदा, जि. अहमदनगर - 414701</p>
        <p>मोबाईल नं:- 9860601102  / 9922676380 / 9156409970</p>
    </div>
</div>
<div class="container2">
    <!-- Receipt details -->
    <table>
        <tbody id="TableBody">
        </tbody>
    </table>
    
    <!-- Items table -->
    <table>
        <tfoot style="background-color: #e8e6e4;" id="tablefooter">
        </tfoot>
    </table>

    
</div>
        <!-- Thank you message -->
        <div class="details">
            <h4>Thank you, visit again!</h4>
            <p><a href="https://datacrushanalytics.com/" style="color: #B1B6BA; font-size: 14px;">www.DataCrushAnalytics.com (Contact No: 7040040015)</a></p>
        </div>
    </div>
        


        <!-- Print button -->
        <div class="header-details">
        <button id="printButton">Print</button>
        </div>

    `;

    // Assign ID to itemData
    itemData.id = 'printContent';
    // Append modal content to modal
    modalContent.appendChild(itemData);

    // Append modal content to modal
    modal.appendChild(modalContent);

    // Display the modal
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Add event listener to the print button
    var printButton = document.getElementById('printButton');
    printButton.addEventListener('click', function () {
        printJS({
            printable: 'printContent', // ID of the element to print
            type: 'html', // Type of content
            scanStyles: true, // Scan for styles
            targetStyles: ['*'] // Apply all styles
        });
    });
}









