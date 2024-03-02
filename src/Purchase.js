function purchaseProductData(){
    console.log("into insertion block");
    try{
        const id=document.querySelector('.id input').value;
        const product_name=document.querySelector('.product_name input').value;
        const bata=document.querySelector('.bata input').value;
        const purchase_id=document.querySelector('.purchase_id input').value;
        const mark=document.querySelector('.mark input').value;
        const purchase_price=parseInt(document.querySelector('.purchase_price input').value);
        const selling_price=parseInt(document.querySelector('.selling_price input').value);
        const quantity=parseInt(document.querySelector('.quantity input').value);
        const price=parseInt(document.querySelector('.price input').value);
        const unit=parseInt(document.querySelector('.unit input').value);
    
        console.log(id,product_name,bata,purchase_id,mark,purchase_price,selling_price,quantity,price,unit)
        fetch('http://3.109.121.46//purchaseproductData/insertpurchaseproductData',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "id":1,
                "product_name":product_name,
                "bata":bata,
                "purchase_id":purchase_id,
                "selling_price":selling_price,
                "qunatity":quantity,
                "price":price,
                "unit":unit
            })


        })

        .then(response =>{
            if(!response.ok){
                console.log(response)
                throw new Error('Network response was not ok');

            }
            return response.text();
        })
        .then(data => alert(data))
        .catch(error =>{
            console.error('There was a problem with the fetch operation:',error);
        });
        
    }catch (error){
        console.error('An error occurred:',error);
    }

}