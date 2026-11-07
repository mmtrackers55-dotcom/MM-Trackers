
// ==========================================
// MM TRACKERS CHECKOUT - SUPABASE INTEGRATION
// ==========================================

const SHIPPING = 400;
const COD_RATE = 0.04;

const SUPABASE_URL = "https://lzfuqivdkcjxgclitrnk.supabase.co";
const SUPABASE_KEY = "sb_publishable_dwwSB3mnKbLEgmasodNBkw_Z0-e4RM5";

const checkoutForm = document.getElementById("checkoutForm");

// ==========================================
// PREVENT RETURNING TO CHECKOUT
// ==========================================

window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
        window.location.replace("cart.html");
    }
});

// ==========================================
// LOAD CART
// ==========================================

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

    const formatMoney = value =>
        Number(value || 0).toLocaleString("en-PK");

    // ==========================================
    // DISPLAY PRODUCTS
    // ==========================================

    let subtotal = 0;
    let html = "";

    cart.forEach(item => {

        const itemTotal = Number(item.price) * Number(item.qty);

        subtotal += itemTotal;

        html += `
        <div class="checkout-item">
            <h3>${item.name}</h3>

            <p>Price:
                <strong>Rs. ${formatMoney(item.price)}</strong>
            </p>

            <p>Quantity:
                <strong>${item.qty}</strong>
            </p>

            <p>Subtotal:
                <strong>Rs. ${formatMoney(itemTotal)}</strong>
            </p>

            <hr>
        </div>
        `;
    });

    checkoutItems.innerHTML = html;
    productsTotal.innerHTML = "Rs. " + formatMoney(subtotal);

    // ==========================================
    // CALCULATE DISPLAY TOTAL
    // ==========================================

    function calculateTotal() {

        const selectedPayment =
            document.querySelector('input[name="payment"]:checked');

        if (!selectedPayment) return;

        const payment = selectedPayment.value;

        let cod = 0;

        if (payment === "Cash on Delivery") {

            cod = Math.round((subtotal + SHIPPING) * COD_RATE);

            bankDetails.style.display = "none";

        } else {

            bankDetails.style.display = "block";

        }

        codFee.innerHTML = "Rs. " + formatMoney(cod);

        grandTotal.innerHTML =
            "Rs. " + formatMoney(subtotal + SHIPPING + cod);
    }

    calculateTotal();

    document
        .querySelectorAll('input[name="payment"]')
        .forEach(radio => {
            radio.addEventListener("change", calculateTotal);
        });

    updateCartCount();

    // ==========================================
    // PLACE ORDER
    // ==========================================

    checkoutForm.addEventListener("submit", async function (e) {

        e.preventDefault();

alert("Checkout button is working");

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        // Validate product SKUs

        for (const item of cart) {

            if (!item.sku || !Number.isInteger(Number(item.qty)) || Number(item.qty) < 1) {

                alert("A product is missing its SKU or has an invalid quantity. Please contact us.");

                return;
            }
        }

        const btn = document.getElementById("placeOrderBtn");

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const city = document.getElementById("city").value.trim();
        const address = document.getElementById("address").value.trim();

        const selectedPayment =
            document.querySelector('input[name="payment"]:checked');

        if (!selectedPayment) {
            alert("Please select a payment method.");
            return;
        }

        const payment = selectedPayment.value;

        // Open a blank tab during the click to avoid popup blocking.

        const win = window.open("about:blank", "_blank");

        if (!win) {
            alert("Please allow pop-ups for this website to continue.");
            return;
        }

        btn.disabled = true;
        btn.innerHTML = "Saving Order...";

        try {

            // ==========================================
            // SEND ORDER TO SUPABASE
            // ==========================================

            const orderPayload = {

                p_customer_name: name,
                p_phone: phone,
                p_city: city,
                p_address: address,
                p_payment_method: payment,

                p_items: cart.map(item => ({
                    sku: item.sku,
                    qty: Number(item.qty)
                }))

            };

            const response = await fetch(
                SUPABASE_URL + "/rest/v1/rpc/place_order",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "apikey": SUPABASE_KEY,
                        "Authorization": "Bearer " + SUPABASE_KEY
                    },

                    body: JSON.stringify(orderPayload)
                }
            );

            const responseData = await response.json();

            if (!response.ok) {

                throw new Error(
                    responseData.message ||
                    responseData.details ||
                    responseData.hint ||
                    "Supabase could not save the order."
                );
            }

            const order = Array.isArray(responseData)
                ? responseData[0]
                : responseData;

            if (!order || !order.order_number) {
                throw new Error("Order was not confirmed by Supabase.");
            }

            // ==========================================
            // USE DATABASE ORDER DETAILS
            // ==========================================

            const orderNo = order.order_number;

            const savedSubtotal = Number(order.subtotal);
            const shipping = Number(order.shipping_fee);
            const cod = Number(order.cod_fee);
            const grand = Number(order.grand_total);

            localStorage.setItem("lastOrderNo", orderNo);

            // ==========================================
            // WHATSAPP MESSAGE
            // ==========================================

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

            cart.forEach(item => {

                message +=
`• ${item.name}
SKU: ${item.sku}
Qty: ${item.qty}

`;

            });

            message +=
`━━━━━━━━━━━━━━━━━━

Products Total:
Rs. ${formatMoney(savedSubtotal)}

Shipping:
Rs. ${formatMoney(shipping)}

COD Fee:
Rs. ${formatMoney(cod)}

━━━━━━━━━━━━━━━━━━

💰 *Grand Total:*
Rs. ${formatMoney(grand)}
`;

            if (payment === "Meezan Bank") {

                message += `

🏦 *Meezan Bank*

Account Title:
MM Trackers

Account Number:
07010102734800

IBAN:
PK89MEZN0007010102734800`;

            }

            if (payment === "EasyPaisa") {

                message += `

📱 *EasyPaisa*

0315 9615557`;

            }

            if (payment === "NayaPay") {

                message += `

💙 *NayaPay / Raast*

0315 9615557`;

            }

            // ==========================================
            // OPEN WHATSAPP AFTER DATABASE CONFIRMATION
            // ==========================================

            const whatsappURL =
                "https://wa.me/923159615557?text=" +
                encodeURIComponent(message);

            win.location.href = whatsappURL;

            // ==========================================
            // CLEAR CART AFTER SUCCESSFUL DATABASE SAVE
            // ==========================================

            localStorage.removeItem("cart");

            updateCartCount();

            // ==========================================
            // SUCCESS PAGE
            // ==========================================

            setTimeout(function () {
                window.location.href = "success.html";
            }, 1000);

        } catch (error) {

            console.error("Order Error:", error);

            win.close();

            alert(
                "Your order could not be saved.\n\n" +
                error.message +
                "\n\nPlease try again or contact us on WhatsApp."
            );

            btn.disabled = false;
            btn.innerHTML = "Place Order on WhatsApp";

        }

    });

    // ==========================================
    // COPY PAYMENT DETAILS
    // ==========================================

    window.copyText = function (id) {

        const element = document.getElementById(id);

        if (!element) return;

        const text = element.innerText;

        if (navigator.clipboard) {

            navigator.clipboard.writeText(text)
                .then(function () {
                    alert("Copied Successfully");
                });

        } else {

            const input = document.createElement("textarea");

            input.value = text;

            document.body.appendChild(input);

            input.select();

            document.execCommand("copy");

            document.body.removeChild(input);

            alert("Copied Successfully");

        }
    };

}
