document.addEventListener("DOMContentLoaded", function () {
    let isVerified = false;

    function validateInput(input, condition) {
        if (condition) {
            input.style.border = "2px solid rgb(255, 10, 10)"; 
        } else {
            input.style.border = "1px solid #333";
        }
    }

    const fullname = document.getElementById("fullname");
    const email = document.getElementById("email");
    const code = document.getElementById("code");
    const password = document.getElementById("password");

    fullname.addEventListener("input", function () {
        validateInput(fullname, fullname.value.length < 5);
    });

    email.addEventListener("input", function () {
        validateInput(email, !email.validity.valid);
    });

    code.addEventListener("input", function () {
        validateInput(code, code.value.length !== 6 || isNaN(code.value));
    });

    password.addEventListener("input", function () {
        validateInput(password, password.value.length < 8);
    });

    window.sendCode = async function () {
        if (!email.value.trim()) {
            showModal("Email is required to send verification code.", "warning");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: email.value.trim() })
            });

            if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);

            showModal("Verification code sent successfully!", "success");
        } catch (error) {
            showModal("Failed to send verification code.", "error");
        }
    };

    window.verifyCode = async function () {
        if (!email.value.trim() || !code.value.trim()) {
            showModal("Both email and code are required.", "warning");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: email.value.trim(), code: Number(code.value.trim()) })
            });

            if (!response.ok) {
                showModal("Incorrect verification code.", "error");
                isVerified = false;
            } else {
                showModal("Code verified successfully!", "success");
                isVerified = true;
            }
        } catch (error) {
            showModal("Code verification failed.", "error");
            isVerified = false;
        }
    };

    document.getElementById("signupform").addEventListener("submit", async function (event) {
        event.preventDefault();

        let isValid = true;

        if (fullname.value.length < 5) {
            validateInput(fullname, true);
            isValid = false;
        }

        if (!email.validity.valid) {
            validateInput(email, true);
            isValid = false;
        }

        if (code.value.length !== 6 || isNaN(code.value)) {
            validateInput(code, true);
            isValid = false;
        }

        if (password.value.length < 8) {
            validateInput(password, true);
            isValid = false;
        }

        if (!isValid) {
            showModal("Please correct the highlighted fields.", "error");
            return;
        }

        if (!isVerified) {
            showModal("Please verify your code before signing up.", "warning");
            return;
        }

        const formData = {
            fullname: fullname.value.trim(),
            email: email.value.trim(),
            password: password.value
        };

        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                showModal("Sign-up failed. Please try again.", "error");
            } else {
                showModal("✅ Sign-up successful!", "success");
            }
        } catch (error) {
            showModal("Sign-up failed. Please try again.", "error");
        }
    });

    document.getElementById("loginBtn").addEventListener("click", function () {
        window.location.href = "../pages/login.html";
    });

    function showModal(message, type) {
        const modal = document.getElementById("modal");
        const modalMessage = document.getElementById("modal-message");

        modalMessage.textContent = message;
        modal.classList.remove("success", "error", "warning");
        modal.classList.add(type);
        modal.style.display = "flex";
    }

    window.closeModal = function () {
        document.getElementById("modal").style.display = "none";
    };
});
