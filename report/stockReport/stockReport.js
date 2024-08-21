

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
        product : getElementValueWithDefault('product', '*') , 
        bata : getElementValueWithDefault('bata', '*'),
        gadi_number : getElementValueWithDefault('vehicle', '*') ,
        supplier_name : getElementValueWithDefault('supplier', '*') ,
        purchase_id : getElementValueWithDefault('purchase_id', '*') 
    };
    console.log(data);
    var loader = document.getElementById('loader');
        loader.style.display = 'block';

    return fetch('http://13.201.94.88/stockReport', {
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
    var columnsToDisplay = ['purchase_id','gadi_number','supplier_name','product_name','bata','purchase', 'opening','sale','closing' ];
    var counter = 1;
    console.log(data.reports)
    if (data.reports.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No data found.',
          });
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
}



// async function exportToExcel() {
//     try {
//         const data = await fetchDataAndProcess();

//         // Export to PDF using jsPDF and autoTable
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF();

        
//         const customHeaders = ['purchase_id','gadi_number','supplier_name','product_name','bata','purchase', 'opening','purchase','sale','closing' ];

//         // Adding header details
//         doc.setFontSize(10);
//         doc.text('Mobile:- 9960607512', 10, 10);
//         doc.addImage('../../assets/img/logo.png', 'PNG', 10, 15, 30, 30); // Adjust the position and size as needed
//         doc.setFontSize(16);
//         doc.text('Savata Fruits Suppliers', 50, 20);
//         doc.setFontSize(12);
//         doc.text('At post Kasthi Tal: Shreegonda, District Ahamadnagar - 414701', 50, 30);
//         doc.text('Mobile NO:- 9860601102  / 9922676380 / 9156409970', 50, 40);
        
//         let startY = 50;

//         // Map data for autoTable Purchase ID	Vehicle Number	Suppplier Name
//         const reportData = data.reports.map(report => [
//             report.Purchase_iD,
//             report.gadi_number,
//             report.supplier_name,
//             report.product_name,
//             report.bata,
//             report.purchase,
//             report.opening,
//             report.purchase,
//             report.sale,
//             report.closing
//         ]);

//         // Add Reports table to PDF
//         doc.autoTable({
//             head: [customHeaders],
//             body: reportData,
//             startY: 50,
//             theme: 'grid'
//         });

//         // Save the PDF
//         doc.save('Stock_Report.pdf');

//     } catch (error) {
//         console.error('Error exporting data:', error);
//     }
// }


async function exportToExcel() {
    try {
        const data = await fetchDataAndProcess();

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        return fetch('http://13.201.94.88/stockReport/generate-pdf', {
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
            a.download = 'stockReport.pdf'; // Set the desidarkgrey file name
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



