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



document.addEventListener('DOMContentLoaded', function () {
    // Get the current date
    var currentDate = new Date();
    // Format the date as mm/dd/yyyy
    var formattedDate = currentDate.getFullYear() + '-' + (String(currentDate.getMonth() + 1).padStart(2, '0')) + '-' + (String(currentDate.getDate()).padStart(2, '0'));
    // Set the placeholder of the input field to the formatted date
    console.log(formattedDate);
    document.getElementById('date').value = formattedDate;
    // Retrieve session data from localStorage
    var sessionData = JSON.parse(localStorage.getItem('sessionData'));
    // Check if session data exists and if the user is an admin
    var isAdmin = sessionData && sessionData[0].usertype === 'Admin';
    // Check if the user is an admin and show/hide the button accordingly
    if (!isAdmin) {
        document.getElementById('date').readOnly = true; // Hide the button for non-admin users
    }


    fetch('http://103.174.102.89:3000/fetchSaleid')
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
        .then(data => {
            // Populate dropdown with API data
            document.getElementById('bill').value = parseInt(data[0]['num']) + 1 || 1;
            fetch('http://103.174.102.89:3000/saleproductData/' + (parseInt(data[0]['num']) + 1) || 1)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Populate dropdown with API data
                    //populateDropdown3(data);
                    data.forEach(function (item) {
                        updateTable(item, item.id);
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                });




        })
        .catch(error => {
            console.error('Error:', error);
        });




    // Fetch data from API and populate Select2 dropdowns

    var sessionData = JSON.parse(localStorage.getItem('sessionData'));
    // Check if session data exists and if the user is an admin
    var isAdmin = sessionData && sessionData[0].usertype === 'Admin';
    // Check if the user is an admin and show/hide the button accordingly
    if (isAdmin) {
        fetchAndPopulateDropdown('http://103.174.102.89:3000/mobile', 'number', 'mobile_no');
        fetchAndPopulateDropdown('http://103.174.102.89:3000/routeData', 'Route', 'route_name');
        fetchAndPopulateDropdown('http://103.174.102.89:3000/list/Customer', 'grahk', 'name');
    } else {
        var route = sessionData[0].route;
        fetchAndPopulateDropdown('http://103.174.102.89:3000/fetchData/customerSale/' + route, 'grahk', 'name');
        fetchAndPopulateDropdown('http://103.174.102.89:3000/fetchData/customerSale/' + route, 'number', 'mobile_no');
        fetchAndPopulateDropdown('http://103.174.102.89:3000/routeData', 'Route', 'route_name', selectedValue = route, readOnly = true);
    }

    fetchAndPopulateDropdown('http://103.174.102.89:3000/purchaseproductData/product', 'product', 'product_name');
    fetchAndPopulateDropdown('http://103.174.102.89:3000/purchaseproductData/bata', 'bta', 'bata');
    fetchAndPopulateDropdown('http://103.174.102.89:3000/list/Bank Account', 'onlineAcc', 'name');

});

function fetchAndPopulateDropdown(apiUrl, dropdownId, field, selectedValue = null, readOnly = false) {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate Select2 dropdown with API data
            populateDropdownWithSelect2(data, dropdownId, field, selectedValue, readOnly);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function populateDropdownWithSelect2(data, dropdownId, field, selectedValue = null, readOnly = false) {
    var dropdown = $('#' + dropdownId);
    // Clear existing options
    dropdown.empty();

    // Add placeholder option
    dropdown.append($('<option></option>').attr('value', '').text('Select ' + dropdownId + ' type').prop('disabled', true).prop('selected', true));

    // Populate dropdown with API data
    data.forEach(function (item) {
        dropdown.append($('<option></option>').attr('value', item[field]).text(item[field]));
    });

    // Initialize Select2
    dropdown.select2({
        placeholder: 'Select components',
        closeOnSelect: false,
        allowClear: true,
        templateResult: function (data) {
            if (!data.id) {
                return data.text;
            }
            var $element = $('<span>' + data.text + '</span>');
            return $element;
        }
    });

    // Set selected value if provided
    if (selectedValue !== null) {
        dropdown.val(selectedValue).trigger('change');
    }

    // Make the dropdown read-only if specified
    if (readOnly) {
        dropdown.prop('disabled', true);
    }



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
    let modifiedBarcode = barcode.split('Bata:')[1];
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



function populateDropdown3(data) {
    var tbody = document.getElementById('tableBody1');
    tbody.innerHTML = ''; // Clear existing rows
    var columnsToDisplay = ['product', 'bata', 'mark', 'quantity', 'rate', 'price'];
    data.forEach(function (item) {
        var row = tbody.insertRow();
        columnsToDisplay.forEach(function (key) {
            var cell = row.insertCell();
            cell.textContent = item[key];
        });
        // Add Delete button
        var deleteCell = row.insertCell();
        var deleteButton = document.createElement('button');
        deleteButton.className = 'button delete-button';
        deleteButton.style.backgroundColor = '#ff355f';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            deleteUser(item.id); // Pass the user id to the delete function
        });
        deleteCell.appendChild(deleteButton);

    });
}

function deleteUser(userId) {
    // Perform delete operation based on userId
    fetch('http://103.174.102.89:3000/saleproductData/deletesaleproduct/' + userId, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('User deleted successfully');

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Sale Data is successfully Deleted',
            })
            // Refresh the table or update UI as needed
            user(); // Assuming you want to refresh the table after delete
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



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
    newRow.setAttribute('data-id', result);  // Store the existing `id` from the response
    newRow.innerHTML = `
        <td>${entry.product}</td>
        <td>${entry.bata}</td>
        <td>${entry.mark}</td>
        <td>${entry.quantity}</td>
        <td>${entry.rate}</td>
        <td>${entry.price}</td>
        <td>
            <button type="button" onclick="deleteUser(this, ${result}, ${entry.price})">Delete</button>
            <button type="button" onclick="editRow(this, ${result})">Edit</button>
        </td>
    `;
    document.getElementById('bill1').value = parseInt(document.getElementById('bill1').value || 0) + entry.price;
    totalBalance();
    tableBody.appendChild(newRow);
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
