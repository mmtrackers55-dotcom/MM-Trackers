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
// Show cart
function displayCart(){

    const cartContainer = document.getElementById("cart-items");

    if(!cartContainer) return;

    let cart = getCart();

    if(cart.length===0){

        cartContainer.innerHTML="<h3>Your cart is empty.</h3>";

        document.getElementById("cart-total").innerHTML="Total : Rs. 0";

        return;
    }

    let html="";

    let total=0;

    cart.forEach((item,index)=>{

        total += item.price * item.qty;

        html += `
        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-info">

                <h3>${item.name}</h3>

                <p><strong>Price:</strong> Rs. ${item.price.toLocaleString()}</p>

                <p><strong>Quantity:</strong> ${item.qty}</p>

                <p><strong>Subtotal:</strong> Rs. ${(item.price*item.qty).toLocaleString()}</p>

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


