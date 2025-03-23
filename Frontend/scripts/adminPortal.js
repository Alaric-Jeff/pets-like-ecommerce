document.addEventListener("DOMContentLoaded", () => {
    const addModal = document.getElementById("addProductModal");
    const updateModal = document.getElementById("updateProductModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeAddModalBtn = document.querySelector(".close");
    const closeUpdateModalBtn = document.querySelector(".close-update");
    const productForm = document.getElementById("productForm");
    const updateForm = document.getElementById("updateForm");
    const productList = document.getElementById("productList");

    document.getElementById("logout").addEventListener("click", logout);

    const token = localStorage.getItem("token");

    function isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); 
            return payload.exp * 1000 < Date.now(); 
        } catch (error) {
            return true; 
        }
    }

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        window.location.href = "../index.html"; 
    }

    function logout() {
        if (confirm("Are you sure you want to log out?")) { 
            localStorage.clear(); 
            window.location.href = "../index.html"; 
        }
    }

    addModal.style.display = "none";
    updateModal.style.display = "none";

    openModalBtn.addEventListener("click", () => {
        addModal.style.display = "flex";
    });

    closeAddModalBtn.addEventListener("click", () => {
        addModal.style.display = "none";
    });

    closeUpdateModalBtn.addEventListener("click", () => {
        updateModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === addModal) addModal.style.display = "none";
        if (event.target === updateModal) updateModal.style.display = "none";
    });

    async function fetchProducts() {
        try {
            const res = await fetch("http://localhost:3000/get-products", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();

            productList.innerHTML = "";

            if (!data.products || data.products.length === 0) {
                productList.innerHTML = ` 
                    <div class="no-products">
                        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" alt="No Products" width="50">
                        <p>No products available.</p>
                    </div>`;
                return;
            }

            data.products.forEach(product => {
                const item = document.createElement("div");
                item.classList.add("product-item");

                item.innerHTML = `
                    <div class="product-content" data-id="${product.productId}">
                        <h4>${product.productName}</h4>
                        <p>₱${product.productPrice}</p>
                        <p>Stock: ${product.productStock}</p>
                        <p>${product.description}</p>
                        <div class="product-actions">
                            <button class="edit-btn" data-id="${product.productId}" data-name="${product.productName}" 
                                    data-price="${product.productPrice}" data-stock="${product.productStock}" 
                                    data-description="${product.description}">
                                <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="Edit" width="16">
                            </button>
                            <button class="delete-btn" data-id="${product.productId}">
                                <img src="https://cdn-icons-png.flaticon.com/512/1345/1345874.png" alt="Delete" width="16">
                            </button>
                        </div>
                    </div>`;

                productList.appendChild(item);
            });

        } catch (error) {
            alert("Error fetching products: " + error.message);
        }
    }

    fetchProducts();

    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const productData = {
            productName: document.getElementById("productName").value,
            productPrice: document.getElementById("productPrice").value,
            productStock: document.getElementById("productStock").value,
            productMeatType: document.getElementById("meatType").value,
            productAgeType: document.getElementById("ageCategory").value,
            productBreedType: document.getElementById("breedCategory").value,
            isHealthTreat: document.getElementById("isHealthTreat").checked,
            description: document.getElementById("productDescription").value.trim() || "Description Unavailable"
        };

        try {
            const res = await fetch("http://localhost:3000/add-product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            const data = await res.json();
            alert(data.message);

            if (res.ok) {
                addModal.style.display = "none";
                fetchProducts();
                productForm.reset();
            }
        } catch (error) {
            alert("Error adding product: " + error.message);
        }
    });

    productList.addEventListener("click", async (event) => {
        if (event.target.closest(".edit-btn")) {
            const editButton = event.target.closest(".edit-btn");
            document.getElementById("updateProductId").value = editButton.dataset.id;
            document.getElementById("updateProductName").value = editButton.dataset.name;
            document.getElementById("updateProductPrice").value = editButton.dataset.price;
            document.getElementById("updateProductStock").value = editButton.dataset.stock;
            document.getElementById("updateProductDescription").value = editButton.dataset.description;

            updateModal.style.display = "flex";
        }

        if (event.target.closest(".delete-btn")) {
            const productId = event.target.closest(".delete-btn").dataset.id;

            if (confirm("Are you sure you want to delete this product?")) {
                try {
                    const res = await fetch("http://localhost:3000/delete-product", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ productId })
                    });

                    const data = await res.json();
                    alert(data.message);

                    if (res.ok) fetchProducts();
                } catch (error) {
                    alert("Error deleting product: " + error.message);
                }
            }
        }
    });

    updateForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedProduct = {
            productId: document.getElementById("updateProductId").value,
            productName: document.getElementById("updateProductName").value,
            productPrice: document.getElementById("updateProductPrice").value,
            productStock: document.getElementById("updateProductStock").value,
            description: document.getElementById("updateProductDescription").value
        };

        try {
            const res = await fetch("http://localhost:3000/update-product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedProduct)
            });

            const data = await res.json();
            alert(data.message);

            if (res.ok) {
                updateModal.style.display = "none";
                fetchProducts();
            }
        } catch (error) {
            alert("Error updating product: " + error.message);
        }
    });
});
