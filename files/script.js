/* ============================================================
   PROPOSAL SITE — SCRIPT
   Shared across index.html / memories.html / proposal.html.
   Each section below checks for the elements it needs, so this
   single file is safe to include on every page.
   ============================================================ */

/* ---------- EDIT ME ----------
   Personalize these two values and the love letter text further
   down — everything else works automatically.
-------------------------------- */
const FIRST_MET_DATE = new Date('2016-07-02T00:00:00'); // ← set your real "day we met"
const LOVE_LETTER = `Today is July 2, 2026.
Nanziba,

It seems like 10 years of our love have passed. It feels like that day, when my feelings for you first started to take shape on July 2, 2016. We may not have known what the future would bring, but one thing was certain—I loved you, and I still do.

A lot has changed in these 10 years. Times have changed, circumstances have changed, we ourselves have changed a lot. But one thing has never changed—the place in my heart for you.

Every moment spent with you, every smile, every pride, every fight, and every meeting have become part of the most precious memories of my life. You are not just my love, you are my habit, my peace, my strength, and my most beautiful feeling.

If I have ever hurt you, I apologize for that. And thank you, for being by my side for all these years, for understanding me, for accepting my good and bad.

Today marks 10 years of our love, but I want this to be just a milestone. I want us to walk the path holding each other's hands in the same way in the days to come, create new memories, and celebrate each July 2nd more beautifully.`;

document.addEventListener('DOMContentLoaded', () => {
  initFloatingHearts();
  initCountdown();
  initLoveLetter();
  initTimelineReveal();
  initSlideshow();
  initMemoryCardsTouch();
  initGalleryLightbox();
  initQuoteCarousel();
  initMusicToggle();
  initProposalPage();
});

/* ============================================================
   FLOATING HEARTS AMBIENCE — every page
   ============================================================ */
function initFloatingHearts(){
  const field = document.getElementById('heartField');
  if (!field) return;

  const glyphs = ['❤','💕','💖','♥'];

  function spawnHeart(){
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    const size = 12 + Math.random() * 18;
    const left = Math.random() * 100;
    const dur = 7 + Math.random() * 6;
    const drift = (Math.random() * 80 - 40) + 'px';

    heart.style.setProperty('--size', size + 'px');
    heart.style.setProperty('--dur', dur + 's');
    heart.style.setProperty('--drift', drift);
    heart.style.left = left + '%';

    field.appendChild(heart);
    setTimeout(() => heart.remove(), dur * 1000 + 200);
  }

  // gentle, not overwhelming
  for (let i = 0; i < 4; i++) setTimeout(spawnHeart, i * 900);
  setInterval(spawnHeart, 1600);
}

/* ============================================================
   COUNTDOWN SINCE FIRST MEETING — index.html
   ============================================================ */
function initCountdown(){
  const daysEl = document.getElementById('cd-days');
  if (!daysEl) return;

  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  function tick(){
    const now = new Date();
    let diff = Math.max(0, now - FIRST_MET_DATE);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(4, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   TYPING LOVE LETTER EFFECT — index.html
   ============================================================ */
function initLoveLetter(){
  const body = document.getElementById('letterBody');
  if (!body) return;

  const text = LOVE_LETTER;
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'cursor';

  function typeNext(){
    if (i <= text.length){
      body.textContent = text.slice(0, i);
      body.appendChild(cursor);
      i += 2; // small batches for a natural, quick typing feel
      const delay = 14 + Math.random() * 18;
      setTimeout(typeNext, delay);
    }
  }

  // start once the letter card scrolls into view
  const target = document.querySelector('.letter-card');
  if ('IntersectionObserver' in window && target){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          typeNext();
          obs.disconnect();
        }
      });
    }, { threshold: .35 });
    obs.observe(target);
  } else {
    typeNext();
  }
}

/* ============================================================
   TIMELINE SCROLL REVEAL — index.html
   ============================================================ */
function initTimelineReveal(){
  const items = document.querySelectorAll('.t-item');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)){
    items.forEach(i => i.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .2 });

  items.forEach(item => obs.observe(item));
}

/* ============================================================
   PHOTO SLIDESHOW — memories.html
   ============================================================ */
function initSlideshow(){
  const slideshow = document.getElementById('slideshow');
  if (!slideshow) return;

  const slides = slideshow.querySelectorAll('.slide');
  const dots = slideshow.querySelectorAll('.slide-dots button');
  let current = 0;
  let timer;

  function show(idx){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      show(parseInt(dot.dataset.i, 10));
      restart();
    });
  });

  function restart(){
    clearInterval(timer);
    timer = setInterval(() => show(current + 1), 4500);
  }

  restart();
}

/* ============================================================
   MEMORY CARD FLIP — tap support for touch devices
   (desktop flips on hover via CSS already)
   ============================================================ */
function initMemoryCardsTouch(){
  const cards = document.querySelectorAll('.memory-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

/* ============================================================
   GALLERY LIGHTBOX — memories.html
   ============================================================ */
function initGalleryLightbox(){
  const frames = document.querySelectorAll('.polaroid');
  if (!frames.length) return;

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:100; display:flex;
    align-items:center; justify-content:center; padding:6%;
    background:rgba(74,41,50,.82); opacity:0; pointer-events:none;
    transition:opacity .35s ease;
  `;
  const box = document.createElement('div');
  box.style.cssText = `
    width:min(420px,100%); aspect-ratio:1/1; border-radius:14px;
    overflow:hidden; transform:scale(.92); transition:transform .35s ease;
    box-shadow:0 30px 70px rgba(0,0,0,.4);
  `;
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  function close(){
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    box.style.transform = 'scale(.92)';
  }

  overlay.addEventListener('click', close);

  frames.forEach(frame => {
    frame.addEventListener('click', () => {
      const photo = frame.querySelector('.polaroid-photo');
      box.innerHTML = photo ? photo.outerHTML : '';
      const inner = box.firstElementChild;
      if (inner) inner.style.cssText = 'width:100%;height:100%;border-radius:0;';
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
      box.style.transform = 'scale(1)';
    });
  });
}

/* ============================================================
   QUOTE CAROUSEL — memories.html
   ============================================================ */
function initQuoteCarousel(){
  const slides = document.querySelectorAll('.quote-slide');
  if (!slides.length) return;

  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4200);
}

/* ============================================================
   BACKGROUND MUSIC TOGGLE — memories.html
   ============================================================ */
function initMusicToggle(){
  const btn = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  if (!btn || !audio) return;

  let playing = false;
  const storageKeyTime = 'bgMusicTime';
  const storageKeyState = 'bgMusicPlaying';

  function updateButton(){
    if (playing){
      btn.classList.add('playing');
      btn.textContent = '⏸';
      btn.setAttribute('aria-label', 'Pause our song');
    } else {
      btn.classList.remove('playing');
      btn.textContent = '🎵';
      btn.setAttribute('aria-label', 'Play our song');
    }
  }

  function saveState(){
    localStorage.setItem(storageKeyTime, audio.currentTime.toString());
    localStorage.setItem(storageKeyState, playing ? '1' : '0');
  }

  audio.addEventListener('loadedmetadata', () => {
    const savedTime = parseFloat(localStorage.getItem(storageKeyTime) || '0');
    if (!Number.isNaN(savedTime)){
      audio.currentTime = Math.min(savedTime, audio.duration || savedTime);
    }

    const savedState = localStorage.getItem(storageKeyState);
    if (savedState !== '0'){
      audio.play().then(() => {
        playing = true;
        updateButton();
      }).catch(() => {
        playing = false;
        updateButton();
      });
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.paused){
      localStorage.setItem(storageKeyTime, audio.currentTime.toString());
    }
  });

  audio.addEventListener('play', () => {
    playing = true;
    updateButton();
    saveState();
  });

  audio.addEventListener('pause', () => {
    playing = false;
    updateButton();
    saveState();
  });

  window.addEventListener('beforeunload', saveState);

  btn.addEventListener('click', () => {
    if (!playing){
      audio.play().then(() => {
        playing = true;
        updateButton();
        saveState();
      }).catch((err) => {
        // Silently handle play error (browser autoplay policy, file missing, etc.)
        console.log('Audio playback failed:', err);
      });
    } else {
      audio.pause();
      playing = false;
      updateButton();
      saveState();
    }
  });
}

/* ============================================================
   PROPOSAL PAGE — buttons, wobble, confetti, accepted state
   ============================================================ */
function initProposalPage(){
  const overlay = document.getElementById('acceptedOverlay');
  if (!overlay) return;

  const yesBtn = document.getElementById('yesBtn');
  const yesAltBtn = document.getElementById('yesAltBtn');
  const wobblers = document.querySelectorAll('.btn-wobble');

  // a charming little wobble on hover — both buttons say yes,
  // this is just for fun, not for avoiding a click
  wobblers.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const rot = (Math.random() * 6 - 3).toFixed(1);
      btn.style.transform = `translateY(-4px) rotate(${rot}deg)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  function accept(){
    overlay.classList.add('show');
    launchConfetti();
    // little ring pulse encore a moment after the overlay appears
    setTimeout(launchConfetti, 700);
  }

  if (yesBtn) yesBtn.addEventListener('click', accept);
  if (yesAltBtn) yesAltBtn.addEventListener('click', accept);
}

function launchConfetti(){
  const host = document.getElementById('confettiHost') || document.body;
  const colors = ['#E8B4B8', '#FFD6E0', '#D4AF37', '#FFFFFF'];
  const count = 60;

  for (let i = 0; i < count; i++){
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    const size = 6 + Math.random() * 8;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const fall = 2.6 + Math.random() * 2;
    const delay = Math.random() * 0.4;
    const spin = Math.random() * 360;
    const drift = (Math.random() * 160 - 80);

    piece.style.left = left + 'vw';
    piece.style.width = size + 'px';
    piece.style.height = (size * 0.4) + 'px';
    piece.style.background = color;
    piece.style.transform = `rotate(${spin}deg)`;
    piece.style.animation = `confetti-fall ${fall}s ease-in ${delay}s forwards`;
    piece.style.setProperty('--drift', drift + 'px');

    host.appendChild(piece);
    setTimeout(() => piece.remove(), (fall + delay) * 1000 + 200);
  }
}

/* confetti fall keyframes injected once, used by launchConfetti() above */
(function injectConfettiKeyframes(){
  const style = document.createElement('style');
  style.textContent = `
    @keyframes confetti-fall{
      0%   { top:-5%; opacity:1; transform: translateX(0) rotate(0deg); }
      100% { top:105%; opacity:.9; transform: translateX(var(--drift)) rotate(540deg); }
    }
  `;
  document.head.appendChild(style);
})();
