document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please log in to view your orders.");
        window.location.href = "../pages/login.html";
        return;
    }

    const ordersTableBody = document.querySelector(".orders-table tbody");
    const noOrdersMessage = document.querySelector(".no-orders-message");
    const rateModal = document.getElementById("rate-modal");
    const closeModalBtn = document.querySelector(".close-btn");
    const stars = document.querySelectorAll(".star");
    const likeButton = document.getElementById("thumbs-up");
    const submitRatingBtn = document.getElementById("submit-rating");
    const commentInput = document.getElementById("rate-comment");
    const charCountLabel = document.getElementById("char-count");
    let selectedRating = 0;

    async function fetchAndRenderOrders() {
        try {
            const response = await fetch("http://localhost:3000/get-orders", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch orders.");
            }

            const data = await response.json();
            const orders = data.orders;
            ordersTableBody.innerHTML = "";

            if (orders.length === 0) {
                noOrdersMessage.style.display = "block";
                return;
            }

            noOrdersMessage.style.display = "none";

            orders.forEach(order => {
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
                    <td>
                        <button class="cancel-btn" data-order-id="${order.orderId}">Cancel</button>
                        ${
                            order.orderStatus === "Order Received"
                                ? `<button class="rate-btn" data-product-id="${order.Product.productId}">Rate</button>`
                                : ""
                        }
                    </td>
                `;

                ordersTableBody.appendChild(row);
            });

            document.querySelectorAll(".cancel-btn").forEach(button => {
                button.addEventListener("click", async (event) => {
                    const orderId = event.target.getAttribute("data-order-id");
                    await handleCancelOrder(orderId);
                });
            });

            document.querySelectorAll(".rate-btn").forEach(button => {
                button.addEventListener("click", (event) => {
                    const productId = event.target.getAttribute("data-product-id");
                    openRateModal(productId);
                });
            });
        } catch (error) {
            alert("An error occurred while fetching your orders. Please try again later.");
        }
    }

    async function handleCancelOrder(orderId) {
        try {
            const cancelResponse = await fetch(`http://localhost:3000/cancel-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ orderId })
            });

            if (!cancelResponse.ok) {
                throw new Error("Failed to cancel order.");
            }

            alert(`Order ID ${orderId} canceled successfully!`);
            await fetchAndRenderOrders();
        } catch (error) {
            alert("An error occurred while canceling the order. Please try again.");
            console.error(error);
        }
    }

    function openRateModal(productId) {
        rateModal.style.display = "flex";
        rateModal.setAttribute("data-product-id", productId);
        charCountLabel.textContent = "0/60";
    }

    function closeRateModal() {
        rateModal.style.display = "none";
        selectedRating = 0;
        stars.forEach(star => star.classList.remove("selected"));
        likeButton.classList.remove("active");
        commentInput.value = "";
        charCountLabel.textContent = "";
    }

    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = parseInt(star.getAttribute("data-value"));
            stars.forEach(s => s.classList.remove("selected"));
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add("selected");
            }
        });
    });

    likeButton.addEventListener("click", () => {
        likeButton.classList.toggle("active");
    });

    commentInput.addEventListener("input", () => {
        const currentLength = commentInput.value.length;
        if (currentLength > 60) {
            commentInput.value = commentInput.value.slice(0, 60);
        }
        charCountLabel.textContent = `${currentLength}/60`;
    });

    submitRatingBtn.addEventListener("click", async () => {
        const productId = rateModal.getAttribute("data-product-id");
        const comment = commentInput.value;
        const liked = likeButton.classList.contains("active");

        try {
            const response = await fetch(`http://localhost:3000/product-review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId,
                    userid: getUserIdFromToken(token),
                    rating: selectedRating,
                    reviewText: comment,
                    liked
                })
            });

            if (!response.ok) {
                throw new Error("Failed to submit review.");
            }

            alert("Review submitted successfully!");
            closeRateModal();
        } catch (error) {
            alert("An error occurred while submitting the review. Please try again.");
        }
    });

    closeModalBtn.addEventListener("click", closeRateModal);

    window.addEventListener("click", (event) => {
        if (event.target === rateModal) {
            closeRateModal();
        }
    });

    function getUserIdFromToken(token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.userid;
    }

    await fetchAndRenderOrders();

    setInterval(fetchAndRenderOrders, 5000);
});