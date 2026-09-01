// Demo ke liye pehle 3 items ko "recent orders" maan rahe hain.
// Real app me yeh list us customer ke actual past orders se aayegi.
const recentOrderIds = [1, 4, 5];

function createOrderCard(item) {
  const card = document.createElement('div');
  card.className = 'order-card';

  card.innerHTML = `
    <div class="order-emoji">${item.emoji}</div>
    <div class="order-details">
      <div class="order-name">${item.name}</div>
      <div class="order-date">Average rating: ⭐ ${item.rating.toFixed(1)}</div>
      <div class="stars" data-item-id="${item.id}">
        ${[1, 2, 3, 4, 5].map(n => `<span class="star" data-value="${n}">★</span>`).join('')}
      </div>
      <div class="rated-msg">✅ Rating ke liye shukriya!</div>
    </div>
  `;

  const starsContainer = card.querySelector('.stars');
  const stars = card.querySelectorAll('.star');
  const ratedMsg = card.querySelector('.rated-msg');

  stars.forEach(star => {
    star.addEventListener('mouseenter', function () {
      const value = Number(star.dataset.value);
      highlightStars(stars, value);
    });

    star.addEventListener('click', async function () {
      const givenRating = Number(star.dataset.value);

      try {
        // Backend ko real rating bhejo (userId abhi demo ke liye 1 rakha hai —
        // real app me logged-in user ki id URL/session se aayegi)
        await fetch(`${API_BASE}/api/items/${item.id}/rate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 1, stars: givenRating })
        });

        highlightStars(stars, givenRating);
        ratedMsg.style.display = 'block';
        stars.forEach(s => s.style.pointerEvents = 'none');
      } catch (err) {
        alert('⚠️ Backend server se connect nahi ho paya.');
        console.error(err);
      }
    });
  });

  starsContainer.addEventListener('mouseleave', function () {
    if (ratedMsg.style.display !== 'block') {
      highlightStars(stars, 0);
    }
  });

  return card;
}

function highlightStars(stars, value) {
  stars.forEach(star => {
    const starValue = Number(star.dataset.value);
    star.classList.toggle('filled', starValue <= value);
  });
}

// Backend se real items laake, unme se recent orders dikhana
async function renderOrders() {
  const list = document.getElementById('orderList');

  try {
    const response = await fetch(`${API_BASE}/api/items`);
    const items = await response.json();

    recentOrderIds.forEach(id => {
      const item = items.find(f => f.id === id);
      if (item) {
        list.appendChild(createOrderCard(item));
      }
    });
  } catch (err) {
    list.innerHTML = `
      <p style="text-align:center; color:#9BA79E; padding: 30px;">
        ⚠️ Backend server se connect nahi ho paya. Kya "npm start" chala hua hai backend folder me?
      </p>
    `;
    console.error(err);
  }
}

renderOrders();
