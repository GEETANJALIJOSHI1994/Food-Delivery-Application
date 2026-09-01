# QuickBite - Payment Gateway (Razorpay) Integration Guide

Abhi `checkout.html` me payment **simulate** ho raha hai (asli paisa nahi
katega). Real payment lene ke liye Razorpay jodna hoga — yeh guide poora
process samjhata hai.

## Step 1: Razorpay Account Banayein

1. https://razorpay.com par sign up karein
2. Business details verify karein (KYC — bank account, PAN, etc.)
3. Dashboard se **API Keys** nikalein: `Key ID` aur `Key Secret`

---

## Step 2: Backend me Razorpay Package Install Karein

```
cd backend
npm install razorpay
```

`.env` file me keys daalein:
```
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_secret_key
```

---

## Step 3: Backend me "Create Order" Route Banayein

`server.js` me yeh route add karein:

```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/create-order', async (req, res) => {
  const { amount } = req.body; // amount rupees me aayega

  const order = await razorpay.orders.create({
    amount: amount * 100, // Razorpay paise me leta hai (₹1 = 100 paise)
    currency: 'INR',
  });

  res.json(order);
});

app.post('/api/verify-payment', (req, res) => {
  const crypto = require('crypto');
  const { order_id, payment_id, signature } = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(order_id + '|' + payment_id)
    .digest('hex');

  if (expectedSignature === signature) {
    // Payment genuine hai — order ko database me "paid" mark karein
    res.json({ verified: true });
  } else {
    res.status(400).json({ verified: false });
  }
});
```

---

## Step 4: Frontend me Razorpay Checkout Script Jodein

`checkout.html` ke `<head>` me yeh line add karein:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

`checkout-script.js` me "Pay" button ka code replace karein:

```javascript
document.getElementById('payBtn').addEventListener('click', async function () {
  // Step A: backend se order banwao
  const order = await fetch(`${API_BASE}/api/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: grandTotal })
  }).then(r => r.json());

  // Step B: Razorpay ka payment popup kholo
  const options = {
    key: 'rzp_test_XXXXXXXXXX',       // apni public Key ID yahan daalein
    amount: order.amount,
    currency: 'INR',
    name: 'QuickBite',
    order_id: order.id,
    handler: async function (response) {
      // Step C: payment ko backend se verify karwao
      const result = await fetch(`${API_BASE}/api/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature
        })
      }).then(r => r.json());

      if (result.verified) {
        window.location.href = 'track.html';
      }
    },
    theme: { color: '#FFC93C' }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});
```

---

## Step 5: Test Mode me Try Karein

Razorpay test mode me yeh dummy card use kar sakte hain:
- **Card Number:** 4111 1111 1111 1111
- **CVV:** koi bhi 3 digit
- **Expiry:** koi bhi future date

Test mode me asli paisa nahi katega.

---

## Step 6: Live Jaane Se Pehle

1. Razorpay dashboard me **KYC complete** karein
2. Test keys (`rzp_test_...`) ko **live keys** (`rzp_live_...`) se replace
   karein
3. Refund policy aur terms & conditions page banayein (Razorpay isse
   maangta hai)

---

## Alternative Options

Agar Razorpay ki jagah kuch aur use karna ho:
- **Stripe** — international payments ke liye better
- **PayU** — India me popular alternative
- **Cashfree** — UPI-focused, India ke liye achha

In sab ka integration process Razorpay jaisa hi hota hai — backend order
create karta hai, frontend checkout popup dikhata hai, phir backend
verify karta hai.
