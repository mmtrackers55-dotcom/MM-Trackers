// Get cart from LocalStorage
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

    // Check if already exists
    let existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.qty += 1;
    } else {
        product.qty = 1;
        cart.push(product);
    }

    saveCart(cart);

    alert(product.name + " added to cart.");

}