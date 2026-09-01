# QuickBite Backend - Setup Instructions

Yeh backend aapke frontend (login, signup, menu, owner panel, rating) ko
**real database** se connect karta hai.

## Setup karne ke steps:

### 1. Node.js install karein
Agar pehle se nahi hai, to https://nodejs.org se install karein (LTS version).

### 2. Terminal me backend folder me jayein
```
cd backend
```

### 3. Zaroori packages install karein
```
npm install
```

### 4. .env file banayein
`.env.example` file ka naam copy karke `.env` rakh dein, aur zaroorat ho to
values change karein.

### 5. Server start karein
```
npm start
```

Agar sab sahi hai to yeh dikhega:
```
✅ QuickBite backend chal raha hai: http://localhost:3000
```

### 6. Database automatically ban jayegi
Pehli baar chalane par `data.db` naam ki file automatically ban jayegi
usme demo food items daal diye jayenge.

---

## Available API Routes

| Method | Route | Kaam |
|---|---|---|
| POST | `/api/signup` | Naya account banana |
| POST | `/api/login` | Login verify karna |
| GET | `/api/items` | Saare food items dikhana |
| PUT | `/api/items/:id` | Owner: price/discount modify karna |
| POST | `/api/items` | Owner: naya item add karna |
| POST | `/api/items/:id/rate` | Customer: item ko rate karna |

---

## Frontend ko backend se connect karna

Abhi frontend files (`script.js`, `signup-script.js`, `menu-script.js`, etc.)
me data seedha JavaScript file (`menu-data.js`) se aata hai.

Inhe backend se connect karne ke liye, `fetch()` use karke API call karni hogi.

**Example — login page (`script.js`) me:**
```javascript
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password })
  });

  const data = await response.json();

  if (data.success) {
    document.getElementById('successMsg').style.display = 'block';
    setTimeout(() => window.location.href = 'menu.html', 500);
  } else {
    alert(data.error);
  }
});
```

Isi tarah `menu-script.js` me `fetch('http://localhost:3000/api/items')` se
real data mangwa sakte hain, `menu-data.js` ki jagah.

---

## Real email bhejne ke liye

1. https://sendgrid.com par free account banayein (ya Mailgun/Amazon SES)
2. Apni API key `.env` file me daalein
3. `server.js` me `sendOfferEmail()` function ke andar diye gaye comment wala
   code uncomment/use karein

---

## Deploy kaise karein (app ko internet par live karna)

Jab local testing ho jaye, to backend ko live karne ke liye free/paid options:
- **Render.com** ya **Railway.app** (backend ke liye, beginner-friendly)
- **Vercel** ya **Netlify** (frontend files ke liye)
- Database ko SQLite se **PostgreSQL** (jaise Supabase/Neon) me upgrade karna
  hoga, kyunki SQLite file-based hoti hai aur kuch hosting platforms par
  persist nahi rehti.
