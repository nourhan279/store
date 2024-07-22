document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.getElementById("cart-items");
  const totalPriceContainer = document.getElementById("total-price");

  function updateCartDisplay() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      totalPriceContainer.innerHTML = "Total Price: $0";
      return;
    }

    const itemQuantities = cart.reduce((acc, item) => {
      acc[item.id] = (acc[item.id] || 0) + item.quantity;
      return acc;
    }, {});

    let cartHTML = "";
    let totalPrice = 0;

    Object.keys(itemQuantities).forEach((id) => {
      const item = cart.find((item) => item.id == id);
      const quantity = itemQuantities[id];
      totalPrice += item.price * quantity;

      cartHTML += `
          <div class="cart-item">
            <img src="${item.thumbnail}" alt="${item.title}" class="cart-item-img">
            <h2>${item.title}</h2>
            <p>Price: $${item.price}</p>
            <div class="quantity-controls">
              <button class="btn-increase" data-product-id="${item.id}">+</button>
              <span class="item-quantity">${quantity}</span>
              <button class="btn-decrease" data-product-id="${item.id}">-</button>
              <button class="btn-delete" data-product-id="${item.id}">Delete</button>
            </div>
          </div>
          `;
    });

    cartContainer.innerHTML = cartHTML;
    totalPriceContainer.innerHTML = `Total Price: $${totalPrice.toFixed(2)}`;

    document.querySelectorAll(".btn-increase").forEach((btn) => {
      btn.addEventListener("click", function () {
        updateItemQuantity(this.getAttribute("data-product-id"), 1);
      });
    });

    document.querySelectorAll(".btn-decrease").forEach((btn) => {
      btn.addEventListener("click", function () {
        updateItemQuantity(this.getAttribute("data-product-id"), -1);
      });
    });

    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", function () {
        deleteItem(this.getAttribute("data-product-id"));
      });
    });
  }

  function updateItemQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let itemFound = false;

    cart = cart
      .map((item) => {
        if (item.id == productId) {
          itemFound = true;
          item.quantity = (item.quantity || 1) + change;
          if (item.quantity <= 0) return null;
        }
        return item;
      })
      .filter(Boolean);

    if (!itemFound && change > 0) {
      // If item was not found and change is positive, add it
      const product = JSON.parse(localStorage.getItem("products")).find(
        (p) => p.id == productId
      );
      if (product) {
        cart.push({ ...product, quantity: 1 });
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  }

  function deleteItem(productId) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this item from your cart?"
    );

    if (confirmDelete) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter((item) => item.id !== parseInt(productId));
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartDisplay();
    }
  }
  updateCartDisplay();
});
