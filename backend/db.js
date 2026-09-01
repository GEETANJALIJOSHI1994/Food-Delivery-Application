// db.js - Database setup
// SQLite ek file-based database hai (data.db naam ki file me save hota hai)
// Isliye alag se koi database server install/run karne ki zaroorat nahi.
// Bade production app me isko PostgreSQL ya MySQL se replace kar sakte hain.

const Database = require('better-sqlite3');
const db = new Database('data.db');

// ---- Users table (customers + owner) ----
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'customer',   -- 'customer' ya 'owner'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ---- Food items table ----
db.exec(`
  CREATE TABLE IF NOT EXISTS food_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    emoji TEXT DEFAULT '🍽️',
    original_price REAL NOT NULL,
    discount_percent REAL DEFAULT 0,
    rating_total REAL DEFAULT 0,     -- sabhi ratings ka jod
    rating_count INTEGER DEFAULT 0   -- kitne logon ne rate kiya
  )
`);

// ---- Ratings table (kisne kya rate kiya, taaki dobara rate na kar sake) ----
db.exec(`
  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    stars INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Agar food_items table khali hai, to starting demo items daal do
const count = db.prepare('SELECT COUNT(*) as c FROM food_items').get().c;
if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO food_items (name, emoji, original_price, discount_percent, rating_total, rating_count)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insert.run('Veg Burger', '🍔', 149, 20, 4.3, 1);
  insert.run('Paneer Pizza', '🍕', 299, 15, 4.6, 1);
  insert.run('Masala Dosa', '🥞', 99, 0, 4.1, 1);
  insert.run('Chicken Biryani', '🍛', 249, 10, 4.7, 1);
  insert.run('Cold Coffee', '🥤', 89, 25, 4.4, 1);
  insert.run('Samosa (2 pcs)', '🥟', 40, 0, 4.0, 1);
}

module.exports = db;
