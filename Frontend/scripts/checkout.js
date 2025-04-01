document.addEventListener("DOMContentLoaded", function(){
  const token = localStorage.getItem("token");
  const selectedCartItems = JSON.parse(localStorage.getItem("selectedCartItems") || "[]");
  if (!token || selectedCartItems.length === 0) {
    window.location.href = "../pages/cart.html";
    return;
  }
  
  const selectedCartIds = selectedCartItems.map(item => item.cartId);

  fetch("http://localhost:3000/get-user-info", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const user = data.userInfo;
    document.getElementById("user-fullname").textContent = (user.firstname + " " + user.surname) || "No name available";
    document.getElementById("user-address").textContent = (user.UserProfile && user.UserProfile.address) || "No address available";
    document.getElementById("user-contact").textContent = (user.UserProfile && user.UserProfile.mobileNumber) || "No contact available";
  })
  .catch(error => {
    console.error("Error fetching user info:", error);
  });

  fetch("http://localhost:3000/fetch-selected-cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ cartId: selectedCartIds })
  })
  .then(response => response.json())
  .then(data => {
    renderCartItems(data.cart);
    updateOrderSummary(data.cart);
  })
  .catch(error => {
    console.error("Error fetching selected cart:", error);
  });

  function renderCartItems(cartItems) {
    const container = document.getElementById("selected-cart-items");
    container.innerHTML = "";
    cartItems.forEach(item => {
      const cartDiv = document.createElement("div");
      cartDiv.className = "cart-package";
      cartDiv.innerHTML = `
        <div class="cart-item">
          <img src="${item.Product && item.Product.ProductImage && item.Product.ProductImage.image ? "http://localhost:3000" + item.Product.ProductImage.image : "https://via.placeholder.com/60"}" alt="Product">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.productName}</div>
            <div class="cart-item-price">₱${item.productPrice}</div>
            <div class="cart-item-quantity">Quantity: ${item.quantity}</div>
          </div>
        </div>
      `;
      container.appendChild(cartDiv);
    });
  }

  function updateOrderSummary(cartItems) {
    let subtotal = 0;
    cartItems.forEach(item => {
      subtotal += parseFloat(item.productPrice) * parseInt(item.quantity);
    });
    const shippingFee = subtotal > 0 ? 50 : 0;
    const total = subtotal + shippingFee;
    document.querySelector(".order-summary .summary-line:nth-of-type(1) span:nth-of-type(2)").textContent = `₱${subtotal.toFixed(2)}`;
    document.querySelector(".order-summary .summary-line:nth-of-type(2) span:nth-of-type(2)").textContent = `₱${shippingFee.toFixed(2)}`;
    document.querySelector(".order-summary .summary-total span:nth-of-type(2)").textContent = `₱${total.toFixed(2)}`;
  }

  document.getElementById("place-order-btn").addEventListener("click", () => {
    const selectedCartItems = JSON.parse(localStorage.getItem("selectedCartItems") || "[]");
    if (selectedCartItems.length === 0) {
      alert("No selected items to order!");
      return;
    }
  
    fetch("http://localhost:3000/send-order-route", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ orderItems: selectedCartItems })
    })
    .then(response => response.json())
    .then(data => {
      window.location.href = "../pages/orderSuccess.html";
    })
    .catch(error => {
      console.error("Error updating order status:", error);
    });
  });
});
