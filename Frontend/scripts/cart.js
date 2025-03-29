document.addEventListener("DOMContentLoaded", () =>{
    console.log('Checking authentication...');
    const token = localStorage.getItem("token");

    if (!token) {
            window.alert('no token found, returning to login')
            window.location.href = "../pages/login.html"; 
    }
})