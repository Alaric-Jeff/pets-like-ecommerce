document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

  if (!token) {
      console.log("No token found. Redirecting to login page.");
      alert("Please log in to view your orders.");
      window.location.href = "../pages/login.html";
      return;
  }

  try {
      console.log("Fetching orders from the backend...");

      // Fetch orders from the backend
      const response = await fetch("http://localhost:3000/get-orders", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          }
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
          console.error("Failed to fetch orders. Response:", response);
          throw new Error("Failed to fetch orders.");
      }

      const data = await response.json();
      console.log("Orders fetched:", data);

      const orders = data.orders; // Extract the orders array
      console.log("Extracted orders:", orders);

      // Render orders in the table
      const ordersTableBody = document.querySelector(".orders-table tbody");
      ordersTableBody.innerHTML = ""; // Clear existing rows

      if (orders.length === 0) {
          console.log("No orders found.");
          const noOrdersMessage = document.querySelector(".no-orders-message");
          noOrdersMessage.style.display = "block";
          return;
      }

      orders.forEach(order => {
          console.log("Order image:", order.Product?.ProductImage?.image);

          const row = document.createElement("tr");

          row.innerHTML = `
              <td class="product-info">
                  <img src="${order.Product?.ProductImage?.image ? `http://localhost:3000${order.Product.ProductImage.image}` : '../assets/images/placeholder.png'}" alt="${order.productName}">
                  <span>${order.productName}</span>
              </td>
              <td>₱${order.productPrice.toFixed(2)}</td>
              <td>${order.quantity}</td>
              <td>₱${order.totalPrice.toFixed(2)}</td>
              <td><span class="status ${order.orderStatus.toLowerCase()}">${order.orderStatus}</span></td>
              <td>${new Date(order.updatedAt).toLocaleDateString()} ${new Date(order.updatedAt).toLocaleTimeString()}</td>
          `;

          ordersTableBody.appendChild(row);
      });
  } catch (error) {
      console.error("Error fetching orders:", error);
      alert("An error occurred while fetching your orders. Please try again later.");
  }
});