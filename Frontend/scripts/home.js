document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found, returning to login");
    window.location.href = "../pages/login.html";
    return;
  }
  const payload = JSON.parse(atob(token.split('.')[1]));
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
      <div class="product-card" data-id="${product.productId}">
        <img 
          src="http://localhost:3000${product.image}" 
          alt="${product.productName}" 
          onerror="this.onerror=null; this.src='../assets/images/default-product.png';"
        >
        <h3>${product.productName}</h3>
        <p>₱${product.productPrice}</p>
      </div>
    `).join("");
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach(card => {
      card.addEventListener("click", () => {
        const productId = card.dataset.id;
        window.location.href = `productPage.html?productId=${productId}`;
      });
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    productContainer.innerHTML = "<p>Failed to load products.</p>";
  }
}
document.addEventListener("submit", e => e.preventDefault());
document.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") e.preventDefault();
});
