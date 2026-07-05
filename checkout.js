// Load cart
let cart = getCart();

let total = 0;

cart.forEach(item=>{
    total += item.price * item.qty;
});

document.getElementById("checkout-total").innerHTML =
"Total : Rs. " + total.toLocaleString();

updateCartCount();

// Checkout Form
document.getElementById("checkoutForm").addEventListener("submit",function(e){

    e.preventDefault();

    if(cart.length===0){
        alert("Your cart is empty.");
        return;
    }

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const city = document.getElementById("city").value;
    const address = document.getElementById("address").value;

    let message =
`*New Order - MM Trackers*

Name: ${name}
Phone: ${phone}
City: ${city}
Address: ${address}

-----------------------
Products:
`;

    cart.forEach(item=>{
        message += `• ${item.name}
Qty: ${item.qty}
Price: Rs. ${item.price}
Subtotal: Rs. ${item.price * item.qty}

`;
    });

    message += `-----------------------
Total: Rs. ${total}`;

    // Open WhatsApp
    window.open(
        "https://wa.me/923159615557?text=" + encodeURIComponent(message),
        "_blank"
    );

    // Empty Cart
    localStorage.removeItem("cart");

    // Update Badge
    updateCartCount();

    // Redirect
    setTimeout(function(){
        window.location.href="index.html";
    },1000);

});