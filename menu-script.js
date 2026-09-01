let cart = []; // { id, name, emoji, price } items yahan store honge
let currentUserName = 'Guest';

// URL se user ka naam nikalna (jo login page se yahan bheja gaya tha)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('name')) {
  currentUserName = urlParams.get('name');
}

// Har food item ke liye ek card (HTML) banane ka function
function createFoodCard(item) {
  const hasDiscount = item.discountPercent > 0;

  const card = document.createElement('div');
  card.className = 'food-card';

  card.innerHTML = `
    <div class="food-img">
      ${item.emoji}
      ${hasDiscount ? `<span class="discount-badge">${item.discountPercent}% OFF</span>` : ''}
    </div>
    <div class="food-info">
      <div class="food-name">${item.name}</div>
      <div class="food-rating">⭐ ${item.rating}</div>
      <div class="food-price-row">
        <span class="price-new">₹${item.finalPrice}</span>
        ${hasDiscount ? `<span class="price-old">₹${item.originalPrice}</span>` : ''}
      </div>
      <button class="add-btn">Add to Cart</button>
    </div>
  `;

  // Add to Cart button ka click event
  const addBtn = card.querySelector('.add-btn');
  addBtn.addEventListener('click', function () {
    cart.push({ id: item.id, name: item.name, emoji: item.emoji, price: item.finalPrice });
    updateCartCount();

    addBtn.textContent = 'Added ✓';
    addBtn.classList.add('added');

    setTimeout(() => {
      addBtn.textContent = 'Add to Cart';
      addBtn.classList.remove('added');
    }, 1000);
  });

  return card;
}

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.length;
}

// Cart icon click karne par checkout page par le jao, cart data URL me bhejte hue
document.getElementById('cartIcon').addEventListener('click', function () {
  if (cart.length === 0) {
    alert('Pehle kuch items cart me add karein');
    return;
  }

  // Cart data ko URL-safe banake bhejna (real app me yeh sessionStorage/
  // backend cart table me hota, yahan demo ke liye URL param use kar rahe hain)
  const cartData = encodeURIComponent(JSON.stringify(cart));
  window.location.href = `checkout.html?cart=${cartData}&name=${encodeURIComponent(currentUserName)}`;
});

// Backend se real food items mangwana
async function renderMenu() {
  const grid = document.getElementById('foodGrid');

  try {
    const response = await fetch(`${API_BASE}/api/items`);
    const items = await response.json();

    grid.innerHTML = ''; // pehle se kuch ho to hata do
    items.forEach(item => {
      grid.appendChild(createFoodCard(item));
    });
  } catch (err) {
    // Agar backend nahi chal raha, to yeh dikhao
    grid.innerHTML = `
      <p style="grid-column: 1/-1; text-align:center; color:#9BA79E; padding: 40px;">
        ⚠️ Backend server se connect nahi ho paya.<br>
        Kya <code>backend</code> folder me <code>npm start</code> chalaya hua hai?
      </p>
    `;
    console.error(err);
  }
}

// Welcome message dikhana
function showWelcome() {
  const title = document.querySelector('.section-title');
  if (title) {
    title.textContent = `Namaste ${currentUserName}, aaj kya khayenge?`;
  }
}

showWelcome();
renderMenu();
