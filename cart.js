// Get cart
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add product
function addToCart(product) {

    let cart = getCart();

    let existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.qty++;
    } else {
        product.qty = 1;
        cart.push(product);
    }

    saveCart(cart);

updateCartCount();

alert(product.name + " added to cart.");
}

// Show cart on cart.html
function displayCart() {

    const cartContainer = document.getElementById("cart-items");

    if (!cartContainer) return;

    let cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    let html = "";
    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.qty;

        html += `
        <div class="cart-item">

            <img src="${item.image}" width="120">

            <div>

                <h3>${item.name}</h3>

                <p>Rs. ${item.price.toLocaleString()}</p>

                <p>Quantity : ${item.qty}</p>

                <button onclick="removeItem(${index})">
                    Remove
                </button>

            </div>

        </div>

        <hr>
        `;
    });

    html += `<h2>Total : Rs. ${total.toLocaleString()}</h2>`;

    cartContainer.innerHTML = html;
}

// Remove item
function removeItem(index){

    let cart = getCart();

    cart.splice(index,1);

    saveCart(cart);

    displayCart();

}

displayCart();

// Update cart badge
function updateCartCount(){

    const badge = document.getElementById("cart-count");

    if(!badge) return;

    let cart = getCart();

    let total = 0;

    cart.forEach(item=>{
        total += item.qty;
    });

    badge.textContent = total;
}

updateCartCount();


