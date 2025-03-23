document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("No token found. Redirecting to login page...");
        window.location.replace("../pages/login.html");
        return;
    }

    const logoutButton = document.getElementById("logoutbtn");

    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Logging out...");

            localStorage.removeItem("token");
            window.location.replace("../index.html");
        });
    } else {
        console.error("Logout button not found.");
    }
});
