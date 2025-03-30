document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Loaded. Initializing...");
    const addModal = document.getElementById("addProductModal");
    const updateModal = document.getElementById("updateProductModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeAddModalBtn = document.querySelector(".close");
    const closeUpdateModalBtn = document.querySelector(".close-update");
    const productForm = document.getElementById("productForm");
    const updateForm = document.getElementById("updateForm");
    const productList = document.getElementById("productList");
    const token = localStorage.getItem("token");

    function isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch (error) {
            console.error("Token parsing error:", error);
            return true;
        }
    }

    function logout() {
        console.log("Logging out...");
        if (confirm("Are you sure you want to log out?")) {
            localStorage.clear();
            window.location.href = "../index.html";
        }
    }

    if (!token || isTokenExpired(token)) {
        console.warn("Redirecting: Token is missing or expired.");
        logout();
    }

    document.getElementById("logout").addEventListener("click", logout);

    function toggleModal(modal, state) {
        modal.style.display = state ? "flex" : "none";
    }

    openModalBtn.addEventListener("click", () => toggleModal(addModal, true));
    closeAddModalBtn.addEventListener("click", () => toggleModal(addModal, false));
    closeUpdateModalBtn.addEventListener("click", () => toggleModal(updateModal, false));

    window.addEventListener("click", (event) => {
        if (event.target === addModal) toggleModal(addModal, false);
        if (event.target === updateModal) toggleModal(updateModal, false);
    });

    async function fetchProducts() {
        console.log("Fetching products...");
        try {
            const res = await fetch("http://localhost:3000/get-products", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.status === 401) {
                console.warn("Unauthorized access. Logging out...");
                logout();
                return;
            }
            const data = await res.json();
            console.log("Fetched Products:", data);
            productList.innerHTML = "";
            if (!data.products || data.products.length === 0) {
                productList.innerHTML = `
                    <div class="no-products">
                        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" alt="No Products" width="50">
                        <p>No products available.</p>
                    </div>`;
                return;
            }
            data.products.forEach(product => renderProduct(product));
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    function renderProduct(product) {
        const item = document.createElement("div");
        item.classList.add("product-item");
        item.dataset.id = product.productId;
        const productImage = product.image ? `http://localhost:3000${product.image}` : "https://via.placeholder.com/150";
        item.innerHTML = `
            <div class="product-content">
                <img src="${productImage}" alt="${product.productName}" class="product-image">
                <h4>${product.productName}</h4>
                <p>₱${product.productPrice}</p>
                <p>Stock: ${product.productStock}</p>
                <p>${product.description}</p>
                <div class="product-actions">
                    <button class="edit-btn" data-id="${product.productId}" 
                        data-name="${product.productName}" 
                        data-price="${product.productPrice}" 
                        data-stock="${product.productStock}" 
                        data-description="${product.description}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" data-id="${product.productId}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>`;
        productList.appendChild(item);
    }

    productList.addEventListener("click", async (event) => {
        const editBtn = event.target.closest(".edit-btn");
        if (editBtn) {
            const productId = editBtn.dataset.id;
            console.log("Opening Update Modal for Product:", productId);
            document.getElementById("updateProductId").value = productId;
            document.getElementById("updateProductName").value = editBtn.dataset.name;
            document.getElementById("updateProductPrice").value = editBtn.dataset.price;
            document.getElementById("updateProductStock").value = editBtn.dataset.stock;
            document.getElementById("updateProductDescription").value = editBtn.dataset.description;
            toggleModal(updateModal, true);
        }
    
        const deleteBtn = event.target.closest(".delete-btn");
        if (deleteBtn) {
            const productId = deleteBtn.dataset.id;
            console.log("Attempting to delete product:", productId);
            if (!confirm("Are you sure you want to delete this product?")) return;
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
                console.log("Delete Product Response:", data);
                if (res.ok) {
                    deleteBtn.closest(".product-item").remove();
                }
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    });

    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Submitting Add Product Form");
        const productData = {
            productName: document.getElementById("productName").value,
            productPrice: document.getElementById("productPrice").value,
            productStock: document.getElementById("productStock").value,
            productMeatType: document.getElementById("meatType").value,
            productAgeType: document.getElementById("ageCategory").value,
            productBreedType: document.getElementById("breedCategory").value,
            isHealthTreat: document.getElementById("isHealthTreat").checked,
            description: document.getElementById("productDescription").value
        };
        console.log("Submitting JSON:", productData);
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
            console.log("Add Product Response:", data);
            if (!res.ok) throw new Error("Failed to add product");
            const productId = data.productId;
            const productImageFile = document.getElementById("productImage").files[0];
            if (productImageFile && productId) {
                console.log("Uploading product image...");
                const imageFormData = new FormData();
                imageFormData.append("productId", productId);
                imageFormData.append("image", productImageFile);
                console.log("Uploading Image with FormData:", productId, productImageFile);
                const imageRes = await fetch("http://localhost:3000/upload-product-image", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` },
                    body: imageFormData
                });
                console.log("Image Upload Response:", await imageRes.json());
            }
            toggleModal(addModal, false);
            productForm.reset();
            fetchProducts();
        } catch (error) {
            console.error("Error adding product:", error);
        }
    });

    updateForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const productId = document.getElementById("updateProductId").value;
        console.log("Updating Product:", productId);
        const updateData = {
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
                body: JSON.stringify({ productId, ...updateData })
            });
            if (!res.ok) throw new Error("Failed to update product");
            console.log("Product updated successfully");
    
            const updateProductImageElement = document.getElementById("updateProductImage");
            console.log("Update Product Image Element:", updateProductImageElement);
            const productImageFile = updateProductImageElement ? updateProductImageElement.files[0] : null;
            console.log("Update Product Image File:", productImageFile);
            if (productImageFile) {
                console.log("Uploading updated product image...");
                const imageFormData = new FormData();
                imageFormData.append("productId", productId);
                imageFormData.append("image", productImageFile);
    
                const imageRes = await fetch("http://localhost:3000/upload-product-image", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` },
                    body: imageFormData
                });
    
                if (!imageRes.ok) throw new Error("Failed to upload updated image");
                console.log("Product image updated successfully");
            }
    
            toggleModal(updateModal, false);
            fetchProducts();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    });
    
    console.log("Fetching products on page load");
    fetchProducts();
});
