

// Prevent returning to checkout using browser Back button
window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
        window.location.replace("cart.html");
    }
});

// Rest of your checkout.js code starts here...
let cart = getCart();

// ...


// ==========================================
// MM TRACKERS CHECKOUT
// PART 1 - LOAD CART & TOTALS
// ==========================================
const SHIPPING = 450;
const COD_RATE = 0.04;

const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {

    let cart = getCart();

    if (cart.length === 0) {
        window.location.href = "cart.html";
    }

    const checkoutItems = document.getElementById("checkout-items");
    const productsTotal = document.getElementById("products-total");
    const codFee = document.getElementById("cod-fee");
    const grandTotal = document.getElementById("grand-total");
    const bankDetails = document.getElementById("bank-details");

    let subtotal = 0;
    let html = "";

    // ===============================
    // DISPLAY PRODUCTS
    // ===============================

    cart.forEach(item => {

        subtotal += item.price * item.qty;

        html += `
        <div class="checkout-item">

            <h3>${item.name}</h3>

            <p>
                Price:
                <strong>Rs. ${item.price.toLocaleString()}</strong>
            </p>

            <p>
                Quantity:
                <strong>${item.qty}</strong>
            </p>

            <p>
                Subtotal:
                <strong>
                Rs. ${(item.price * item.qty).toLocaleString()}
                </strong>
            </p>

            <hr>

        </div>
        `;

    });

    checkoutItems.innerHTML = html;

    productsTotal.innerHTML =
        "Rs. " + subtotal.toLocaleString();


    // ===============================
    // CALCULATE TOTAL
    // ===============================

    function calculateTotal() {

        const payment =
        document.querySelector('input[name="payment"]:checked').value;

        let shipping = SHIPPING;

        let cod = 0;

        if (payment === "Cash on Delivery") {

            cod = Math.round((subtotal + shipping) * COD_RATE);

            bankDetails.style.display = "none";

        } else {

            bankDetails.style.display = "block";

        }

        codFee.innerHTML =
            "Rs. " + cod.toLocaleString();

        grandTotal.innerHTML =
            "Rs. " +
            (subtotal + shipping + cod).toLocaleString();

    }

    calculateTotal();

    document
    .querySelectorAll('input[name="payment"]')
    .forEach(radio => {

        radio.addEventListener(
            "change",
            calculateTotal
        );

    });

    updateCartCount();

    // ===============================
    // PLACE ORDER
    // ===============================

    checkoutForm.addEventListener("submit", function(e){

        e.preventDefault();

        if(cart.length===0){

            alert("Your cart is empty.");

            return;

        }

        const btn =
        document.getElementById("placeOrderBtn");

        btn.disabled = true;

        btn.innerHTML = "Please Wait...";

        const name =
        document.getElementById("name").value.trim();

        const phone =
        document.getElementById("phone").value.trim();

        const city =
        document.getElementById("city").value.trim();

        const address =
        document.getElementById("address").value.trim();

        const payment =
        document.querySelector('input[name="payment"]:checked').value;

        let shipping = SHIPPING;

        let cod = 0;

        if(payment==="Cash on Delivery"){

            cod = Math.round((subtotal + shipping) * COD_RATE);

        }

        const grand =
        subtotal + shipping + cod;

        // ===============================
        // ORDER NUMBER
        // ===============================

        const orderNo =
        "MMT-" + Date.now().toString().slice(-8);

        localStorage.setItem(
            "lastOrderNo",
            orderNo
        );

        // ===============================
        // WHATSAPP MESSAGE
        // ===============================

        let message =
`🛒 *New Order - MM Trackers*

🆔 *Order No:* ${orderNo}

👤 *Customer:* ${name}
📞 *Phone:* ${phone}
🏙 *City:* ${city}
📍 *Address:* ${address}

💳 *Payment Method:* ${payment}

━━━━━━━━━━━━━━━━━━

📦 *Products:*

`;

        cart.forEach(item=>{

message +=
`• ${item.name}
Qty: ${item.qty}
Price: Rs. ${item.price.toLocaleString()}
Subtotal: Rs. ${(item.price*item.qty).toLocaleString()}

`;

        });

        message +=
`━━━━━━━━━━━━━━━━━━

Products Total:
Rs. ${subtotal.toLocaleString()}

Shipping:
Rs. ${shipping.toLocaleString()}

COD Fee:
Rs. ${cod.toLocaleString()}

━━━━━━━━━━━━━━━━━━

💰 *Grand Total:*
Rs. ${grand.toLocaleString()}
`;

        if(payment==="Meezan Bank"){

message += `

🏦 *Meezan Bank*

Account Title:
MM Trackers

Account Number:
07010102734800

IBAN:
PK89MEZN0007010102734800`;

        }

        if(payment==="EasyPaisa"){

message += `

📱 *EasyPaisa*

0315 9615557`;

        }

        if(payment==="NayaPay"){

message += `

💙 *NayaPay / Raast*

0315 9615557`;

        }

        // ===============================
        // OPEN WHATSAPP
        // ===============================

        const whatsappURL =
        "https://wa.me/923159615557?text=" +
        encodeURIComponent(message);

        const win = window.open(
            whatsappURL,
            "_blank"
        );

        // If popup blocked
        if(!win){

            alert("Please allow pop-ups for this website so WhatsApp can open.");

            btn.disabled = false;
            btn.innerHTML = "Place Order on WhatsApp";

            return;

        }

        // ===============================
        // CLEAR CART
        // ===============================

        localStorage.removeItem("cart");

        updateCartCount();

        // ===============================
        // SUCCESS PAGE
        // ===============================

        setTimeout(function(){

            window.location.href="success.html";

        },500);

    });

    // ===============================
    // COPY TEXT
    // ===============================

    function copyText(id){

        const text =
        document.getElementById(id).innerText;

        if(navigator.clipboard){

            navigator.clipboard.writeText(text)
            .then(function(){

                alert("Copied Successfully");

            });

        }else{

            const input =
            document.createElement("textarea");

            input.value = text;

            document.body.appendChild(input);

            input.select();

            document.execCommand("copy");

            document.body.removeChild(input);

            alert("Copied Successfully");

        }

    }

}




