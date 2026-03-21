function getElementValueWithDefault(id, defaultValue) {
  var element = document.getElementById(id);
  return element && element.value ? element.value : defaultValue;
}

function formatDate(dateString) {
  var date = new Date(dateString);
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  return year + "-" + month + "-" + day;
}

document
  .getElementById("loginForm1")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    fetchDataAndProcess();
  });

function fetchDataAndProcess() {
  var data = {
    from_date: formatDate(document.getElementById("fromdate").value),
    to_date: formatDate(document.getElementById("todate").value),
    supplier_name: getElementValueWithDefault("supplier", "*"),
  };
  console.log(data);
  var loader = document.getElementById("loader");
  loader.style.display = "block";

  return fetch("http://192.168.1.19:3000/supplierLedger", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      loader.style.display = "none";
      if (response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No data found.",
        });

        throw new Error("Data not found");
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      console.log(result);
      populateTable4(result);
      // populateTable5(result);
      return result;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function populateTable4(data) {
  var tbody = document.getElementById("tableBody");
  tbody.innerHTML = ""; // Clear existing rows

  var columnsToDisplay = [
    "record_id",
    "type",
    "date",
    "account_name",
    "mobile_no",
    "reference",
    "amount",
    "expenses",
    "cash",
    "from_account",
    "online",
    "discount",
    "prev_balance",
    "comment",
  ];
  var counter = 1;
  console.log(data.reports);

  if (data.reports.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No data found.",
    });
  }

  let grandTotalQuantity = 0;
  let lastBalance = 0; // Variable to store the last balance value
  var isSuperAdmin =
    JSON.parse(localStorage.getItem("sessionData"))[0].status === "Super";
  data.reports.forEach(function (item, index) {
    var row = tbody.insertRow();
    var cell = row.insertCell();
    cell.textContent = counter++;

    columnsToDisplay.forEach(function (key) {
      var cell = row.insertCell();
      if (key === "date") {
        var utcDate = new Date(item[key]);
        var options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "Asia/Kolkata",
        };
        cell.textContent = utcDate.toLocaleString("en-IN", options);
      } else {
        cell.textContent = item[key];

        // Store the balance value of the last row
        if (key === "prev_balance") {
          lastBalance = item[key];
        }
      }
    });

    // Add Delete button if user is admin
    if (isSuperAdmin && index !== 0) {
      var deleteCell = row.insertCell();
      var deleteButton = document.createElement("button");
      deleteButton.className = "button delete-button";
      deleteButton.style.backgroundColor = "#ff355f";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        // deleteaccount(item.receipt_id); // Pass the user id to the delete function
        // SweetAlert2 confirmation dialog
        Swal.fire({
          title: "Are you sure?",
          text: "Do you really want to delete this user?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            // Use record type to decide delete function
            if (item.type === "purchase") {
              deletePurchase(item.record_id);
            } else if (item.type === "payment") {
              deletePayment(item.record_id);
            } else {
              Swal.fire("Error", "Unknown record type: " + item.type, "error");
            }
            // Optional: Show success message
            Swal.fire("Deleted!", "The Product has been deleted.", "success");
          }
        });
      });
      deleteCell.appendChild(deleteButton);
    }
  });

  // Append grand total row
  var row = tbody.insertRow();
  row.insertCell().textContent = ""; // Empty cell for serial number
  row.insertCell().textContent = ""; // Empty cell for date
  row.insertCell().textContent = ""; // Empty cell for supplier_name
  row.insertCell().textContent = ""; // Empty cell for gadi_number
  row.insertCell().textContent = ""; // Empty cell for gadi_number
  row.insertCell().textContent = ""; // Empty cell for gadi_number
  row.insertCell().textContent = ""; // Empty cell for gadi_number
  row.insertCell().textContent = ""; // Empty cell for gadi_number
  row.insertCell().textContent = ""; // Empty cell for gadi_number
  row.insertCell().textContent = ""; // Empty cell for gadi_number
  row.insertCell().textContent = ""; // Empty cell for gadi_number
  row.insertCell().textContent = ""; // Empty cell for gadi_number

  // Cell for Grand Total label
  var labelCell = row.insertCell();
  labelCell.textContent = "Net Balance:";
  labelCell.style.fontWeight = "bold"; // Make label text bold

  // Cell for Grand Total value
  var valueCell = row.insertCell();
  valueCell.textContent = lastBalance; // Display the last balance value
  valueCell.style.fontWeight = "bold"; // Make value text bold
}

function deletePurchase(userId) {
  // Perform delete operation based on userId
  fetch(
    "http://192.168.1.19:3000/purchaseReport/deletePurchaseReport/" + userId,
    {
      method: "DELETE",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Record is successfully Deleted",
      });
      console.log("Record deleted successfully");
      // Refresh the table or update UI as needed
      fetchDataAndProcess(); // Assuming you want to refresh the table after delete
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function deletePayment(userId) {
  // Perform delete operation based on userId
  fetch("http://192.168.1.19:3000/paymentData/deletePayment/" + userId, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Record is successfully Deleted",
      });
      console.log("Record deleted successfully");
      // Refresh the table or update UI as needed
      fetchDataAndProcess(); // Assuming you want to refresh the table after delete
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function exportToExcel() {
  try {
    const data = await fetchDataAndProcess();

    var loader = document.getElementById("loader");
    loader.style.display = "block";

    return fetch("http://192.168.1.19:3000/supplierLedger/generate-pdf", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 404) {
          loader.style.display = "none";
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No data found.",
          });

          throw new Error("Data not found");
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob(); // Get the response as a Blob
      })
      .then((blob) => {
        loader.style.display = "none";

        // Create a URL for the Blob and trigger a download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "supplierLedgerReport.pdf"; // Set the desidarkgrey file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url); // Release the URL

        console.log("PDF downloaded successfully");
      })
      .catch((error) => {
        loader.style.display = "none";
        console.error("Error:", error);

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error generating PDF. Please try again.",
        });
      });
  } catch (error) {
    console.error("Error:", error);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error generating PDF. Please try again.",
    });
  }
}
