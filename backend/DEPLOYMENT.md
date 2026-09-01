# QuickBite - Deployment Guide (App ko Live karna)

Abhi tak app sirf aapke computer (`localhost`) par chal raha hai. Isko
**internet par live** karne ke liye 2 alag cheezein deploy karni hongi:

1. **Backend** (server.js + database) → ek server par
2. **Frontend** (HTML/CSS/JS files) → ek static hosting par

---

## Part 1: Backend Deploy Karna (Render.com use karke — free hai)

1. https://render.com par account banayein (GitHub se sign up kar sakte hain)
2. Apna `backend` folder ek **GitHub repository** me upload karein
3. Render par **"New Web Service"** par click karein
4. Apni GitHub repo select karein
5. Yeh settings daalein:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. **Environment Variables** me apni `.env` wali values daal dein
   (jaise `SENDGRID_API_KEY`)
7. Deploy hone ke baad, Render aapko ek URL dega jaise:
   ```
   https://quickbite-backend.onrender.com
   ```

### ⚠️ Important: Database badalna hoga

`better-sqlite3` (jo humne local testing ke liye use kiya) **Render jaisi
free hosting par data permanently save nahi rakhta** (server restart hone
par data delete ho sakta hai).

Production ke liye free options:
- **Supabase** (PostgreSQL, free tier hai) — https://supabase.com
- **Neon** (PostgreSQL, free tier hai) — https://neon.tech
- **MongoDB Atlas** (agar MongoDB use karna ho) — https://mongodb.com/atlas

Inme se koi bhi choose karke, `db.js` file ko us database se connect karna
hoga (Claude Code isme step-by-step madad kar sakta hai).

---

## Part 2: Frontend Deploy Karna (Netlify use karke — free hai)

1. https://netlify.com par account banayein
2. Apni saari frontend files (`.html`, `.css`, `.js` — `backend` folder
   chhod kar) ek folder me rakhein
3. Netlify par **"Add new site" → "Deploy manually"** choose karein
4. Us folder ko **drag-and-drop** kar dein
5. Netlify turant ek live URL dega jaise:
   ```
   https://quickbite-app.netlify.app
   ```

---

## Part 3: Frontend ko Live Backend se Jodna

Deploy hone ke baad, `api-config.js` file me sirf **ek line** change karni
hai:

**Pehle (local testing ke liye):**
```javascript
const API_BASE = 'http://localhost:3000';
```

**Baad me (live hone ke baad):**
```javascript
const API_BASE = 'https://quickbite-backend.onrender.com';
```

Bas! Poora code wahi rahega, sirf yeh ek line badalni hai.

---

## Part 4: Apna Khud Ka Domain Jodna (Optional)

Agar aap chahte hain ki app `www.quickbite.com` jaisे kisi apne domain par
chale:
1. Kisi bhi domain registrar se domain khareedein (GoDaddy, Namecheap, etc.)
2. Netlify/Render ki settings me **"Custom Domain"** section me jaake us
   domain ko jod dein
3. Domain registrar ki DNS settings me Netlify/Render ke diye hue records
   daal dein

---

## Checklist — Live jaane se pehle

- [ ] Database ko SQLite se PostgreSQL/MongoDB me shift kiya
- [ ] `.env` file me real API keys daali (email service, etc.)
- [ ] `api-config.js` me live backend ka URL daala
- [ ] Password/security check kiya (bcrypt already use ho raha hai ✅)
- [ ] Mobile par bhi test kiya (chhoti screen par sab sahi dikh raha hai)
- [ ] Payment gateway jodna hai to Razorpay/Stripe ka account banaya

---

## Agla Level (jab app grow kare)

Jaise-jaise users badhenge, aage yeh cheezein chahiye ho sakti hain:
- **Payment gateway**: Razorpay (India ke liye best) ya Stripe
- **Real-time order tracking**: Socket.io (WebSocket ke liye)
- **Push notifications**: Firebase Cloud Messaging
- **Image upload**: Cloudinary ya AWS S3 (food photos ke liye)
- **Admin dashboard**: sabhi orders/users dekhne ke liye alag panel
