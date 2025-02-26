// Fetch data from API

let allowNavigation = false; // Flag to track if user confirmed the leave

function confirmAndProceed() {
    if (allowNavigation) {
        return; // If already confirmed, do nothing
    }

    // Show SweetAlert dialog to confirm leaving
    Swal.fire({
        icon: 'warning',
        title: 'Are you sure you want to leave?',
        text: "This action will clear the page and delete the data.",
        showCancelButton: true,
        confirmButtonText: 'Yes, leave!',
        cancelButtonText: 'No, stay',
    }).then((result) => {
        if (result.isConfirmed) {
            allowNavigation = true; // Mark that navigation is confirmed

            // Call the GET API to fetch the IDs
            fetch(`http://103.174.102.89:3000/fetchData/saleProduct/${document.getElementById('bill').value}`, {
                method: 'GET',
                keepalive: true, // Ensures the request completes
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch IDs');
                    }
                    return response.json(); // Parse the JSON response
                })
                .then(data => {
                    // Loop through IDs and call the DELETE API for each
                    const deletePromises = data.map(item => {
                        return fetch(`http://103.174.102.89:3000/saleproductData/deletesaleproduct/${item.id}`, {
                            method: 'DELETE',
                            keepalive: true
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Failed to delete ID ${item.id}`);
                                }
                                return response.json(); // Parse delete response
                            })
                            .catch(error => {
                                console.error(`Error deleting ID ${item.id}:`, error);
                            });
                    });

                    // Wait for all delete requests to complete
                    return Promise.all(deletePromises);
                })
                .then(() => {
                    console.log('All items deleted successfully');
                    // Perform any further actions like navigating or reloading
                    window.location.href = '../Menu.html';
                    //window.location.reload(); // Optional: trigger page reload
                })
                .catch(error => {
                    allowNavigation = true;
                    console.error('Error during API calls:', error);
                    window.location.href = '../Menu.html';
                });
        }
    });
}



function editRow(button, id,editable) {
    var row = button.parentElement.parentElement;
    var cells = row.querySelectorAll('td');

    // Save current values of quantity and rate
    const originalQuantity = cells[3].textContent;
    const originalRate = cells[4].textContent;

    // Conditionally render input fields based on the `editable` flag
    if (editable) {
        cells[3].innerHTML = `<input type="number" value="${originalQuantity}" min="1" style="width: 60px;" onchange="updateRowTotal(this)">`;
    } else {
        cells[3].textContent = originalQuantity; // Keep the original value as plain text
    }

    // Always allow editing the rate
    cells[4].innerHTML = `<input type="number" value="${originalRate}" min="0" style="width: 60px;" onchange="updateRowTotal(this)">`;

    // Calculate the initial total and set it in the price cell
    if (editable) {
        updateRowTotal(cells[3].querySelector('input'));
    }

    // Replace action buttons with "Save" and "Cancel"
    cells[6].innerHTML = `
        <button type="button" onclick="saveRow(this,'${id}', '${editable}')">Save</button>
        <button type="button" onclick="cancelEdit(this, '${originalQuantity}', '${originalRate}')">Cancel</button>
    `;
}


function updateRowTotal(inputElement) {
    var row = inputElement.parentElement.parentElement;
    var cells = row.querySelectorAll('td');

    // Safely get quantity and rate input values
    var quantityInput = cells[3]?.querySelector('input');
    var rateInput = cells[4]?.querySelector('input');

    var quantity = quantityInput ? parseInt(quantityInput.value, 10) || 0 : parseInt(cells[3].textContent.trim(), 10) || 0;
    var rate = rateInput ? parseInt(rateInput.value, 10) || 0 : 0;

    // Get available inventory from a hidden field (like 'nag1')
    var availableInventoryElement = document.getElementById("nag1");
    var availableInventory = availableInventoryElement ? parseInt(availableInventoryElement.value, 10) || 0 : 0;

    // Check if quantity exceeds available inventory
    if (quantity > availableInventory) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Inventory is not available for the entered quantity.',
        });
        if (quantityInput) quantityInput.value = availableInventory; // Reset quantity to max available inventory
        quantity = availableInventory; // Update the quantity variable
    }

    // Get the previous total value from the cell
    var previousTotal = parseInt(cells[5].textContent.trim(), 10) || 0;

    // Calculate new total as quantity * rate
    var total = quantity * rate;

    // Update the total in the table
    cells[5].textContent = total;

    // Update the hidden total field if needed
    var totalField = document.getElementById("total");
    if (totalField) {
        totalField.value = total;
    }

    // Update the overall bill1 value by subtracting the previous total and adding the new total
    var billField = document.getElementById('bill1');
    if (billField) {
        billField.value = (parseInt(billField.value || 0) - previousTotal + total);
    }

    // Call totalBalance function to update the overall balance
    totalBalance();
}



function cancelEdit(button, originalQuantity, originalRate) {
    var row = button.parentElement.parentElement;
    var cells = row.querySelectorAll('td');

    // Restore the original quantity and rate
    cells[3].innerHTML = originalQuantity; // Restore original quantity value
    cells[4].innerHTML = originalRate;    // Restore original rate value

    // Restore the original action buttons
    cells[6].innerHTML = `
        <button type="button" onclick="deleteUser(this, '${row.getAttribute('data-id')}','${cells[5].textContent}')">Delete</button>
        <button type="button" onclick="editRow(this, '${row.getAttribute('data-id')}')">Edit</button>
    `;

    // Optional: Log or notify cancellation
    console.log('Edit canceled. Values restored.');
}



function saveRow(button, id1, editable) {
  console.log("editable", editable)
    var row = button.parentElement.parentElement;
    var cells = row.querySelectorAll('td');

    var flag = editable == 0 ? false : true;
    // if (editable == 0){
    //   flag = false;
    // }else{
    //   flag = true;
    // }

    // Get updated values
    var updatedQuantity = flag
        ? parseInt(cells[3].querySelector('input').value, 10) || 0
        : parseInt(cells[3].textContent, 10) || 0;

    var updatedRate = parseInt(cells[4].querySelector('input').value, 10) || 0;
    var updatedPrice = updatedQuantity * updatedRate;

    // Update the table cells with new values
    cells[3].innerHTML = updatedQuantity;
    cells[4].innerHTML = updatedRate;
    cells[5].innerHTML = updatedPrice;

    // Restore original action buttons
    cells[6].innerHTML = `
        <button type="button" onclick="deleteUser(this, '${row.getAttribute('data-id')}','${updatedPrice}')">Delete</button>
        <button type="button" onclick="editRow(this)">Edit</button>
    `;

    const id = row.getAttribute('data-id');

    // Prepare API payload
    const bill_id = document.getElementById('bill').value;  // Assuming the bill ID is available
    const bata = cells[1].textContent;
    const mark = cells[2].textContent;
    const product = cells[0].textContent;

    // Make an API call to save the changes
    fetch('http://103.174.102.89:3000/saleproductData/updatesaleproduct', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            bill_id: bill_id,
            bata: bata,
            mark: mark,
            product: product,
            quantity: updatedQuantity,
            rate: updatedRate,
            price: updatedPrice
        })
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Updated successfully',
                text: 'Product details updated successfully!',
                timer: 2000,
                timerProgressBar: true,
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error updating product details.',
            });
        });
}



function goToAccountPage(event) {
    event.preventDefault();
    // Perform the desidarkgrey action when the button is clicked
    window.location.href = "../account/acc-master.html"; // darkgreyirect to the account page
}

$(document).on('select2:open', function (e) {
    window.setTimeout(function () {
        document.querySelector('input.select2-search__field').focus();
    }, 0);
});


function setCustomer() {
    var route = document.getElementById('Route').value;

    // Check if the dropdowns already have selected values
    var grahkDropdown = document.getElementById('grahk');
    var numberDropdown = document.getElementById('number');

    if (!grahkDropdown.value) {
        fetchAndPopulateDropdown('http://103.174.102.89:3000/fetchData/customerSale/' + route, 'grahk', 'name');
    }

    if (!numberDropdown.value) {
        fetchAndPopulateDropdown('http://103.174.102.89:3000/fetchData/customerSale/' + route, 'number', 'mobile_no');
    }
}

function openPopup(event) {
    event.preventDefault();
    document.getElementById("popup").style.display = "block";
    var popupIframe = document.getElementById("popupIframe");
    popupIframe.src = "../../report/ledgerReport/ledger.html"; //
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}



function openScannerModal() {
    document.getElementById('scannerModal').style.display = 'block';
    autoFocusInput();
}

// document.getElementById('openPopupBtn').addEventListener('click', openPopup);

async function closeScannerModal() {
    // document.getElementById('scannerModal').style.display = 'none';
    setTimeout(async () => {
        await myFunction();
        // Additional logic to set values to the input section after delay
    }, 1000); // 1000ms delay
    document.getElementById('barcodeInput').value = '';
    document.getElementById('barcodeInput').focus();
}


async function closeScannerModal1() {
    document.getElementById('scannerModal').style.display = 'none';
}


function autoFocusInput() {
    document.getElementById('barcodeInput').focus();
}
let inputTimer = 0;

function handleBarcodeInput(event) {
    clearTimeout(inputTimer); // Clear previous timer

    inputTimer = setTimeout(() => {
        console.log("hello")
        let barcodeValue = event.target.value;
        if (barcodeValue) {  // Check if the input is not empty
            let modifiedBarcodeValue = modifyBarcode(barcodeValue);
            console.log("Modified", modifiedBarcodeValue)
            selectOption(modifiedBarcodeValue); // Select the existing option

            // Clear the input field
            event.target.value = '';

            // Close the modal
            closeScannerModal();
        }
    }, 500); // Adjust the timeout as needed
}

function modifyBarcode(barcode) {
    // Example modification: add a prefix and change certain digits
    let modifiedBarcode = barcode.split(': ')[1];
    return modifiedBarcode;
}

function selectOption(value) {
    // let dropdown = document.getElementById('bta');
    // let options = dropdown.options;
    var $productDropdown = $('#bta');
    // Set the value of the Select2 dropdown if it's different
    if ($productDropdown.val() !== value) {
        $productDropdown.val(value).trigger('change');
    }
}






// document.addEventListener('DOMContentLoaded', function () {

// });



// function populateDropdown3(data) {
//     var tbody = document.getElementById('tableBody1');
//     tbody.innerHTML = ''; // Clear existing rows
//     var columnsToDisplay = ['product', 'bata', 'mark', 'quantity', 'rate', 'price'];
//     data.forEach(function (item) {
//         var row = tbody.insertRow();
//         columnsToDisplay.forEach(function (key) {
//             var cell = row.insertCell();
//             cell.textContent = item[key];
//         });
//         // Add Delete button
//         var deleteCell = row.insertCell();
//         var deleteButton = document.createElement('button');
//         deleteButton.className = 'button delete-button';
//         deleteButton.style.backgroundColor = '#ff355f';
//         deleteButton.textContent = 'Delete';
//         deleteButton.addEventListener('click', function () {
//             deleteUser(item.id); // Pass the user id to the delete function
//         });
//         deleteCell.appendChild(deleteButton);

//     });
// }

// function deleteUser(userId) {
//     // Perform delete operation based on userId
//     fetch('http://103.174.102.89:3000/saleproductData/deletesaleproduct/' + userId, {
//         method: 'DELETE'
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             console.log('User deleted successfully');

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Success!',
//                 text: 'Sale Data is successfully Deleted',
//             })
//             // Refresh the table or update UI as needed
//             user(); // Assuming you want to refresh the table after delete
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }



function getProducts() {
    var bataId = document.getElementById('bta').value;
    console.log(bataId)
    var loader = document.getElementById('loader');
    loader.style.display = 'block';
    fetch('http://103.174.102.89:3000/purchaseproductData/getBataProduct/' + bataId)
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            console.log(data[0].product_name)
            document.getElementById('mark').value = data[0].mark;
            document.getElementById('kimmat').value = data[0].selling_price;

            // Get the Select2 dropdown element
            var $productDropdown = $('#product');

            // Set the value of the Select2 dropdown
            $productDropdown.val(data[0].product_name).trigger('change');
            $productDropdown.prop('disabled', true);
            document.getElementById('mark').readOnly = true;

        })
        .catch(error => {
            console.error('Error:', error);
        });


    fetch('http://103.174.102.89:3000/fetchStock/' + bataId)
        .then(response => {
            if (!response.ok) {
                loader.style.display = 'none';
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            // Update label with additional content
            var nagLabel = document.getElementById('nagLabel');
            nagLabel.innerHTML = 'नग: (Remaining : ' + data[0].closing + ' ' + data[0].unit + ')';
            document.getElementById('nag1').value = data[0].closing;
        })
        .catch(error => {
            console.error('Error:', error);
        });

}


function updateTotal() {
    if (parseInt(document.getElementById("nag").value) > parseInt(document.getElementById('nag1').value)) {
        console.log("AJAJAJ", document.getElementById('nag1').value)
        console.log("JJJJJJ", document.getElementById('nag').value)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Inventory Is not available',
        });
        document.getElementById("nag").value = 0;
    }
    document.getElementById("total").value = document.getElementById("kimmat").value * document.getElementById("nag").value
}



function getCust() {
    var number = document.getElementById('number').value;
    console.log(number)
    fetch('http://103.174.102.89:3000/fetchName/mobile/' + number)
        .then(response => {
            if (!response.ok) {
                loader.style.display = 'none';
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
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





function toggleReadonly() {
    var inputField = document.getElementById("online");

    // Check if 'readonly' is set, and toggle it
    if (inputField.hasAttribute("readonly")) {
        inputField.removeAttribute("readonly");  // Make it editable
        inputField.focus();  // Optional: Focus on the input field
    } else {
        inputField.setAttribute("readonly", true);  // Make it read-only again
    }
}



function totalBalance() {
    console.log("Hello Deva")
    var balance = parseInt(document.getElementById("bill1").value) || 0;
    var preBalance = parseInt(document.getElementById("previousBalance").value) || 0;
    var total1 = parseInt(document.getElementById("total1").value) || 0;

    fetch('http://103.174.102.89:3000/accountData/' + parseInt(document.getElementById("custid").value))
        .then(response => {
            if (!response.ok) {
                loader.style.display = 'none';
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data[0].cr_dr_type)
            if (data[0].cr_dr_type == 'no') {
                document.getElementById("total1").disabled = true;
                document.getElementById("total2").disabled = true;
                document.getElementById("totalBill").value = balance + preBalance;
            } else {
                document.getElementById("totalBill").value = total1 + balance + preBalance;
            }
            totalbill()
        })
        .catch(error => {
            console.error('Error:', error);
        });
    //document.getElementById("totalBill").value = total1 + balance + preBalance;
    //totalbill()
}

function previousbalance() {
    const name = document.getElementById("grahk").value
    console.log("Name", name)

    fetch('http://103.174.102.89:3000/fetchName/name/' + name)
        .then(response => {
            if (!response.ok) {
                loader.style.display = 'none';
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data[0].mobile_no)
            // Get the Select2 dropdown element
            var $productDropdown = $('#number');
            // Set the value of the Select2 dropdown if it's different
            if ($productDropdown.val() !== data[0].mobile_no) {
                $productDropdown.val(data[0].mobile_no).trigger('change');
            }

            var $routeDropdown = $('#Route');
            // Set the value of the Select2 dropdown if it's different
            if ($routeDropdown.val() !== data[0].route_detail) {
                $routeDropdown.val(data[0].route_detail).trigger('change');
            }
            $productDropdown.prop('disabled', true);
            $routeDropdown.prop('disabled', true);
            document.getElementById('address').value = data[0].address;
            document.getElementById('address').readOnly = true;

        })
        .catch(error => {
            console.error('Error:', error);
        });



    fetch('http://103.174.102.89:3000/fetchpv/' + name)
        .then(response => {
            if (!response.ok) {
                loader.style.display = 'none';
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            console.log(data)
            document.getElementById('custid').value = parseInt(data[0]['id']);
            document.getElementById('previousBalance').value = parseInt(data[0]['current_balance'] || 0);
            totalBalance();
            totalbill();

        })
        .catch(error => {
            console.error('Error:', error);
        });


    fetch('http://103.174.102.89:3000/carateuserData/' + name)
        .then(response => {
            if (!response.ok) {
                loader.style.display = 'none';
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdown with API data
            console.log(data)
            document.getElementById('carate2100').value = parseInt(data[0]['carate_100']);
            document.getElementById('carate2150').value = parseInt(data[0]['carate_150']);
            document.getElementById('carate2250').value = parseInt(data[0]['carate_250']);
            document.getElementById('carate2350').value = parseInt(data[0]['carate_350']);
            document.getElementById('carate22100').value = parseInt(data[0]['carate_100']);
            document.getElementById('carate22150').value = parseInt(data[0]['carate_150']);
            document.getElementById('carate22250').value = parseInt(data[0]['carate_250']);
            document.getElementById('carate22350').value = parseInt(data[0]['carate_350']);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

// Here in Carate is the carate send to the customer
// Out carate is the carate received from the customer
function carate() {
    var value100 = parseInt(document.getElementById("carate100").value) || 0;
    var value150 = parseInt(document.getElementById("carate150").value) || 0;
    var value250 = parseInt(document.getElementById("carate250").value) || 0;
    var value350 = parseInt(document.getElementById("carate350").value) || 0;
    var value1100 = parseInt(document.getElementById("carate1100").value) || 0;
    var value1150 = parseInt(document.getElementById("carate1150").value) || 0;
    var value1250 = parseInt(document.getElementById("carate1250").value) || 0;
    var value1350 = parseInt(document.getElementById("carate1350").value) || 0;


    document.getElementById("total1").value = value100 * 100 + value150 * 150 + value250 * 250 + value350 * 350;
    document.getElementById("carate2100").value = parseInt(document.getElementById("carate22100").value) + value100 - value1100;
    document.getElementById("carate2150").value = parseInt(document.getElementById("carate22150").value) + value150 - value1150;
    document.getElementById("carate2250").value = parseInt(document.getElementById("carate22250").value) + value250 - value1250;
    document.getElementById("carate2350").value = parseInt(document.getElementById("carate22350").value) + value350 - value1350;
    totalbill();
    totalBalance();
    //document.getElementById("total1").value = parseInt(document.getElementById("carate100").value) * 100 +  parseInt(document.getElementById("carate150").value) * 150 +  parseInt(document.getElementById("carate250").value) * 250 +  parseInt(document.getElementById("carate350").value) * 350
}

function carate1() {
    console.log("Data 1", document.getElementById("carate1100").value)
    console.log("Data 1", document.getElementById("carate22100").value)
    console.log("Data 2", document.getElementById("carate100").value)
    // console.log("Data 2", document.getElementById("carate2150").value)
    // console.log("Data 3", document.getElementById("carate1250").value)
    // console.log("Data 3", document.getElementById("carate2250").value)
    // console.log("Data 4", document.getElementById("carate1350").value)
    // console.log("Data 4", document.getElementById("carate2350").value)

    if (parseInt(document.getElementById("carate1100").value) > (parseInt(document.getElementById('carate22100').value) + parseInt(document.getElementById("carate100").value || 0))) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Carate limit exceed",
        });
        document.getElementById("carate1100").value = 0;
    }

    if (parseInt(document.getElementById("carate1150").value) > (parseInt(document.getElementById('carate22150').value) + parseInt(document.getElementById("carate150").value || 0))) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Carate limit exceed",
        });
        document.getElementById("carate1150").value = 0;
    }

    if (parseInt(document.getElementById("carate1250").value) > (parseInt(document.getElementById('carate22250').value) + parseInt(document.getElementById("carate250").value || 0))) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Carate limit exceed",
        });
        document.getElementById("carate1250").value = 0;
    }


    if (parseInt(document.getElementById("carate1350").value) > (parseInt(document.getElementById('carate22350').value) + parseInt(document.getElementById("carate350").value || 0))) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Carate limit exceed",
        });
        document.getElementById("carate1350").value = 0;
    }


    var value100 = parseInt(document.getElementById("carate1100").value) || 0;
    var value150 = parseInt(document.getElementById("carate1150").value) || 0;
    var value250 = parseInt(document.getElementById("carate1250").value) || 0;
    var value350 = parseInt(document.getElementById("carate1350").value) || 0;
    var value1100 = parseInt(document.getElementById("carate100").value) || 0;
    var value1150 = parseInt(document.getElementById("carate150").value) || 0;
    var value1250 = parseInt(document.getElementById("carate250").value) || 0;
    var value1350 = parseInt(document.getElementById("carate350").value) || 0;
    document.getElementById("total2").value = value100 * 100 + value150 * 150 + value250 * 250 + value350 * 350;
    document.getElementById("carate2100").value = parseInt(document.getElementById("carate22100").value) + value1100 - value100;
    document.getElementById("carate2150").value = parseInt(document.getElementById("carate22150").value) + value1150 - value150;
    document.getElementById("carate2250").value = parseInt(document.getElementById("carate22250").value) + value1250 - value250;
    document.getElementById("carate2350").value = parseInt(document.getElementById("carate22350").value) + value1350 - value350;
    totalbill();
    //document.getElementById("total1").value = parseInt(document.getElementById("carate100").value) * 100 +  parseInt(document.getElementById("carate150").value) * 150 +  parseInt(document.getElementById("carate250").value) * 250 +  parseInt(document.getElementById("carate350").value) * 350
}


function totalbill() {
    console.log("totalbill")
    console.log(document.getElementById("custid").value)

    fetch('http://103.174.102.89:3000/accountData/' + parseInt(document.getElementById("custid").value))
        .then(response => {
            if (!response.ok) {
                loader.style.display = 'none';
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data[0].cr_dr_type)
            var set = 0
            if (data[0].cr_dr_type == 'no') {
                set = parseInt(document.getElementById("totalBill").value || 0) - parseInt(document.getElementById("bill_cash").value || 0) - parseInt(document.getElementById("online").value || 0) - parseInt(document.getElementById("discount").value || 0)
                // document.getElementById("baki").value = parseInt(document.getElementById("totalBill").value || 0) - parseInt(document.getElementById("bill_cash").value || 0) - parseInt(document.getElementById("online").value || 0) - parseInt(document.getElementById("discount").value || 0);
            } else {
                set = parseInt(document.getElementById("totalBill").value || 0) - parseInt(document.getElementById("bill_cash").value || 0) - parseInt(document.getElementById("online").value || 0) - parseInt(document.getElementById("discount").value || 0) - parseInt(document.getElementById("total2").value || 0);
                // document.getElementById("baki").value = parseInt(document.getElementById("totalBill").value || 0) - parseInt(document.getElementById("bill_cash").value || 0) - parseInt(document.getElementById("online").value || 0) - parseInt(document.getElementById("discount").value || 0) - parseInt(document.getElementById("total2").value || 0);
            }
            if (set < 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Value Should be Grater than Zero",
                });

            } else {
                document.getElementById("baki").value = set
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });


    //document.getElementById("baki").value = parseInt(document.getElementById("totalBill").value || 0) - parseInt(document.getElementById("bill_cash").value || 0) - parseInt(document.getElementById("online").value || 0) - parseInt(document.getElementById("discount").value || 0) - parseInt(document.getElementById("total2").value || 0);
}


async function myFunction() {
    // event.preventDefault();
    var loader = document.getElementById('loader');
    loader.style.display = 'block';

    var formData = {
        bill_id: parseInt(document.getElementById('bill').value),
        bata: document.getElementById('bta').value,
        mark: document.getElementById('mark').value,
        product: document.getElementById('product').value,
        quantity: parseInt(document.getElementById('nag').value),
        rate: parseInt(document.getElementById('kimmat').value),
        price: parseInt(document.getElementById('total').value)
    };

    console.log(formData)

    fetch('http://103.174.102.89:3000/saleproductData/insertsaleproduct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            loader.style.display = 'none';
            console.log('Entry added successfully:', result);
            // document.getElementById('bill1').value = parseInt(document.getElementById('bill1').value || 0) + parseInt(document.getElementById('total').value);
            // totalBalance()
            // updateTable(formData, result.insertId);
            fetch('http://103.174.102.89:3000/saleproductData/' + (formData.bill_id))
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    var tableBody = document.getElementById('tableBody1');
                    tableBody.innerHTML = '';
                    // Populate dropdown with API data
                    //populateDropdown3(data);
                    document.getElementById('bill1').value = 0;
                    console.log('outside', document.getElementById('bill1').value)
                    data.forEach(function (item) {
                        updateTable(item, item.id);
                        console.log('inside', document.getElementById('bill1').value)
                        totalBalance();
                        //document.getElementById('bill1').value = parseInt(document.getElementById('bill1').value || 0) + item.price;
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            $('#product').val('').trigger('change');
            $('#bta').val('').trigger('change');
            document.getElementById('mark').value = '';
            document.getElementById('nag').value = 1;
            document.getElementById('kimmat').value = '';
            document.getElementById('total').value = '';
            var nagLabel = document.getElementById('nagLabel');
            nagLabel.innerHTML = '';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product added successfully',
        timer: 500, // 2000 ms = 2 seconds
        timerProgressBar: true, // Optional: show progress bar during the timer
        didClose: () => {
            // Optional: Perform any actions after the alert closes
            console.log("Alert closed automatically");
        }
    })
    // Add your desidarkgrey functionality here
}

function updateTable(entry, result) {
    var tableBody = document.getElementById('tableBody1');
    var newRow = document.createElement('tr');
    newRow.setAttribute('data-id', result); // Store the existing `id` from the response

    // Create row content
    newRow.innerHTML = `
        <td>${entry.product}</td>
        <td>${entry.bata}</td>
        <td>${entry.mark}</td>
        <td>${entry.quantity}</td>
        <td>${entry.rate}</td>
        <td>${entry.price}</td>
        <td>
            <button type="button" onclick="deleteUser(this, ${result}, ${entry.price})">Delete</button>
            <button type="button" onclick="editRow(this, ${result},${entry.editable})">Edit</button>
        </td>
    `;

    // Debugging: Log entry and editable flag
    console.log('Entry:', entry);
    console.log('Editable:', entry.editable);

    // Conditionally append the "Edit" button
    // if (entry.editable) {
    //     var editButton = document.createElement('button');
    //     editButton.type = 'button';
    //     editButton.textContent = 'Edit';
    //     editButton.onclick = function () {
    //         editRow(this, result);
    //     };

    //     // Append the edit button to the last cell
    //     newRow.lastElementChild.appendChild(editButton);
    // }

    // Update the bill total
    var billInput = document.getElementById('bill1');
    billInput.value = parseInt(billInput.value || 0) + entry.price;

    // Debugging: Log the updated bill total
    console.log('Updated Bill Total:', billInput.value);

    // Append the row to the table
    tableBody.appendChild(newRow);

    // Debugging: Log the table content for verification
    console.log('Updated Table HTML:', tableBody.innerHTML);
}



function deleteUser(button, userId, price) {
    // Perform delete operation based on userId
    console.log(price)
    console.log(userId)
    document.getElementById('bill1').value = parseInt(document.getElementById('bill1').value || 0) - price;
    totalBalance()
    var button = event.target;
    var row = button.parentNode.parentNode;
    fetch('http://103.174.102.89:3000/saleproductData/deletesaleproduct/' + userId, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('User deleted successfully');
            // Refresh the table or update UI as needed
            //newRow.remove();
            row.remove();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
