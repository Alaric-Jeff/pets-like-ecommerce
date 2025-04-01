document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found, returning to login");
    window.location.href = "../pages/login.html";
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("productId");
  if (productId) {
    fetchProduct(productId);
    fetchReviews(productId);
  }
});

async function fetchProduct(productId) {
  try {
    const res = await fetch(`http://localhost:3000/display-product/${productId}`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch product");
    const data = await res.json();
    const product = data.product;
    if (!product) {
      alert("Product not found.");
      return;
    }
    if (product.ProductImage && product.ProductImage.image) {
      document.querySelector(".product-image").src = "http://localhost:3000" + product.ProductImage.image;
    }
    document.querySelector(".product-name").textContent = product.productName;
    document.querySelector(".product-price").textContent = "Price: ₱" + product.productPrice;
    document.querySelector(".product-description").textContent = "Description: " + product.description;
    const stockElement = document.querySelector(".stock-info");
    stockElement.textContent = product.productStock + " pieces available";
    const quantityInput = document.querySelector(".quantity-input");
    quantityInput.max = product.productStock;
    quantityInput.addEventListener("change", function () {
      let value = parseInt(quantityInput.value);
      const min = parseInt(quantityInput.min);
      const max = parseInt(quantityInput.max);
      if (isNaN(value) || value < min) {
        quantityInput.value = min;
      } else if (value > max) {
        quantityInput.value = max;
      }
    });
    if (product.category) {
      document.querySelector(".product-category").textContent = "Category: " + product.category;
    }
    document.querySelector(".minus-btn").addEventListener("click", function () {
      const currentVal = parseInt(quantityInput.value);
      if (currentVal > 1) {
        quantityInput.value = currentVal - 1;
      }
    });
    document.querySelector(".plus-btn").addEventListener("click", function () {
      const currentVal = parseInt(quantityInput.value);
      const maxVal = parseInt(quantityInput.max);
      if (currentVal < maxVal) {
        quantityInput.value = currentVal + 1;
      }
    });
    document.querySelector(".add-to-cart").addEventListener("click", function () {
      addToCart(product, parseInt(document.querySelector(".quantity-input").value));
    });
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}

async function fetchReviews(productId) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:3000/get-reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    });
    if (!res.ok) throw new Error("Failed to fetch reviews");
    const data = await res.json();

    // Debugging log to inspect the structure of the data
    console.log("Reviews data received from backend:", data.reviews);

    const reviewsContainer = document.querySelector(".reviews-container");
    reviewsContainer.innerHTML = "";
    if (!data.reviews || data.reviews.length === 0) {
      reviewsContainer.innerHTML = "<p>No reviews available.</p>";
      return;
    }
    data.reviews.forEach(function (review) {
      const reviewEl = document.createElement("div");
      reviewEl.classList.add("review");

      // Debugging log to inspect each review object
      console.log("Review object:", review);

      const reviewerName = review.User
        ? `${review.User.firstname} ${review.User.surname}`
        : "Anonymous";
      reviewEl.innerHTML =
        `<p class="reviewer-name">${reviewerName}</p>` +
        `<p class="review-text">${review.reviewText}</p>` +
        `<p class="review-rating">Rating: ${review.rating}/5</p>`;
      reviewsContainer.appendChild(reviewEl);
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
}

async function addToCart(product, quantity) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found, please login");
    window.location.href = "../pages/login.html";
    return;
  }
  try {
    const cartData = {
      productId: product.productId,
      productPrice: product.productPrice,
      productName: product.productName,
      quantity: quantity
    };
    const res = await fetch("http://localhost:3000/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(cartData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to add product to cart");
    alert(data.message);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    alert("Error adding product to cart");
  }
}