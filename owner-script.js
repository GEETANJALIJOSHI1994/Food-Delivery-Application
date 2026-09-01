function getFinalPrice(item) {
  const discountAmount = (item.originalPrice * item.discountPercent) / 100;
  return Math.round(item.originalPrice - discountAmount);
}

function createOwnerRow(item) {
  const row = document.createElement('div');
  row.className = 'owner-row';

  row.innerHTML = `
    <div class="row-emoji">${item.emoji}</div>
    <div class="row-name">${item.name}</div>

    <div class="row-field">
      <label>Rate (₹)</label>
      <input type="number" class="price-input" value="${item.originalPrice}" min="0">
    </div>

    <div class="row-field">
      <label>Discount (%)</label>
      <input type="number" class="discount-input" value="${item.discountPercent}" min="0" max="100">
    </div>

    <div class="final-price">
      <span class="label">Customer dekhega</span>
      <span class="value final-value">₹${getFinalPrice(item)}</span>
    </div>

    <button class="save-btn">Save</button>
  `;

  const priceInput = row.querySelector('.price-input');
  const discountInput = row.querySelector('.discount-input');
  const finalValue = row.querySelector('.final-value');
  const saveBtn = row.querySelector('.save-btn');

  // Jab bhi owner rate ya discount type kare, final price turant update ho
  function updatePreview() {
    const tempItem = {
      originalPrice: Number(priceInput.value) || 0,
      discountPercent: Number(discountInput.value) || 0
    };
    finalValue.textContent = '₹' + getFinalPrice(tempItem);
  }

  priceInput.addEventListener('input', updatePreview);
  discountInput.addEventListener('input', updatePreview);

  // Save button dabane par backend ko real update bheja jaata hai
  saveBtn.addEventListener('click', async function () {
    const originalPrice = Number(priceInput.value) || 0;
    const discountPercent = Number(discountInput.value) || 0;

    try {
      await fetch(`${API_BASE}/api/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalPrice, discountPercent })
      });

      saveBtn.textContent = 'Saved ✓';
      saveBtn.classList.add('saved');
      setTimeout(() => {
        saveBtn.textContent = 'Save';
        saveBtn.classList.remove('saved');
      }, 1000);
    } catch (err) {
      alert('⚠️ Backend server se connect nahi ho paya.');
      console.error(err);
    }
  });

  return row;
}

// Backend se real items laake table banana
async function renderOwnerTable() {
  const table = document.getElementById('ownerTable');

  try {
    const response = await fetch(`${API_BASE}/api/items`);
    const items = await response.json();

    table.innerHTML = '';
    items.forEach(item => {
      table.appendChild(createOwnerRow(item));
    });
  } catch (err) {
    table.innerHTML = `
      <p style="text-align:center; color:#9BA79E; padding: 30px;">
        ⚠️ Backend server se connect nahi ho paya. Kya "npm start" chala hua hai backend folder me?
      </p>
    `;
    console.error(err);
  }
}

renderOwnerTable();

// "Naya Item Add Karein" button - backend ko naya item bhejta hai
document.getElementById('addItemBtn').addEventListener('click', async function () {
  const name = prompt('Item ka naam likhein:');
  if (!name) return;

  const originalPrice = Number(prompt('Rate (₹) likhein:', '100')) || 0;

  try {
    await fetch(`${API_BASE}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, emoji: '🍽️', originalPrice, discountPercent: 0 })
    });

    renderOwnerTable(); // list ko refresh karo taaki naya item dikhe
  } catch (err) {
    alert('⚠️ Backend server se connect nahi ho paya.');
    console.error(err);
  }
});
