document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("No token found. Redirecting to login page.");
        alert("Please log in to access admin orders.");
        window.location.href = "../pages/login.html";
        return;
    }

    try {
        console.log("Fetching admin orders from the backend...");
        const response = await fetch("http://localhost:3000/get-all-orders-admin", {
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

        const orders = data.orders;
        console.log("Extracted orders:", orders);
        const ordersTableBody = document.querySelector(".admin-orders-table tbody");
        ordersTableBody.innerHTML = ""; // Clear existing rows

        if (orders.length === 0) {
            console.log("No orders found.");
            const noOrdersMessage = document.createElement("tr");
            noOrdersMessage.innerHTML = `<td colspan="6" style="text-align: center;">No orders found.</td>`;
            ordersTableBody.appendChild(noOrdersMessage);
            return;
        }

        orders.forEach(order => {
            console.log("Rendering order:", order);

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${order.User.firstname} ${order.User.surname}</td>
                <td>${order.Product.productName}</td>
                <td>₱${order.Product.productPrice.toFixed(2)}</td>
                <td>${order.quantity}</td>
                <td>₱${order.totalPrice.toFixed(2)}</td>
                <td>
                    <button class="approve-btn" data-order-id="${order.orderId}">Approve</button>
                    <button class="delete-btn" data-order-id="${order.orderId}">Delete</button>
                </td>
            `;

            ordersTableBody.appendChild(row);
        });

        // Add event listeners for Approve and Delete buttons
        document.querySelectorAll(".approve-btn").forEach(button => {
            button.addEventListener("click", async (event) => {
                const orderId = event.target.getAttribute("data-order-id");
                console.log(`Approving order ID: ${orderId}`);
                await handleApproveOrder(orderId);
            });
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async (event) => {
                const orderId = event.target.getAttribute("data-order-id");
                console.log(`Deleting order ID: ${orderId}`);
                await handleDeleteOrder(orderId);
            });
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        alert("An error occurred while fetching orders. Please try again later.");
    }
});

// Function to handle order approval
async function handleApproveOrder(orderId) {
    try {
        const response = await fetch("http://localhost:3000/approve-orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ orderIds: [orderId] }) // Send the orderId as part of an array
        });

        if (!response.ok) {
            throw new Error("Failed to approve order.");
        }

        const data = await response.json();
        console.log(`Order ID ${orderId} approved:`, data);

        alert(`Order ID ${orderId} approved successfully!`);
        window.location.reload(); // Reload the page to refresh the table
    } catch (error) {
        console.error(`Error approving order ID ${orderId}:`, error);
        alert("An error occurred while approving the order. Please try again.");
    }
}

// Function to handle order deletion
async function handleDeleteOrder(orderId) {
    try {
        const response = await fetch(`http://localhost:3000/delete-order/${orderId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to delete order.");
        }

        const data = await response.json();
        console.log(`Order ID ${orderId} deleted:`, data);

        alert(`Order ID ${orderId} deleted successfully!`);
        window.location.reload(); // Reload the page to refresh the table
    } catch (error) {
        console.error(`Error deleting order ID ${orderId}:`, error);
        alert("An error occurred while deleting the order. Please try again.");
    }
}