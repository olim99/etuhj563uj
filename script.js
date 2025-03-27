document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.getElementById("products");
    const loading = document.getElementById("loading");
    const searchInput = document.getElementById("search");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceSort = document.getElementById("priceSort");

    if (!productsContainer || !loading || !searchInput || !categoryFilter || !priceSort) {
        console.error("One or more elements are missing in the DOM.");
        return;
    }

    let products = [];

    fetch("https://fakestoreapi.com/products")
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
            populateCategories(products);
            loading.style.display = "none";
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            loading.textContent = "Failed to load products.";
        });

    function displayProducts(items) {
        productsContainer.innerHTML = "";
        items.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <strong>$${product.price}</strong>
                <span>⭐️ ${product.rating.rate} (${product.rating.count} reviews)</span>
            `;
            productsContainer.appendChild(productCard);
        });
    }

    function populateCategories(products) {
        const categories = ["all", ...new Set(products.map(p => p.category))];
        categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("\n");
    }

    searchInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        const filtered = products.filter(product => 
            product.title.toLowerCase().includes(value) || 
            product.description.toLowerCase().includes(value)
        );
        displayProducts(filtered);
    });

    categoryFilter.addEventListener("change", (e) => {
        const value = e.target.value;
        const filtered = value === "all" ? products : products.filter(p => p.category === value);
        displayProducts(filtered);
    });

    priceSort.addEventListener("change", (e) => {
        const sorted = [...products].sort((a, b) => e.target.value === "asc" ? a.price - b.price : b.price - a.price);
        displayProducts(sorted);
    });
});