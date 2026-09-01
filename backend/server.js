// server.js - QuickBite Backend
// Yeh server sabhi pages (login, signup, menu, owner panel, rating) ko
// real data ke saath connect karta hai.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// =========================================================
// SIGNUP - naya account banana
// =========================================================
app.post('/api/signup', async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ error: 'Saari fields zaroori hain' });
  }

  try {
    // Password ko kabhi seedha save nahi karte — hamesha hash karke save karo
    const passwordHash = await bcrypt.hash(password, 10);

    const insert = db.prepare(`
      INSERT INTO users (name, phone, email, password_hash)
      VALUES (?, ?, ?, ?)
    `);
    insert.run(name, phone, email, passwordHash);

    res.json({ success: true, message: 'Account ban gaya' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Yeh mobile number pehle se registered hai' });
    }
    res.status(500).json({ error: 'Kuch galat ho gaya' });
  }
});

// =========================================================
// LOGIN - phone + password verify karna
// =========================================================
app.post('/api/login', async (req, res) => {
  const { phone, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  if (!user) {
    return res.status(401).json({ error: 'Account nahi mila' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Galat password' });
  }

  // Login successful — offer email bhejo (async, response ka wait nahi karenge)
  sendOfferEmail(user.email, user.name);

  res.json({ success: true, name: user.name, role: user.role });
});

// =========================================================
// FOOD ITEMS - list dikhana (customer + owner dono use karte hain)
// =========================================================
app.get('/api/items', (req, res) => {
  const items = db.prepare('SELECT * FROM food_items').all();

  // Har item ka final price aur average rating calculate karke bhejo
  const result = items.map(item => ({
    id: item.id,
    name: item.name,
    emoji: item.emoji,
    originalPrice: item.original_price,
    discountPercent: item.discount_percent,
    finalPrice: Math.round(item.original_price - (item.original_price * item.discount_percent) / 100),
    rating: item.rating_count > 0 ? Math.round((item.rating_total / item.rating_count) * 10) / 10 : 0
  }));

  res.json(result);
});

// =========================================================
// OWNER - kisi item ka price/discount modify karna
// =========================================================
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { originalPrice, discountPercent } = req.body;

  db.prepare(`
    UPDATE food_items SET original_price = ?, discount_percent = ? WHERE id = ?
  `).run(originalPrice, discountPercent, id);

  res.json({ success: true });
});

// =========================================================
// OWNER - naya item add karna
// =========================================================
app.post('/api/items', (req, res) => {
  const { name, emoji, originalPrice, discountPercent } = req.body;

  const insert = db.prepare(`
    INSERT INTO food_items (name, emoji, original_price, discount_percent, rating_total, rating_count)
    VALUES (?, ?, ?, ?, 0, 0)
  `);
  const result = insert.run(name, emoji || '🍽️', originalPrice, discountPercent || 0);

  res.json({ success: true, id: result.lastInsertRowid });
});

// =========================================================
// RATING - customer kisi item ko rate kare
// =========================================================
app.post('/api/items/:id/rate', (req, res) => {
  const { id } = req.params;
  const { userId, stars } = req.body;

  if (stars < 1 || stars > 5) {
    return res.status(400).json({ error: 'Rating 1 se 5 ke beech honi chahiye' });
  }

  db.prepare('INSERT INTO ratings (user_id, item_id, stars) VALUES (?, ?, ?)').run(userId, id, stars);

  // Item ki total rating aur count update karo
  db.prepare(`
    UPDATE food_items
    SET rating_total = rating_total + ?, rating_count = rating_count + 1
    WHERE id = ?
  `).run(stars, id);

  res.json({ success: true });
});

// =========================================================
// EMAIL - offer email bhejna (yahan real email service jodenge)
// =========================================================
function sendOfferEmail(toEmail, name) {
  // ---- ABHI (DEMO) ----
  console.log(`📧 [DEMO] Offer email "${toEmail}" par bheja gaya (${name} ke liye)`);

  // ---- REAL APP ME YAHAN ----
  // SendGrid, Mailgun, ya Amazon SES jaisi service use karke asli email bhejenge.
  // Example (SendGrid ke saath):
  //
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // sgMail.send({
  //   to: toEmail,
  //   from: 'offers@quickbite.com',
  //   subject: 'Aapka Welcome Offer - 50% OFF!',
  //   html: fs.readFileSync('../email-template.html', 'utf-8')
  // });
}

app.listen(PORT, () => {
  console.log(`✅ QuickBite backend chal raha hai: http://localhost:${PORT}`);
});
