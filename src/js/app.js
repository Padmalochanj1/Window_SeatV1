const $ = s => document.querySelector(s);

let drops = [];
let rainLevel = 1;
let visualPlaying = true;

const canvas = $('#rainCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

function resize() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  makeDrops();
}

function makeDrops() {
  const count = Math.floor(100 + rainLevel * 110);
  drops = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    l: 7 + Math.random() * 23,
    s: 2 + Math.random() * 5,
    a: 0.15 + Math.random() * 0.45,
    w: 0.5 + Math.random() * 1.2
  }));
}

function rain() {
  if (!ctx) return;
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  if (rainLevel > 0) {
    ctx.lineCap = 'round';
    for (const d of drops) {
      ctx.strokeStyle = `rgba(220,235,245,${d.a * rainLevel})`;
      ctx.lineWidth = d.w;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - d.s * 0.25, d.y + d.l);
      ctx.stroke();

      if (visualPlaying) {
        d.y += d.s * (0.65 + rainLevel);
        d.x -= d.s * 0.08;
        if (d.y > innerHeight + 30) {
          d.y = -30;
          d.x = Math.random() * innerWidth;
        }
      }
    }
  }

  requestAnimationFrame(rain);
}

$('#playBtn')?.addEventListener('click', () => {
  if (typeof rainyTrainToggleMusic === 'function') rainyTrainToggleMusic();
});

$('#previousBtn')?.addEventListener('click', () => {
  if (typeof rainyTrainPrevious === 'function') rainyTrainPrevious();
});

$('#nextBtn')?.addEventListener('click', () => {
  if (typeof rainyTrainNext === 'function') rainyTrainNext();
});

$('#shuffleBtn')?.addEventListener('click', e => {
  if (typeof rainyTrainShuffle === 'function') rainyTrainShuffle();
  e.currentTarget.classList.add('active');
  setTimeout(() => e.currentTarget.classList.remove('active'), 450);
});

$('#repeatBtn')?.addEventListener('click', () => {
  if (typeof rainyTrainRepeat === 'function') rainyTrainRepeat();
});

$('#musicRange')?.addEventListener('input', e => {
  const pct = $('#musicPct');
  if (pct) pct.textContent = `${e.target.value}%`;
  if (typeof rainyTrainSetMusicVolume === 'function') {
    rainyTrainSetMusicVolume(e.target.value);
  }
});

$('#favoriteBtn')?.addEventListener('click', e => {
  e.currentTarget.textContent = e.currentTarget.textContent === '♡' ? '♥' : '♡';
});

const quotes = [
  '“Window seat, warm chai, no signal. Perfect.”',
  '“The rain sounds better through a train window.”',
  '“Four hours left. I’m in no hurry at all.”',
  '“Every station looks prettier when it’s raining.”'
];

let qi = 0;
$('#quoteCard')?.addEventListener('click', () => {
  const quoteText = $('#quoteText');
  if (quoteText) quoteText.textContent = quotes[++qi % quotes.length];
});

let onlineUsers = Math.floor(Math.random() * 1001) + 500;

function updateOnlineUsers() {
  onlineUsers += Math.floor(Math.random() * 21) - 10;
  onlineUsers = Math.max(500, Math.min(1500, onlineUsers));
  const counter = $('#online-count');
  if (counter) counter.textContent = onlineUsers;
}

window.addEventListener('resize', resize, { passive: true });
resize();
updateOnlineUsers();
setInterval(updateOnlineUsers, 10000);
rain();
