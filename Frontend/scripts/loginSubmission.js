document.getElementById("loginform").addEventListener("submit", async function(event) {
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
        console.log("Form Data before fetch:", formData);

        if (!response.ok) {
            console.log("Error occurred, status response:", response.status);
            return;
        }

        const data = await response.json();
        console.log("Server Response:", data);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
});
