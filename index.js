const api = "https://dummyjson.com/products";

const request = new XMLHttpRequest();
request.open("GET", api);
request.send();

request.addEventListener("load", function () {
  const { products } = JSON.parse(this.responseText);
  const maindiv = document.getElementById("products");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const filterCategory = document.getElementById("filter-category");
  const sortPrice = document.getElementById("sort-price");

  // Populate categories
  const categories = [...new Set(products.map((product) => product.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    filterCategory.appendChild(option);
  });

  function renderProducts(filteredProducts) {
    let productsHTML = "";
    filteredProducts.forEach((product) => {
      productsHTML += `
        <div class="product">
          <img src="${product.thumbnail}" alt="${product.title}">
          <h2>${product.title}</h2>
          <p>Price: $${product.price}</p>
          <button class="view-item-btn" data-product-id="${product.id}">View Item</button>
        </div>
      `;
    });
    maindiv.innerHTML = productsHTML;

    // Add event listeners for "View Item" buttons
    document.querySelectorAll(".view-item-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const productId = this.getAttribute("data-product-id");
        const product = products.find((p) => p.id == productId);
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "viewitem.html";
      });
    });
  }

  function filterAndSortProducts() {
    let filteredProducts = products;

    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm)
      );
    }

    const selectedCategory = filterCategory.value;
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    const selectedSort = sortPrice.value;
    if (selectedSort) {
      filteredProducts = filteredProducts.sort((a, b) => {
        return selectedSort === "asc" ? a.price - b.price : b.price - a.price;
      });
    }

    renderProducts(filteredProducts);
  }

  renderProducts(products);

  searchBtn.addEventListener("click", filterAndSortProducts);
  filterCategory.addEventListener("change", filterAndSortProducts);
  sortPrice.addEventListener("change", filterAndSortProducts);
});
