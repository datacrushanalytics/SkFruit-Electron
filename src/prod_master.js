function insertProduct() {
    console.log("INTO insertion block");
    try {
        const name = document.querySelector('.name input').value;
        const category = document.querySelector('.category input').value;

        const rate = parseInt(document.querySelector('.rate input').value);
        const w_rate = parseInt(document.querySelector('.wrate input').value);
        const minimum_stock = parseInt(document.querySelector('.minimumstock input').value);
        const rate_editable = parseInt(document.querySelector('.rateeditable input').value);


        console.log(name,category,rate,w_rate,minimum_stock,rate_editable)

        fetch('http://3.109.121.46/productData/insertproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
    },
    body: JSON.stringify({
        "is_ative": 1,
         "name": name,
         "category": category,
         "rate": rate,
         "w_rate": w_rate,
         "minimum_stock": minimum_stock,
         "rate_editable": rate_editable
    })
        })
        .then(response => {
            if (!response.ok) {
                console.log(response)
              throw new Error('Network response was not ok');
            }
            return response.text(); // Read response as text
          })
          .then(data => alert(data)) // Alert the response
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
