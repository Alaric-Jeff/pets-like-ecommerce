document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutbtn"); 

    if (logoutButton) {
        console.log("Logout button found.");
        logoutButton.addEventListener("click", function (event) {
            event.preventDefault(); 
            console.log("Logout button clicked!");

            localStorage.clear();
            console.log("Redirecting to home page...");
            
            window.location.replace("../index.html"); 
        });
    } else {
        console.error("Logout button not found.");
    }
});
