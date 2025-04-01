document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token")
  if (!token) {
    alert("No token found, returning to login")
    window.location.href = "../pages/login.html"
    return
  }
  
  const cartTableBody = document.getElementById("cart-table-body")
  const selectAllCheckbox = document.getElementById("select-all")
  const totalItemsElement = document.querySelector(".total-items")
  
  async function fetchCart() {
    try {
      const response = await fetch("http://localhost:3000/fetch-cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error("Failed to fetch cart")
      const data = await response.json()
      renderCart(data.cart)
    } catch (error) {
      console.error("Error fetching cart:", error)
      cartTableBody.innerHTML = "<tr><td colspan='6'>Failed to load cart.</td></tr>"
    }
  }
  
  function renderCart(cartItems) {
    cartTableBody.innerHTML = ""
    cartItems.forEach(item => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td class="checkbox-col">
          <input type="checkbox" class="cart-checkbox" data-id="${item.cartId}" data-price="${item.productPrice}" data-quantity="${item.quantity}">
        </td>
        <td>
          <div class="cart-product">
            <img src="${item.Product && item.Product.ProductImage && item.Product.ProductImage.image ? 'http://localhost:3000' + item.Product.ProductImage.image : '../assets/images/sample-product.png'}" alt="Product">
            <div class="cart-product-info">
              <span class="product-title">${item.productName}</span>
              <span class="product-variation">${item.variation || ""}</span>
            </div>
          </div>
        </td>
        <td>₱${item.productPrice}</td>
        <td>
          <div class="quantity-controls">
            <button class="decrease-btn" data-id="${item.cartId}" data-product-id="${item.Product ? item.Product.productId : ''}">-</button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${item.Product ? item.Product.productStock : item.quantity}">
            <button class="increase-btn" data-id="${item.cartId}" data-product-id="${item.Product ? item.Product.productId : ''}">+</button>
          </div>
        </td>
        <td class="item-total">₱${item.totalPrice}</td>
        <td>
          <button class="delete-btn" data-id="${item.cartId}">Delete</button>
        </td>
      `
      cartTableBody.appendChild(tr)
    })
    updateTotal()
    addEventListeners()
  }
  
  function updateTotal() {
    let total = 0
    let totalQuantity = 0
    document.querySelectorAll(".cart-checkbox").forEach(checkbox => {
      if (checkbox.checked) {
        const row = checkbox.closest("tr")
        const itemTotal = parseFloat(row.querySelector(".item-total").textContent.replace("₱", ""))
        total += itemTotal
        totalQuantity += parseInt(row.querySelector(".quantity-input").value)
      }
    })
    totalItemsElement.textContent = `Total (${totalQuantity} items): ₱${total.toFixed(2)}`
  }
  
  function addEventListeners() {
    document.querySelectorAll(".cart-checkbox").forEach(checkbox => {
      checkbox.addEventListener("change", () => {
        updateTotal()
        updateSelectAllStatus()
      })
    })
    selectAllCheckbox.addEventListener("change", () => {
      const newState = selectAllCheckbox.checked
      document.querySelectorAll(".cart-checkbox").forEach(checkbox => {
        checkbox.checked = newState
      })
      updateTotal()
    })
    document.querySelectorAll(".increase-btn").forEach(button => {
      button.addEventListener("click", () => adjustQuantity(button, 1))
    })
    document.querySelectorAll(".decrease-btn").forEach(button => {
      button.addEventListener("click", () => adjustQuantity(button, -1))
    })
    document.querySelectorAll(".quantity-input").forEach(input => {
      input.addEventListener("change", () => validateAndUpdateQuantity(input))
    })
    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", () => deleteCartItem(button.dataset.id))
    })
 
    document.querySelector(".checkout-btn").addEventListener("click", () => {
      const selectedCartItems = Array.from(document.querySelectorAll(".cart-checkbox"))
        .filter(cb => cb.checked)
        .map(cb => {
          const row = cb.closest("tr");
          return {
            cartId: cb.dataset.id,
            productId: row.querySelector(".increase-btn").dataset.productId,
            productName: row.querySelector(".product-title").textContent,
            productPrice: parseFloat(cb.dataset.price),
            quantity: parseInt(row.querySelector(".quantity-input").value)
          }
        })
    
      if (selectedCartItems.length === 0) {
        alert("Please select at least one cart item to checkout")
        return
      }
      localStorage.setItem("selectedCartItems", JSON.stringify(selectedCartItems))
      window.location.href = "../pages/checkout.html"
    })
    
  }
  
  function updateSelectAllStatus() {
    const allChecked = Array.from(document.querySelectorAll(".cart-checkbox")).every(cb => cb.checked)
    selectAllCheckbox.checked = allChecked
  }
  
  async function updateCartQuantity(cartId, productId, newQuantity) {
    try {
      const response = await fetch("http://localhost:3000/update-cart-quantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ cartId, productId, quantity: newQuantity })
      })
      if (!response.ok) throw new Error("Failed to update cart quantity")
    } catch (error) {
      console.error("Error updating cart quantity:", error)
    }
  }
  
  function adjustQuantity(button, change) {
    const row = button.closest("tr")
    const input = row.querySelector(".quantity-input")
    let currentVal = parseInt(input.value)
    const minVal = parseInt(input.min)
    const maxVal = parseInt(input.max)
    let newVal = currentVal + change
    if (isNaN(newVal) || newVal < minVal) newVal = minVal
    if (newVal > maxVal) newVal = maxVal
    input.value = newVal
    updateItemTotal(row, newVal)
    const cartId = button.dataset.id
    const productId = button.dataset.productId
    updateCartQuantity(cartId, productId, newVal)
  }
  
  function validateAndUpdateQuantity(input) {
    let value = parseInt(input.value)
    const min = parseInt(input.min)
    const max = parseInt(input.max)
    if (isNaN(value) || value < min) value = min
    if (value > max) value = max
    input.value = value
    const row = input.closest("tr")
    updateItemTotal(row, value)
    const cartId = row.querySelector(".cart-checkbox").dataset.id
    const productId = row.querySelector(".increase-btn").dataset.productId
    updateCartQuantity(cartId, productId, value)
  }
  
  function updateItemTotal(row, quantity) {
    const checkbox = row.querySelector(".cart-checkbox")
    const price = parseFloat(checkbox.getAttribute("data-price"))
    const newTotal = price * quantity
    row.querySelector(".item-total").textContent = `₱${newTotal.toFixed(2)}`
    updateTotal()
  }
  
  async function deleteCartItem(cartId) {
    if (!cartId) {
      console.error("deleteCartItem called without a valid cartId")
      return
    }
    const cartIds = Array.isArray(cartId) ? cartId : [cartId]
    try {
      const response = await fetch("http://localhost:3000/delete-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ cartId: cartIds })
      })
      if (!response.ok) throw new Error("Failed to delete cart item")
      fetchCart()
    } catch (error) {
      console.error("Error deleting cart item:", error)
    }
  }
  
  fetchCart()
})
