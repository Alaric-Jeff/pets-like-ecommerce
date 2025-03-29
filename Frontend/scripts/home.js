document.addEventListener("DOMContentLoaded", () => {
    console.log("Checking authentication...");
    const token = localStorage.getItem("token");

    if (!token) {
        alert("No token found, returning to login");
        window.location.href = "../pages/login.html";
        return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.role === "admin") {
        window.location.href = "../pages/admin.html";
        return;
    }

    fetchProducts(token);
});

async function fetchProducts(token) {
    const productContainer = document.querySelector(".dynamic-products");
    if (!productContainer) return;

    try {
        const response = await fetch("http://localhost:3000/get-products", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch products");

        const { products } = await response.json();
        productContainer.innerHTML = products.map(product => `
            <div class="product-card">
                <img 
                    src="http://localhost:3000${product.image}" 
                    alt="${product.productName}" 
                    onerror="this.onerror=null; this.src='../assets/images/default-product.png';"
                >
                <h3>${product.productName}</h3>
                <p>₱${product.productPrice}</p>
                <div class="product-actions">
                    <button><i class="fas fa-cart-plus"></i></button>
                    <button><i class="fas fa-shopping-bag"></i></button>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error("Error fetching products:", error);
        productContainer.innerHTML = "<p>Failed to load products.</p>";
    }
}

document.addEventListener("submit", e => e.preventDefault());
document.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") e.preventDefault();
});
