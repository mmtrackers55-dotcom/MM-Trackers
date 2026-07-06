// ==========================
// GET CART
// ==========================
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}
// ==========================
// SAVE CART
// ==========================
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ==========================
// UPDATE CART BADGE
// ==========================
function updateCartCount() {

    const badge = document.getElementById("cart-count");

    if (!badge) return;

    let cart = getCart();

    let total = 0;

    cart.forEach(item => {
        total += item.qty;
    });

    badge.textContent = total;
}

// ==========================
// ADD PRODUCT
// ==========================
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

// ==========================
// DISPLAY CART
// ==========================
function displayCart() {

    const cartContainer = document.getElementById("cart-items");

    if (!cartContainer) return;

    let cart = getCart();

    if (cart.length === 0) {

        cartContainer.innerHTML = "<h3>Your cart is empty.</h3>";

        document.getElementById("cart-total").innerHTML = "Total : Rs. 0";

        return;
    }

    let html = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.qty;

        html += `
        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-info">

                <h3>${item.name}</h3>

                <p><strong>Price:</strong> Rs. ${item.price.toLocaleString()}</p>

                <p><strong>Quantity:</strong></p>

                <div class="qty-box">

                    <button onclick="decreaseQty(${index})">-</button>

                    <span>${item.qty}</span>

                    <button onclick="increaseQty(${index})">+</button>

                </div>

                <p><strong>Subtotal:</strong> Rs. ${(item.price * item.qty).toLocaleString()}</p>

                <button class="remove-btn" onclick="removeItem(${index})">
                    Remove
                </button>

            </div>

        </div>
        `;
    });

    cartContainer.innerHTML = html;

    document.getElementById("cart-total").innerHTML =
        "Total : Rs. " + total.toLocaleString();
}

// ==========================
// INCREASE QTY
// ==========================
function increaseQty(index) {

    let cart = getCart();

    cart[index].qty++;

    saveCart(cart);

    updateCartCount();

    displayCart();
}

// ==========================
// DECREASE QTY
// ==========================
function decreaseQty(index) {

    let cart = getCart();

    if (cart[index].qty > 1) {

        cart[index].qty--;

    } else {

        cart.splice(index, 1);

    }

    saveCart(cart);

    updateCartCount();

    displayCart();
}

// ==========================
// REMOVE ITEM
// ==========================
function removeItem(index) {

    let cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    updateCartCount();

    displayCart();
}

// ==========================
// LOAD PAGE
// ==========================
updateCartCount();
displayCart();
