function redirectToSignUp() {
    window.location.href = "../pages/signup.html";
}
function showModal(message, isSuccess = false) {
    const modal = document.getElementById("modal");
    const messageBox = modal.querySelector(".modal-message");

    messageBox.textContent = message;
    modal.style.display = "flex";

    if (isSuccess) {
        setTimeout(() => {
            modal.style.display = "none";
            window.location.href = "../pages/home.html";
        }, 2000);
    }
}

function hideModal() {
    document.getElementById("modal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    hideModal();
});
document.querySelector(".modal-content button").addEventListener("click", hideModal);

document.getElementById("loginform").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    console.log("Form Data before fetch:", formData);

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Login failed, status:", response.status);
            showModal(errorData.message || "Invalid email or password.");
            return;
        }

        const data = await response.json();
        localStorage.setItem("token", data.token)
        console.log("Server Response:", data);

        showModal("Login successful!", true);

    } catch (error) {
        console.error(`Error: ${error}`);
        showModal("Something went wrong. Please try again.");
    }
});
