// function receipt() {
//     console.log("receipt function executed");

// fetch('http://3.109.121.46/receiptData')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }


function receipt(){
    console.log("into insertion block");
    try{
        const recipt_no=document.querySelector('.recipt_no input').value;
        const date=document.querySelector('.date input').value;
        const from_account=parseInt(document.querySelector('.acc input').value);
        const to_account=parseInt(document.querySelector('.to_acc input').value);
        const note=document.querySelector('.note input').value;
        const prev_balance=parseInt(document.querySelector('.prev_balance input').value);
        const deposit=parseInt(document.querySelector('.deposit input').value);
        const online_dep_bnk=parseInt(document.querySelector('.online_dep_bnk input').value);
        const online_deposit=parseInt(document.querySelector('online_deposit input').value);
        const discount=parseInt(document.querySelector('discount input').value);
        const caret=parseInt(document.querySelector('.caret input').value);
        const deposite_carate_price=parseInt(document.querySelector('deposite_carate_price input').value);
        const remaining=parseInt(document.querySelector('remaining input').value);



        console.log(recipt_no,date,from_account,to_account,note,prev_balance,deposit,online_dep_bnk,online_deposit,discount,caret,deposite_carate_price,remaining)
        fetch('http://3.109.121.46/receiptData/insertreceiptData',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "recipt_no":1,
                "date":date,
                "from_account":acc,
                "to_account":to_account,
                "note":note,
                "prev_balance":prev_balance,
                "deposit":deposit,
                "online_dep_bnk":online_dep_bnk,
                "online_deposit":online_deposit,
                "discount":discount,
                "caret":caret,
                "deposite_carate_price":deposite_carate_price,
                "remaining":remaining
            })
        })
            
.then(Response =>{
    if(!Response.ok){
        console.log(response)
        throw new Error('Network response was not ok');
    }
    return response.text();
})
    .then(data => alert(data))
    .catch(error =>{
        console.error('There was a problem with the fetch operation:',error);
     });
    } catch (error){
        console.error('An error occurred:', error);

    }
}
