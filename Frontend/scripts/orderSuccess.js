document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const selectedCartItems = JSON.parse(localStorage.getItem("selectedCartItems") || "[]");
  const selectedCartIds = selectedCartItems.map(item => item.cartId);

  if (!token || selectedCartItems.length === 0) {
    window.location.href = "../pages/cart.html";
    return;
  }

  fetch("http://localhost:3000/fetch-selected-orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ selectedCartItems })
  })
    .then(response => response.json())
    .then(data => {
      if (data.orders && data.orders.length > 0) {
        updateProductQuantities(selectedCartItems)
          .then(() => deleteCartItems(selectedCartIds))
          .then(() => renderOrderSuccess(data.orders))
          .catch(error => console.error("Error during order processing:", error));
      } else {
        document.querySelector(".order-success-container").innerHTML = "<p>No orders found.</p>";
      }
    })
    .catch(error => {
      console.error("Error fetching orders:", error);
    });

  function updateProductQuantities(cartItems) {
    const updatePromises = cartItems.map(item => {
      return fetch("http://localhost:3000/update-product-quantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: item.productId,
          quantity: item.quantity,
          operation: "subtract"
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to update product quantity for productId: ${item.productId}`);
          }
          return response.json();
        })
        .then(data => console.log("Product quantity updated:", data))
        .catch(error => console.error("Error updating product quantity:", error));
    });

    return Promise.all(updatePromises);
  }

  function deleteCartItems(cartIds) {
    return fetch("http://localhost:3000/delete-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ cartId: cartIds })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to delete cart items");
        }
        return response.json();
      })
      .then(data => console.log("Cart items deleted successfully:", data))
      .catch(error => console.error("Error deleting cart items:", error));
  }

  function renderOrderSuccess(orders) {
    let totalPrice = 0;
    let orderNumbers = [];
    let deliveryItemsHTML = "";

    orders.forEach(order => {
      totalPrice += Number(order.totalPrice);
      orderNumbers.push(order.cartId);

      deliveryItemsHTML += `
        <div class="delivery-item">
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Quantity:</strong> ${order.quantity}</p>
          <p><strong>Price per unit:</strong> ₱${order.productPrice.toFixed(2)}</p>
          <p><strong>Total Price:</strong> ₱${order.totalPrice.toFixed(2)}</p>
          <img src="${order.Product && order.Product.ProductImage && order.Product.ProductImage.image ? "http://localhost:3000" + order.Product.ProductImage.image : "https://via.placeholder.com/60"}" alt="${order.Product?.productName}">
        </div>
      `;
    });

    document.getElementById("order-amount").textContent = `₱${totalPrice.toFixed(2)}`;

    const orderNumberElement = document.getElementById("order-numbers");
    if (orderNumberElement) {
      orderNumberElement.textContent = orderNumbers.join(", ");
    }

    document.getElementById("delivery-details").innerHTML = `
      <h2>Your Delivery Details</h2>
      ${deliveryItemsHTML}
      <p class="tracking-notice">
        Turn on your App Notification and track your delivery status in <strong>My Account &gt; My Order</strong>
      </p>
      <button class="view-order-btn">View Order</button>
    `;

    document.querySelector(".order-summary .final-total").textContent = `₱${totalPrice.toFixed(2)}`;
  }
});