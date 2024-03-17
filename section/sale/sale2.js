document.getElementById('loginForm1').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

// function form2(){
    var formData = {
        bill_id: parseInt(document.getElementById('bill_no1').value),
        bata: document.getElementById('bata').value,
        mark: document.getElementById('mark').value,
        product: document.getElementById('product').value,
        quantity: parseInt(document.getElementById('quantity').value),
        rate: parseInt(document.getElementById('rate').value),
        price: parseInt(document.getElementById('price').value)
    };
    
    // fetch('http://localhost:3000/saleproductData/insertsaleproduct', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    // })
    // .then(result => {
    //     console.log('Entry added successfully:', result);
    //     updateTable(formData);
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
// }
});



function updateTable(entry) {
    var tableBody = document.getElementById('tableBody1');
    var newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${entry.product}</td>
        <td>${entry.bata}</td>
        <td>${entry.mark}</td>
        <td>${entry.quantity}</td>
        <td>${entry.rate}</td>
        <td>${entry.price}</td>
    `;
    tableBody.appendChild(newRow);
}


function form1(){
    alert('Button clicked!');
}
