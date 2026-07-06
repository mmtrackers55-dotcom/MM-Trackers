

alert("NEW CHECKOUT.JS LOADED");

// ------------------------------
// LOAD CART
// ------------------------------
let cart = getCart();

let total = 0;
let html = "";

// Render cart items
cart.forEach(item => {

    total += item.price * item.qty;

    html += `
    <div class="checkout-item">

        <h3>${item.name}</h3>

        <p>Rs. ${item.price.toLocaleString()} × ${item.qty}</p>

        <strong>
            Subtotal: Rs. ${(item.price * item.qty).toLocaleString()}
        </strong>

        <hr>

    </div>
    `;

});

document.getElementById("checkout-items").innerHTML = html;
document.getElementById("checkout-total").innerHTML =
"Total: Rs. " + total.toLocaleString();

updateCartCount();


// ------------------------------
// CHECKOUT FORM
// ------------------------------
document.getElementById("checkoutForm").addEventListener("submit", function(e){

    e.preventDefault();

    if(cart.length === 0){
        alert("Your cart is empty.");
        return;
    }

    // Customer Details
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const city = document.getElementById("city").value.trim();
    const address = document.getElementById("address").value.trim();

    // Payment Method
    const payment =
        document.querySelector('input[name="payment"]:checked')?.value
        || "Cash on Delivery";

    // WhatsApp Message
    let message =
`*New Order - MM Trackers*

*Customer:* ${name}
*Phone:* ${phone}
*City:* ${city}
*Address:* ${address}

*TEST PAYMENT:* ABC123

-----------------------
*Products:*
`;

    cart.forEach(item => {

        message +=
`• ${item.name}
Qty: ${item.qty}
Price: Rs. ${item.price.toLocaleString()}
Subtotal: Rs. ${(item.price * item.qty).toLocaleString()}

`;

    });

    message +=
`-----------------------
*Total:* Rs. ${total.toLocaleString()}`;

    // Open WhatsApp
    window.open(
        "https://wa.me/923159615557?text=" + encodeURIComponent(message),
        "_blank"
    );

    // Clear Cart
    localStorage.removeItem("cart");
    cart = [];

    updateCartCount();

    // Redirect
    setTimeout(function(){
        window.location.href = "index.html";
    },1000);

});