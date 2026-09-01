const path = document.getElementById('routePath');
const marker = document.getElementById('deliveryMarker');
const etaBadge = document.getElementById('etaBadge');
const steps = document.querySelectorAll('.step');

const pathLength = path.getTotalLength();

// Marker ko path ke shuru (restaurant) par rakho
function placeMarkerAt(percent) {
  const point = path.getPointAtLength(pathLength * percent);
  marker.setAttribute('transform', `translate(${point.x}, ${point.y})`);
}

function activateStep(stepIndex) {
  steps.forEach(step => {
    const idx = Number(step.dataset.step);
    step.classList.toggle('active', idx <= stepIndex);
  });
}

// ---- DEMO TIMELINE ----
// Real app me yeh sab ek WebSocket/server se live data aake hoga,
// jisme delivery boy ka phone GPS coordinates bhejta rehta hai
// har few second me, aur yeh marker un coordinates par move hota hai.
// Yahan hum demo ke liye time ke basis par simulate kar rahe hain.

placeMarkerAt(0);
activateStep(0); // Order Placed

let etaMinutes = 14;
etaBadge.textContent = `ETA: ${etaMinutes} min`;

// Step 1: Preparing (2 second baad)
setTimeout(() => {
  activateStep(1);
  etaMinutes = 11;
  etaBadge.textContent = `ETA: ${etaMinutes} min`;
}, 2000);

// Step 2: Out for Delivery + marker move karna shuru (5 second baad)
setTimeout(() => {
  activateStep(2);

  const totalDurationMs = 8000; // 8 second me poora route cover
  const startTime = Date.now();

  function animateMarker() {
    const elapsed = Date.now() - startTime;
    const percent = Math.min(elapsed / totalDurationMs, 1);

    placeMarkerAt(percent);

    // ETA ko bhi percent ke hisaab se ghatate jao
    const remainingMinutes = Math.max(Math.round(11 * (1 - percent)), 0);
    etaBadge.textContent = `ETA: ${remainingMinutes} min`;

    if (percent < 1) {
      requestAnimationFrame(animateMarker);
    } else {
      // Step 3: Delivered
      activateStep(3);
      etaBadge.textContent = 'Delivered ✅';
    }
  }

  requestAnimationFrame(animateMarker);
}, 5000);
