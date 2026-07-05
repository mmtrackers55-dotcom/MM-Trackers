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

        <p>
            Rs. ${item.price.toLocaleString()} × ${item.qty}
        </p>
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
document.getElementById("checkoutForm").addEventListener("submit", function(e) {

    e.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // --------------------------
    // FORM DATA
    // --------------------------
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const city = document.getElementById("city").value;
    const address = document.getElementById("address").value;

    // --------------------------
    // PAYMENT METHOD (SAFE)
    // --------------------------
    let payment = "Cash on Delivery";

    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        if (radio.checked) {
            payment = radio.value;
        }
    });

    // --------------------------
    // WHATSAPP MESSAGE
    // --------------------------
    let message =
`*New Order - MM Trackers*

*Customer:* ${name}
*Phone:* ${phone}
*City:* ${city}
*Address:* ${address}

*Payment Method:* ${payment}

-----------------------
*Products:*
`;

    cart.forEach(item => {
        message += `• ${item.name} x${item.qty} = Rs. ${item.price * item.qty}\n`;
    });

    message += `
-----------------------
*Total:* Rs. ${total}
`;

    // --------------------------
    // OPEN WHATSAPP
    // --------------------------
    window.open(
        "https://wa.me/923159615557?text=" + encodeURIComponent(message),
        "_blank"
    );

    // --------------------------
    // CLEAR CART
    // --------------------------
    localStorage.removeItem("cart");
    updateCartCount();

    // --------------------------
    // REDIRECT
    // --------------------------
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
});