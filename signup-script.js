document.getElementById('signupForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // page reload rokne ke liye

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  const successMsg = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');

  // Pehle check karo passwords match kar rahe hain ya nahi
  if (password !== confirmPassword) {
    errorMsg.textContent = '⚠️ Passwords match nahi kar rahe';
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
    return;
  }

  errorMsg.style.display = 'none';

  try {
    // Backend ko naya account banane ke liye bhejo
    const response = await fetch(`${API_BASE}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, password })
    });

    const data = await response.json();

    if (data.success) {
      successMsg.style.display = 'block';
      document.getElementById('signupForm').reset();

      // Turant login page khol do
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 500);
    } else {
      errorMsg.textContent = `⚠️ ${data.error}`;
      errorMsg.style.display = 'block';
    }
  } catch (err) {
    alert('⚠️ Backend server se connect nahi ho paya. Kya "npm start" chala hua hai backend folder me?');
    console.error(err);
  }
});
