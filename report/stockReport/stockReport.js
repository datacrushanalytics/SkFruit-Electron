

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

    return fetch('http://103.174.102.89:3000/stockReport', {
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
    var columnsToDisplay = ['purchase_id','gadi_number','supplier_name','bata','mark','product_name','opening','sale','closing' ];
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

async function exportToPdf() {
    try {
        const data = await fetchDataAndProcess();
        
        if (!data || !data.reports || data.reports.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No data available for PDF export.',
            });
            return;
        }

        var loader = document.getElementById('loader');
        loader.style.display = 'block';

        // Create jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add header image
        const headerImageUrl = "../../assets/img/a4.png";
        const imageX = 10; // X position of the image
        const imageY = 8; // Y position of the image
        const imageWidth = 190; // Width of the image
        const imageHeight = 50; // Height of the image
        doc.addImage(headerImageUrl, 'PNG', imageX, imageY, imageWidth, imageHeight); // Adjust image size and position

        // Calculate the startY for the table based on image height and positioning
        const tableStartY = imageX + imageY + imageHeight + 10; // Add some space below the image
 
        // Add table header
        const columns = ['S.No', 'Purchase ID', 'Gadi Number', 'Supplier Name', 'Bata', 'Mark', 'Product Name', 'Quantity', 'Sale', 'Closing'];
        const rows = [];
        let counter = 1;

        // Populate rows with the data
        data.reports.forEach(item => {
            const row = [
                counter++, 
                item.purchase_id, 
                item.gadi_number, 
                item.supplier_name, 
                item.bata, 
                item.mark, 
                item.product_name, 
                item.opening, 
                item.sale, 
                item.closing
            ];
            rows.push(row);
        });

        const bodyColor = '#fffef4';    
        
        doc.autoTable({
            head: [columns],
            body: rows,
            startY: tableStartY,  // Adjusted to start below the image
            bodyStyles: {
                fillColor: bodyColor,  // Body row background color
            },
        });

        // Download the PDF
        loader.style.display = 'none';
        doc.save('stockReport.pdf');
        console.log('PDF downloaded successfully');
    } catch (error) {
        loader.style.display = 'none';
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error generating PDF. Please try again.',
        });
    }
}



