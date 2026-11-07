
// ==========================================
// MM TRACKERS - DIRECT WHATSAPP CHECKOUT
// ==========================================

const SHIPPING = 450;
const COD_RATE = 0.04;
const WHATSAPP_NUMBER = "923159615557";

const checkoutForm = document.getElementById("checkoutForm");

const checkoutItems = document.getElementById("checkout-items");
const productsTotal = document.getElementById("products-total");
const codFee = document.getElementById("cod-fee");
const grandTotal = document.getElementById("grand-total");
const bankDetails = document.getElementById("bank-details");
const placeOrderBtn = document.getElementById("placeOrderBtn");

const formatMoney = value =>
    Number(value || 0).toLocaleString("en-PK");

// ==========================================
// LOAD CART
// ==========================================

let cart = getCart();

if (checkoutForm) {

    if (!cart.length) {
        window.location.replace("cart.html");
    } else {

        // ==========================================
        // DISPLAY PRODUCTS
        // ==========================================

        function displayCheckout() {

            cart = getCart();

            let subtotal = 0;
            let html = "";

            cart.forEach(item => {

                const price = Number(item.price);
                const qty = Number(item.qty);
                const itemTotal = price * qty;

                subtotal += itemTotal;

                html += `
                    <div class="checkout-item">
                        <h3>${item.name}</h3>

                        <p>Price:
                            <strong>Rs. ${formatMoney(price)}</strong>
                        </p>

                        <p>Quantity:
                            <strong>${qty}</strong>
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

            return subtotal;
        }

        let subtotal = displayCheckout();

        // ==========================================
        // CALCULATE TOTAL
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
        // PLACE ORDER DIRECTLY ON WHATSAPP
        // ==========================================

        checkoutForm.addEventListener("submit", function (e) {

            e.preventDefault();

            if (placeOrderBtn.disabled) return;

            cart = getCart();

            if (!cart.length) {
                alert("Your cart is empty.");
                return;
            }

            subtotal = 0;

            for (const item of cart) {

                if (
                    !item.sku ||
                    !Number.isInteger(Number(item.qty)) ||
                    Number(item.qty) < 1 ||
                    !Number.isFinite(Number(item.price)) ||
                    Number(item.price) <= 0
                ) {
                    alert("Invalid product information. Please contact MM Trackers.");
                    return;
                }

                subtotal += Number(item.price) * Number(item.qty);
            }

            const name =
                document.getElementById("name").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const city =
                document.getElementById("city").value.trim();

            const address =
                document.getElementById("address").value.trim();

            const selectedPayment =
                document.querySelector('input[name="payment"]:checked');

            if (!name || !phone || !city || !address) {
                alert("Please complete all customer details.");
                return;
            }

            if (!selectedPayment) {
                alert("Please select a payment method.");
                return;
            }

            const payment = selectedPayment.value;

            // ==========================================
            // GENERATE ORDER NUMBER
            // ==========================================

            const orderNo =
                "MMT-" + Date.now().toString().slice(-8);

            // ==========================================
            // CALCULATE FINAL AMOUNT
            // ==========================================

            const cod =
                payment === "Cash on Delivery"
                    ? Math.round((subtotal + SHIPPING) * COD_RATE)
                    : 0;

            const grand = subtotal + SHIPPING + cod;

            // ==========================================
            // BUILD WHATSAPP MESSAGE
            // ==========================================

            let message =
`🛒 *NEW ORDER - MM TRACKERS*

🆔 *Order No:* ${orderNo}

👤 *Customer:* ${name}
📞 *Phone:* ${phone}
🏙 *City:* ${city}
📍 *Address:* ${address}

💳 *Payment Method:* ${payment}

━━━━━━━━━━━━━━━━━━

📦 *PRODUCTS*

`;

            cart.forEach(item => {

                message +=
`• ${item.name}
SKU: ${item.sku}
Price: Rs. ${formatMoney(item.price)}
Quantity: ${item.qty}
Subtotal: Rs. ${formatMoney(Number(item.price) * Number(item.qty))}

`;

            });

            message +=
`━━━━━━━━━━━━━━━━━━

Products Total:
Rs. ${formatMoney(subtotal)}

Shipping:
Rs. ${formatMoney(SHIPPING)}

COD Fee:
Rs. ${formatMoney(cod)}

━━━━━━━━━━━━━━━━━━

💰 *GRAND TOTAL:*
Rs. ${formatMoney(grand)}
`;

            if (payment === "Meezan Bank") {

                message +=
`
🏦 *MEEZAN BANK*

Account Title:
MM Trackers

Account Number:
07010102734800

IBAN:
PK89MEZN0007010102734800
`;
            }

            if (payment === "EasyPaisa") {

                message +=
`
📱 *EASYPAISA*

0315 9615557
`;
            }

            if (payment === "NayaPay") {

                message +=
`
💙 *NAYAPAY / RAAST*

0315 9615557
`;
            }

            // ==========================================
            // OPEN WHATSAPP DIRECTLY
            // ==========================================

            const whatsappURL =
                "https://wa.me/" +
                WHATSAPP_NUMBER +
                "?text=" +
                encodeURIComponent(message);

            localStorage.setItem("lastOrderNo", orderNo);

            // Open WhatsApp directly; no Supabase request.

            const whatsappWindow =
                window.open(whatsappURL, "_blank");

            // Clear cart only when handing off to WhatsApp.

            localStorage.removeItem("cart");
            updateCartCount();

            if (whatsappWindow) {

                window.location.href = "success.html";

            } else {

                // If pop-up is blocked, open WhatsApp
                // in the current tab instead.

                window.location.href = whatsappURL;
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
                    .then(() => alert("Copied Successfully"))
                    .catch(() => fallbackCopy(text));

            } else {

                fallbackCopy(text);

            }
        };

        function fallbackCopy(text) {

            const input = document.createElement("textarea");

            input.value = text;

            document.body.appendChild(input);

            input.select();

            document.execCommand("copy");

            document.body.removeChild(input);

            alert("Copied Successfully");
        }
    }
}
