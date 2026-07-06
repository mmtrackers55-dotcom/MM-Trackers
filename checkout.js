// ==========================
// MM TRACKERS CHECKOUT V2
// ==========================
const SHIPPING = 450;
const COD_RATE = 0.04;

let cart = getCart();

if (document.getElementById("checkoutForm")) {

    const checkoutItems = document.getElementById("checkout-items");
    const productsTotal = document.getElementById("products-total");
    const codFee = document.getElementById("cod-fee");
    const grandTotal = document.getElementById("grand-total");

    const bankBox = document.getElementById("bank-details");

    let subtotal = 0;

    // -------------------------
    // Render Products
    // -------------------------

    let html = "";

    cart.forEach(item => {

        subtotal += item.price * item.qty;

        html += `
        <div class="checkout-item">

            <h3>${item.name}</h3>

            <p>Price : Rs. ${item.price.toLocaleString()}</p>

            <p>Quantity : ${item.qty}</p>

            <strong>
            Subtotal :
            Rs. ${(item.price * item.qty).toLocaleString()}
            </strong>

        </div>
        `;

    });

    checkoutItems.innerHTML = html;

    productsTotal.innerHTML =
        "Rs. " + subtotal.toLocaleString();


    // -------------------------
    // Live Total
    // -------------------------

    function calculateTotal(){

        const payment =
        document.querySelector('input[name="payment"]:checked').value;

        let shipping = SHIPPING;

        let cod = 0;

        if(payment === "Cash on Delivery"){

            cod = Math.round((subtotal + shipping) * COD_RATE);

            bankBox.style.display="none";

        }else{

            bankBox.style.display="block";

        }

        codFee.innerHTML =
        "Rs. " + cod.toLocaleString();

        grandTotal.innerHTML =
        "Rs. " +
        (subtotal + shipping + cod).toLocaleString();

    }

    calculateTotal();

    document.querySelectorAll('input[name="payment"]').forEach(radio=>{

        radio.addEventListener("change",calculateTotal);

    });

    updateCartCount();


    // -------------------------
    // Submit Order
    // -------------------------

    document.getElementById("checkoutForm")
    .addEventListener("submit",function(e){

        e.preventDefault();

        if(cart.length===0){

            alert("Your cart is empty.");

            return;

        }

        const btn =
        document.getElementById("placeOrderBtn");

        btn.disabled = true;

        btn.innerHTML="Please Wait...";


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

        const total =
        subtotal + shipping + cod;


        const orderNo =
        "MMT-" +
        Date.now().toString().slice(-8);

localStorage.setItem("lastOrderNo", orderNo);
        let message =
`🛒 *NEW ORDER - MM TRACKERS*

Order No:
${orderNo}

━━━━━━━━━━━━━━━━━━

👤 Customer:
${name}

📞 Phone:
${phone}

🏙 City:
${city}

📍 Address:
${address}

💳 Payment:
${payment}

━━━━━━━━━━━━━━━━━━

📦 Products:
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

Products:
Rs. ${subtotal.toLocaleString()}

Shipping:
Rs. ${shipping.toLocaleString()}

COD Fee:
Rs. ${cod.toLocaleString()}

━━━━━━━━━━━━━━━━━━

💰 Grand Total:
Rs. ${total.toLocaleString()}
`;

if(payment==="Meezan Bank"){

message += `

🏦 Meezan Bank

Title:
MM Trackers

Account:
07010102734800

IBAN:
PK89MEZN0007010102734800`;

}

if(payment==="EasyPaisa"){

message += `

📱 EasyPaisa

03159615557`;

}

if(payment==="NayaPay"){

message += `

💙 NayaPay / Raast

03159615557`;

}

window.open(

"https://wa.me/923159615557?text=" +

encodeURIComponent(message),

"_blank"

);

localStorage.removeItem("cart");

updateCartCount();

window.location.href = "success.html";

});

// =====================================
// COPY PAYMENT DETAILS
// =====================================

function copyText(id){

    const text = document.getElementById(id).innerText;

    if(navigator.clipboard){

        navigator.clipboard.writeText(text)
        .then(function(){

            alert(text + "\n\nCopied successfully.");

        })
        .catch(function(){

            fallbackCopy(text);

        });

    }else{

        fallbackCopy(text);

    }

}

function fallbackCopy(text){

    const input = document.createElement("textarea");

    input.value = text;

    document.body.appendChild(input);

    input.select();

    document.execCommand("copy");

    document.body.removeChild(input);

    alert(text + "\n\nCopied successfully.");

}





}