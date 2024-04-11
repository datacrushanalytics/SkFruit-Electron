document.getElementById('login').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    console.log(document.getElementById('number').value)
    var formData = {
        bill_no: parseInt(document.getElementById('bill').value),
        date: document.getElementById('date').value,
        cust_name: document.getElementById('grahk').value,
        route: document.getElementById('Route').value,
        address: document.getElementById('address').value,
        mobile_no: document.getElementById('number').value,
        comment: document.getElementById('sandarbh').value,
        amount: parseInt(document.getElementById('bill1').value) || 0,
        carate_amount: parseInt(document.getElementById('total1').value) || 0,
        pre_balance: parseInt(document.getElementById('previousBalance').value) || 0,
        total_amount: parseInt(document.getElementById('totalBill').value) || 0,
        cash: parseInt(document.getElementById('bill_cash').value) || 0,
        online_acc: document.getElementById('onlineAcc').value,
        online_amt: parseInt(document.getElementById('online').value) || 0,
        discount: parseInt(document.getElementById('discount').value) || 0,
        inCarate: parseInt(document.getElementById('total2').value) || 0,
        balance: parseInt(document.getElementById('baki').value) || 0,
        note: document.getElementById('note').value,
        in_carate_100: parseInt(document.getElementById('carate100').value) || 0,
        in_carate_150: parseInt(document.getElementById('carate150').value) || 0,
        in_carate_250: parseInt(document.getElementById('carate250').value) || 0,
        in_carate_350: parseInt(document.getElementById('carate350').value) || 0,
        out_carate_100: parseInt(document.getElementById('carate1100').value) || 0,
        out_carate_150: parseInt(document.getElementById('carate1150').value) || 0,
        out_carate_250: parseInt(document.getElementById('carate1250').value) || 0,
        out_carate_350: parseInt(document.getElementById('carate1350').value) || 0,
    };

    try {
        const response = await fetch('https://skfruit-backend.onrender.com/saleData/insertsale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        console.log('Entry added successfully:', result);
        alert("Sale Data is added Successfully");
        window.location.reload(); // Reload the page after displaying the alert
    } catch (error) {
        console.error('Error:', error);
    }
});
