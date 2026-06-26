
// MM Trackers Script

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cart-count");

function updateCartCount() {
    if (cartCount) {
        cartCount.innerText = cart.length;
    }
}

updateCartCount();

const featuredProducts = [
    {
        name: "ST-901A",
        price: "PKR 6,999",
        image: "images/st901a.jpg"
    },
    {
        name: "ST-901",
        price: "PKR 6,499",
        image: "images/st901.jpg"
    },
    {
        name: "ST-906",
        price: "PKR 7,499",
        image: "images/st906.jpg"
    }
];

const productContainer = document.getElementById("featured-products");

if (productContainer) {

    featuredProducts.forEach(product => {

        productContainer.innerHTML += `

        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>${product.price}</p>

            <button onclick="addToCart('${product.name}')">
                Add To Cart
            </button>

        </div>

        `;

    });

}

function addToCart(productName){

    cart.push(productName);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(productName + " added to cart.");

}
