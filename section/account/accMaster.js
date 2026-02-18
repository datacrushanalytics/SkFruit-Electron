document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var formData = new FormData(document.getElementById("loginForm"));
    var data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    var loader = document.getElementById("loader");
    loader.style.display = "block";

    fetch("http://localhost:3000/accountData/insertaccount", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const result = await response.json();

        // ❌ Handle error responses
        if (!response.ok) {
          throw {
            status: response.status,
            message: result.message || "Something went wrong",
          };
        }

        // ✅ Success → second API call
        const form2 = {
          userName: document.getElementById("name").value,
          carate_100:
            parseInt(document.getElementById("carate2100").value) || 0,
          carate_150:
            parseInt(document.getElementById("carate2150").value) || 0,
          carate_250:
            parseInt(document.getElementById("carate2250").value) || 0,
          carate_350:
            parseInt(document.getElementById("carate2350").value) || 0,
        };

        await fetch(
          "http://localhost:3000/carateuserData/insertcarateuser",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form2),
          }
        );

        return result;
      })
      .then((result) => {
        loader.style.display = "none";

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Account is successfully added",
        });

        window.location.href = "./account.html";
      })
      .catch((error) => {
        loader.style.display = "none";

        // 🎯 Handle specific backend errors
        if (error.status === 409) {
          Swal.fire({
            icon: "warning",
            title: "Duplicate Mobile Number",
            text: error.message, // "Mobile number already exists"
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "Something went wrong",
          });
        }

        console.error("Error:", error);
      });
  });
