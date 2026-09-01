// Yeh form submit hone par chalta hai
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // page reload rokne ke liye

  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const successMsg = document.getElementById('successMsg');

  try {
    // Backend server ko real login request bhejo
    const response = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });

    const data = await response.json();

    if (data.success) {
      successMsg.textContent = `✅ Login successful! Namaste, ${data.name}. 📧 Offer email bhej diya gaya hai.`;
      successMsg.style.display = 'block';

      // User ka naam/phone URL ke through menu page ko bhejo
      // (sessionStorage yahan jaan-boojhkar avoid kiya hai, kyunki Claude ke
      // artifact preview me browser storage kaam nahi karta — URL params
      // har jagah reliably kaam karte hain)
      const params = new URLSearchParams({ name: data.name, phone: phone });

      setTimeout(function () {
        window.location.href = `menu.html?${params.toString()}`;
      }, 500);
    } else {
      alert(data.error || 'Login fail ho gaya');
    }
  } catch (err) {
    // Agar backend server chal hi nahi raha, to yeh error aayega
    alert('⚠️ Backend server se connect nahi ho paya. Kya "npm start" chala hua hai backend folder me?');
    console.error(err);
  }
});
