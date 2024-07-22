document.addEventListener("DOMContentLoaded", function () {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!product) {
    document.getElementById("product-details").innerHTML =
      "<p>No product selected.</p>";
    return;
  }

  const productHTML = `
      <div class="card">
        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
        <div class="card-body">
          <h1 class="card-title">${product.title}</h1>
          <p class="card-text">${product.description}</p>
          <p class="card-text">Price: $${product.price}</p>
          <p class="card-text">Brand: ${product.brand}</p>
          <p class="card-text mb-4">Category: ${product.category}</p>
          <a href="index.html" class="btn btn-primary">Back to Products</a>
          <a href="#" id="additem" class="btn btn-primary ml-4">Add To Cart</a>
        </div>
      </div>
    `;

  document.getElementById("product-details").innerHTML = productHTML;

  // Adding an item to the cart
  const addItemBtn = document.getElementById("additem");
  addItemBtn.addEventListener("click", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productExists = cart.find((cartItem) => cartItem.id === product.id);

    if (productExists) {
      alert("This item is already in your cart.");
    } else {
      let res = confirm("Are you sure to add this item to your cart?");
      if (res) {
        cart.push({ ...product, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Item added to cart");
        window.location.href = "cart.html";
      }
    }
  });
});
