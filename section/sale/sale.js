// Fetch data from API
document.addEventListener('DOMContentLoaded', function () {
    // Get the current date
    var currentDate = new Date();
    // Format the date as mm/dd/yyyy
    var formattedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    // Set the placeholder of the input field to the formatted date
    document.getElementById('date').value = formattedDate;

    fetch('http://3.108.215.177/fetchSaleid')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            document.getElementById('bill').value = parseInt(data[0]['num']) + 1;
            fetch('http://3.108.215.177/saleproductData/' + (parseInt(data[0]['num']) + 1))
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Populate dropdown with API data
                    populateDropdown3(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });




        })
        .catch(error => {
            console.error('Error:', error);
        });

    // fetch('http://3.108.215.177/list/Customer')
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         // Populate dropdown with API data
    //         populateDropdown(data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });

    // fetch('http://3.108.215.177/purchaseproductData/')
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         // Populate dropdown with API data
    //         populateDropdown1(data);
    //         populateDropdown2(data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });



    // fetch('http://3.108.215.177/saleproductData/' +)
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         // Populate dropdown with API data
    //         populateDropdown3(data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });

    // fetch('http://3.108.215.177/routeData')
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         // Populate dropdown with API data
    //         populateDropdown4(data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });

    // fetch('http://3.108.215.177/list/Bank Account')
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         // Populate dropdown with API data
    //         populateDropdown5(data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
});


// function populateDropdown(data) {
//     var userNameDropdown = document.getElementById('grahk');
//     userNameDropdown.innerHTML = ''; // Clear existing options

//     // Create and append new options based on API data
//     data.forEach(function (item) {
//         var option = document.createElement('option');
//         option.value = item.name; // Set the value
//         option.textContent = item.name; // Set the display text
//         userNameDropdown.appendChild(option);
//     });

//     // Add a placeholder option
//     var placeholderOption = document.createElement('option');
//     placeholderOption.value = ""; // Set an empty value
//     placeholderOption.textContent = "ग्राहकाचे नाव"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }

// function populateDropdown1(data) {
//     var userNameDropdown = document.getElementById('bta');
//     userNameDropdown.innerHTML = ''; // Clear existing options

//     // Create and append new options based on API data
//     data.forEach(function (item) {
//         var option = document.createElement('option');
//         option.value = item.bata; // Set the value
//         option.textContent = item.bata; // Set the display text
//         userNameDropdown.appendChild(option);
//     });

//     // Add a placeholder option
//     var placeholderOption = document.createElement('option');
//     placeholderOption.value = ""; // Set an empty value
//     placeholderOption.textContent = "Select Bata"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }


// function populateDropdown2(data) {
//     var userNameDropdown = document.getElementById('product');
//     userNameDropdown.innerHTML = ''; // Clear existing options

//     // Create and append new options based on API data
//     data.forEach(function (item) {
//         var option = document.createElement('option');
//         option.value = item.product_name; // Set the value
//         option.textContent = item.product_name; // Set the display text
//         userNameDropdown.appendChild(option);
//     });

//     // Add a placeholder option
//     var placeholderOption = document.createElement('option');
//     placeholderOption.value = ""; // Set an empty value
//     placeholderOption.textContent = "Select Product"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }


function populateDropdown3(data) {
    var tbody = document.getElementById('tableBody1');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['product', 'bata', 'mark', 'quantity', 'rate', 'price'];
    data.forEach(function (item) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        columnsToDisplay.forEach(function (key) {
            var cell = row.insertCell();
            cell.textContent = item[key];
        });
        // Add Delete button
        var deleteCell = row.insertCell();
        var deleteButton = document.createElement('button');
        deleteButton.className = 'button delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            deleteUser(item.id); // Pass the user id to the delete function
        });
        deleteCell.appendChild(deleteButton);

    });
}

function deleteUser(userId) {
    // Perform delete operation based on userId
    fetch('http://3.108.215.177/saleproductData/deletesaleproduct/' + userId, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('User deleted successfully');
            alert("Sale Data is successfully Deleted");
            // Refresh the table or update UI as needed
            user(); // Assuming you want to refresh the table after delete
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


// function populateDropdown4(data) {
//     var userNameDropdown = document.getElementById('Route');
//     userNameDropdown.innerHTML = ''; // Clear existing options

//     // Create and append new options based on API data
//     data.forEach(function (item) {
//         var option = document.createElement('option');
//         option.value = item.route_name; // Set the value
//         option.textContent = item.route_name; // Set the display text
//         userNameDropdown.appendChild(option);
//     });

//     // Add a placeholder option
//     var placeholderOption = document.createElement('option');
//     placeholderOption.value = ""; // Set an empty value
//     placeholderOption.textContent = "Select Route type"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }


// function populateDropdown5(data) {
//     var userNameDropdown = document.getElementById('onlineAcc');
//     userNameDropdown.innerHTML = ''; // Clear existing options

//     // Create and append new options based on API data
//     data.forEach(function (item) {
//         var option = document.createElement('option');
//         option.value = item.name; // Set the value
//         option.textContent = item.name; // Set the display text
//         userNameDropdown.appendChild(option);
//     });

//     // Add a placeholder option
//     var placeholderOption = document.createElement('option');
//     placeholderOption.value = ""; // Set an empty value
//     placeholderOption.textContent = "Select Online Account"; // Set placeholder text
//     placeholderOption.disabled = true; // Disable the option
//     placeholderOption.selected = true; // Select the option by default
//     userNameDropdown.insertBefore(placeholderOption, userNameDropdown.firstChild);
// }



function getProducts() {
    var bataId = document.getElementById('bta').value;
    console.log(bataId)
    fetch('http://3.108.215.177/purchaseproductData/getBataProduct/' + bataId)
        .then(response => response.json())
        .then(data => {
            console.log(data[0].product_name)
            document.getElementById('mark').value = data[0].mark;
            document.getElementById('kimmat').value = data[0].selling_price;
            
            // Get the Select2 dropdown element
            var $productDropdown = $('#product');
            
            // Set the value of the Select2 dropdown
            $productDropdown.val(data[0].product_name).trigger('change');

            // Update label with additional content
            var nagLabel = document.getElementById('nagLabel');
            nagLabel.innerHTML = 'नग: (' + data[0].selling_price + data[0].selling_price + ')'; 
        })
        .catch(error => {
            console.error('Error:', error);
        });


    fetch('http://3.108.215.177/fetchStock/' + bataId)
        .then(response => response.json())
        .then(data => {

            // Update label with additional content
            var nagLabel = document.getElementById('nagLabel');
            nagLabel.innerHTML = 'नग: (Remaining : ' + data[0].closing + ')'; 
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
}



// function getProducts() {
//     var bataId = document.getElementById('bta').value;
//     console.log(bataId)
//     fetch('http://3.108.215.177/purchaseproductData/getBataProduct/' + bataId)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data[0].product_name)
//             document.getElementById('mark').value = data[0].mark;
//             document.getElementById('kimmat').value = data[0].selling_price;
//             var productDropdown = document.getElementById('product');
//             // Loop through the options in the dropdown
//             for (var i = 0; i < productDropdown.options.length; i++) {
//                 console.log(data[0].product_name);
//                 // Check if the current option's value matches the fetched data
//                 if (productDropdown.options[i].value == data[0].product_name) {
//                     // Set the selected attribute of the matched option
//                     productDropdown.options[i].selected = true;
//                     // Exit the loop since we found the matching option
//                     break;
//                 }
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }

function updateTotal() {
    document.getElementById("total").value = document.getElementById("kimmat").value * document.getElementById("nag").value
}



function getCust() {
    var number = document.getElementById('number').value;
    console.log(number)
    fetch('http://3.108.215.177/fetchName/mobile/' + number)
        .then(response => response.json())
        .then(data => {
            console.log(data[0].name)
            // Get the Select2 dropdown element
            var $productDropdown = $('#grahk');
            
            // Set the value of the Select2 dropdown if it's different
            if ($productDropdown.val() !== data[0].name) {
                $productDropdown.val(data[0].name).trigger('change');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}




// function getMobile() {
//     var name = document.getElementById('grahk').value;
//     console.log(name)
//     fetch('http://3.108.215.177/fetchName/name/' + name)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data[0].name)
//             // Get the Select2 dropdown element
//             var $productDropdown = $('#number');
            
//             // Set the value of the Select2 dropdown
//             $productDropdown.val(data[0].name).trigger('change');
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }