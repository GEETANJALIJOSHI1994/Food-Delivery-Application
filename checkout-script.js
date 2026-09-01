// Cart data URL se nikalna (jo menu.html se yahan bheja gaya tha)
const urlParams = new URLSearchParams(window.location.search);
let cart = [];

try {
  cart = JSON.parse(decodeURIComponent(urlParams.get('cart') || '[]'));
} catch (e) {
  cart = [];
}

const DELIVERY_FEE = 25;

function renderCart() {
  const container = document.getElementById('cartItems');

  if (cart.length === 0) {
    container.innerHTML = '<p style="padding:20px; text-align:center; color:#9BA79E;">Cart khali hai</p>';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item-row">
      <span class="item-emoji">${item.emoji}</span>
      <span class="item-name">${item.name}</span>
      <span class="item-price">₹${item.price}</span>
    </div>
  `).join('');

  const itemTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const grandTotal = itemTotal + DELIVERY_FEE;

  document.getElementById('itemTotal').textContent = `₹${itemTotal}`;
  document.getElementById('deliveryFee').textContent = `₹${DELIVERY_FEE}`;
  document.getElementById('grandTotal').textContent = `₹${grandTotal}`;

  return grandTotal;
}

const grandTotal = renderCart();

document.getElementById('payBtn').addEventListener('click', function () {
  const payBtn = this;
  payBtn.disabled = true;
  payBtn.textContent = 'Processing...';

  // ============================================================
  // ---- YEH DEMO SIMULATION HAI ----
  // Real app me yahan Razorpay ka checkout popup khulta hai.
  // Poora real code PAYMENT.md file me hai, yahan short summary:
  //
  // 1. Pehle backend se ek "order" banwate hain:
  //    const order = await fetch(`${API_BASE}/api/create-order`, {
  //      method: 'POST', body: JSON.stringify({ amount: grandTotal })
  //    }).then(r => r.json());
  //
  // 2. Phir Razorpay ka checkout kholte hain:
  //    const rzp = new Razorpay({
  //      key: 'rzp_test_XXXXXXXX',   // Razorpay dashboard se milegi
  //      amount: order.amount,
  //      order_id: order.id,
  //      handler: function (response) {
  //        // Payment successful — backend ko verify karne ke liye bhejo
  //      }
  //    });
  //    rzp.open();
  // ============================================================

  setTimeout(function () {
    payBtn.textContent = '✅ Payment Successful!';

    setTimeout(function () {
      window.location.href = 'track.html';
    }, 1000);
  }, 1500);
});
