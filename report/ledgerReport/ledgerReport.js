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


function fetchDataAndProcess() {
    var data = {
        from_date : formatDate(document.getElementById("fromdate").value),
        to_date : formatDate(document.getElementById("todate").value),
        customer_name : getElementValueWithDefault('customer', '*') , 
        route : getElementValueWithDefault('route', '*') 
    };
    console.log(data);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    return fetch('http://65.2.144.249/ledgerReport', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 404) {
        loader.style.display = 'none';
            alert("No data found.");
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
        // Optionally, you can redirect or show a success message here
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, you can display an error message here
    });
}


function populateTable4(data) {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['date','route', 'customer_name','summary', 'balance','out_carate','total_balance','cash','online','discount','in_carate','remaining'];
    var counter = 1;
    console.log(data.reports)
    if (data.reports.length === 0) {
        alert("No Data Found");
    }
    data.reports.forEach(function(item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        cell.textContent = counter++;
        columnsToDisplay.forEach(function(key) {
            var cell = row.insertCell();
            if(key=='date'){
                console.log(item[key])
                var utcDate = new Date(item[key]);
                var options = { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    timeZone: 'Asia/Kolkata' 
                };
                cell.textContent = utcDate.toLocaleString('en-IN', options);
            
            }else{
            cell.textContent = item[key];
            }
        });
        
    });
 // Add row for grand total
     var totalRow = tbody.insertRow();
     var totalCell = totalRow.insertCell();
     totalCell.colSpan = columnsToDisplay.length;

    if (document.getElementById('customer').value !== '') {
        console.log("Custometr not seletced ")
        fetch('http://65.2.144.249/carateuserData/' + document.getElementById('customer').value)
            .then(response => {
                if (!response.ok) {
                    loader.style.display = 'none';
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data1 => {
                // Populate dropdown with API data
                console.log(data1)
                // totalCell.textContent = 'Grand Total: ' + data.Grand['Grand in_carate_total'] + ' (Grand in_carate_total), ' + data.Grand['Grand out_carate_total'] + ' (Grand out_carate_total) <br>   Remaining Carate of Customer :  100 => ' + data1[0]['carate_100'] + ' 150 => '+  data1[0]['carate_150']+ ' 250 => ' + data1[0]['carate_250']+ ' 350 => '+ data1[0]['carate_350'];

                totalCell.innerHTML = 'Grand Total: ' + data.Grand['"Grand Balance"'] + ' ("Grand Balance"), ' + data.Grand['Grand outCarate'] + ' (Grand outCarate)' + data.Grand['Total Balance'] + ' (Total Balance), ' + data.Grand['Total Cash'] + ' (Total Cash)' + data.Grand['Total Online'] + ' (Total Online), ' + data.Grand['Grand Discount'] + ' (Grand Discount)' + data.Grand['Grand inCarate'] + ' (Grand inCarate), ' + data.Grand['Grand Remaining Amount'] + ' (Grand Remaining Amount) <br>' +  
    'Remaining Carate of Customer :\n' + 
    '100 => ' + data1[0]['carate_100'] + '\n' +
    '150 => ' + data1[0]['carate_150'] + '\n' +
    '250 => ' + data1[0]['carate_250'] + '\n' +
    '350 => ' + data1[0]['carate_350'];

            })
        }else{
    
     totalCell.textContent = 'Grand Total: ' + data.Grand['"Grand Balance"'] + ' ("Grand Balance"), ' + data.Grand['Grand outCarate'] + ' (Grand outCarate)' + data.Grand['Total Balance'] + ' (Total Balance), ' + data.Grand['Total Cash'] + ' (Total Cash)' + data.Grand['Total Online'] + ' (Total Online), ' + data.Grand['Grand Discount'] + ' (Grand Discount)' + data.Grand['Grand inCarate'] + ' (Grand inCarate), ' + data.Grand['Grand Remaining Amount'] + ' (Grand Remaining Amount)';                                                                                                                                                                                                                                                     
}
}




async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        // Export to PDF using jsPDF and autoTable
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Map data for autoTable
        const reportData = data.reports.map(report => [
            new Date(report.date).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' }),
            report.route,
            report.customer_name,
            report.balance,
            report.total_balance,
            report.cash,
            report.online,
            report.discount,
            report.in_carate,
            report.remaining
        ]);

        // Add Reports table to PDF
        doc.autoTable({
            head: [customHeaders],
            body: reportData,
            startY: 10,
            theme: 'grid'
        });

        // Adding Grand Totals to PDF
        doc.autoTable({
            head: [['Description', 'Amount']],
            body: [
                ["Grand Balance", data.Grand["Grand Balance"]],
                ["Grand outCarate", data.Grand['Grand outCarate']],
                ["Total Balance", data.Grand['Total Balance']],
                ["Total Cash", data.Grand['Total Cash']],
                ["Total Online", data.Grand['Total Online']],
                ["Grand Discount", data.Grand['Grand Discount']],
                ["Grand inCarate", data.Grand['Grand inCarate']],
                ["Grand Remaining Amount", data.Grand['Grand Remaining Amount']]
            ],
            startY: doc.autoTable.previous.finalY + 10,
            theme: 'grid'
        });

        // Save the PDF
        doc.save('Ledger_Report.pdf');

    } catch (error) {
        console.error('Error exporting data:', error);
    }
}


