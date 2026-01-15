// Firebase initialization is handled in page-specific module(s) (e.g. inline in index.html).
// Avoid importing Firebase here to keep this file usable as a plain module without bundling.

// ===== Mobile Menu Toggle (safe) =====
const hamburger = document.getElementById('hamburger');

// ===== Modal (Sign In / Sign Up / Contact) =====
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function openModal(contentHtml) {
  if (!modalOverlay || !modalBody) return;
  modalBody.innerHTML = contentHtml;
  modalOverlay.classList.add('active');
  modalOverlay.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');
  modalBody.innerHTML = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

function signInHtml() {
  return `
    <div class="modal-content">
      <h3 id="modalTitle">Sign In</h3>
      <p>Welcome back — sign in to access member resources.</p>
      <form id="signInForm" class="auth-form active-form">
        <div class="form-group"><label for="si-email">Email</label><input id="si-email" name="email" type="email" placeholder="you@example.com" required></div>
        <div class="form-group"><label for="si-pass">Password</label><input id="si-pass" name="password" type="password" placeholder="Password" required></div>
        <button class="btn-block" type="submit">Sign In</button>
        <p class="auth-link"><a href="#" id="modalForgot">Forgot Password?</a></p>
        <div class="auth-link">Don't have an account? <a href="#" id="toSignUp">Create one</a></div>
      </form>
    </div>
  `;
}

function signUpHtml() {
  return `
    <div class="modal-content">
      <h3 id="modalTitle">Sign Up</h3>
      <p>Create a free account to partner and receive updates.</p>
      <form id="signUpForm" class="auth-form active-form">
        <div class="form-row"><div class="form-group"><label for="su-first">First</label><input id="su-first" name="first" required></div><div class="form-group"><label for="su-last">Last</label><input id="su-last" name="last"></div></div>
        <div class="form-group"><label for="su-email">Email</label><input id="su-email" name="email" type="email" required></div>
        <div class="form-group"><label for="su-pass">Password</label><input id="su-pass" name="password" type="password" required></div>
        <button class="btn-block" type="submit">Create Account</button>
        <div class="auth-link">Already a member? <a href="#" id="toSignIn">Sign In</a></div>
      </form>
    </div>
  `;
}

function contactHtml() {
  return `
    <div class="modal-content">
      <h3 id="modalTitle">Contact Us</h3>
      <p>Send us a message and we'll get back to you.</p>
      <form id="contactForm" class="auth-form active-form">
        <div class="form-group"><label for="ct-name">Name</label><input id="ct-name" name="name" required></div>
        <div class="form-group"><label for="ct-email">Email</label><input id="ct-email" name="email" type="email" required></div>
        <div class="form-group"><label for="ct-msg">Message</label><textarea id="ct-msg" name="message" rows="4" required></textarea></div>
        <button class="btn-block" type="submit">Send Message</button>
      </form>
    </div>
  `;
}

// Attach openers
const openSignIn = document.getElementById('openSignIn');
const openSignInMobile = document.getElementById('openSignInMobile');
const openSignUp = document.getElementById('openSignUp');

if (openSignIn) openSignIn.addEventListener('click', (e) => { e.preventDefault(); openModal(signInHtml()); attachModalFormHandlers(); });
if (openSignInMobile) openSignInMobile.addEventListener('click', (e) => { e.preventDefault(); openModal(signInHtml()); attachModalFormHandlers(); });
if (openSignUp) openSignUp.addEventListener('click', (e) => { e.preventDefault(); openModal(signUpHtml()); attachModalFormHandlers(); });

function attachModalFormHandlers() {
  // wire delegated links inside modal
  const toSignUp = document.getElementById('toSignUp');
  const toSignIn = document.getElementById('toSignIn');
  const modalForgot = document.getElementById('modalForgot');
  if (toSignUp) toSignUp.addEventListener('click', (ev) => { ev.preventDefault(); openModal(signUpHtml()); attachModalFormHandlers(); });
  if (toSignIn) toSignIn.addEventListener('click', (ev) => { ev.preventDefault(); openModal(signInHtml()); attachModalFormHandlers(); });
  if (modalForgot) modalForgot.addEventListener('click', (ev) => { ev.preventDefault(); window.location.href = 'signin.html'; });

  const signInForm = document.getElementById('signInForm');
  if (signInForm) signInForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const email = document.getElementById('si-email').value;
    // TODO: integrate real auth; for now present success message
    setCurrentUser?.(email);
    modalBody.innerHTML = `<div class="modal-content"><h3>Welcome</h3><p>Signed in as ${email}.</p><div style="margin-top:12px"><button class="btn-block" id="closeAfter">Close</button></div></div>`;
    document.getElementById('closeAfter').addEventListener('click', () => { closeModal(); renderAuthArea(); });
  });

  const signUpForm = document.getElementById('signUpForm');
  if (signUpForm) signUpForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const email = document.getElementById('su-email').value;
    setCurrentUser?.(email);
    modalBody.innerHTML = `<div class="modal-content"><h3>Account Created</h3><p>Thanks — a confirmation was sent to ${email}.</p><div style="margin-top:12px"><button class="btn-block" id="closeAfter2">Close</button></div></div>`;
    document.getElementById('closeAfter2').addEventListener('click', () => { closeModal(); renderAuthArea(); });
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) contactForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = document.getElementById('ct-name').value;
    modalBody.innerHTML = `<div class="modal-content"><h3>Message Sent</h3><p>Thanks ${name}, we'll be in touch soon.</p><div style="margin-top:12px"><button class="btn-block" id="closeAfter3">Close</button></div></div>`;
    document.getElementById('closeAfter3').addEventListener('click', closeModal);
  });
}

// Handle contact anchors: open modal on desktop, navigate to full Contact page on mobile/touch
document.querySelectorAll('a[href="#contact"]').forEach(a => a.addEventListener('click', (e) => {
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  const isSmall = window.innerWidth <= 768;
  if (isSmall || isTouch) {
    e.preventDefault();
    window.location.href = 'Contact.html';
    return;
  }
  e.preventDefault();
  openModal(contactHtml());
  attachModalFormHandlers();
}));

// ===== Preloader: show logo2 until window load (minimum display 3s) =====
const preloader = document.getElementById('preloader');
if (preloader) {
  const preloaderStart = performance.now();
  const MIN_MS = 3000; // minimum time to show preloader (3s)

  function hidePreloader() {
    preloader.classList.add('hidden');
    setTimeout(() => { if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader); }, 500);
  }

  window.addEventListener('load', () => {
    const elapsed = performance.now() - preloaderStart;
    const remaining = Math.max(0, MIN_MS - elapsed);
    if (remaining > 0) {
      setTimeout(hidePreloader, remaining);
    } else {
      hidePreloader();
    }
  });

  // Safety fallback: force hide after 8s regardless
  setTimeout(() => { if (preloader && !preloader.classList.contains('hidden')) hidePreloader(); }, 8000);
}

// ===== Simple auth UI (demo) - localStorage backed =====
const authArea = document.getElementById('authArea');
const mobileAuthArea = document.getElementById('mobileAuthArea');

function getCurrentUser() {
  try { return localStorage.getItem('ecmi_user'); } catch (e) { return null; }
}

function setCurrentUser(email) {
  try { localStorage.setItem('ecmi_user', email); } catch (e) {}
}

function clearCurrentUser() {
  try { localStorage.removeItem('ecmi_user'); } catch (e) {}
}

function renderAuthArea() {
  const user = getCurrentUser();
  if (!authArea) return;
  if (user) {
    authArea.innerHTML = `<span style="font-weight:700;color:var(--primary);">${user.split('@')[0]}</span> <a href="#" id="logoutBtn" class="cta" style="margin-left:10px;background:transparent;color:var(--gold);border:2px solid var(--gold);">Logout</a>`;
  } else {
    // If modal is present, provide modal openers; otherwise fallback to signin.html
    if (modalOverlay) {
      authArea.innerHTML = `<a href="#" class="cta" id="openSignIn">Sign In</a> <a href="#" class="cta" id="openSignUp" style="margin-left:8px; background:transparent; border:2px solid var(--gold); color:var(--gold);">Sign Up</a>`;
    } else {
      authArea.innerHTML = `<a href="signin.html" class="cta">Sign In</a>`;
    }
  }
  // mobile
  if (mobileAuthArea) {
    if (user) {
      mobileAuthArea.innerHTML = `<a href="#" id="logoutBtnMobile" class="cta" style="background:transparent;color:var(--gold);border:2px solid var(--gold);">Logout</a>`;
    } else if (modalOverlay) {
      mobileAuthArea.innerHTML = `<a href="#" class="cta" id="openSignInMobile">Sign In</a>`;
    } else {
      mobileAuthArea.innerHTML = `<a href="signin.html" class="cta">Sign In</a>`;
    }
  }

  // attach listeners
  const logoutBtn = document.getElementById('logoutBtn');
  const logoutBtnMobile = document.getElementById('logoutBtnMobile');
  if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); clearCurrentUser(); renderAuthArea(); });
  if (logoutBtnMobile) logoutBtnMobile.addEventListener('click', (e) => { e.preventDefault(); clearCurrentUser(); renderAuthArea(); if (mobileMenu) mobileMenu.style.display = 'none'; });

  // re-bind sign in/up openers to work after html replacement
  const openSignInNow = document.getElementById('openSignIn');
  const openSignUpNow = document.getElementById('openSignUp');
  const openSignInMobileNow = document.getElementById('openSignInMobile');
  if (openSignInNow) openSignInNow.addEventListener('click', (e) => { e.preventDefault(); openModal(signInHtml()); attachModalFormHandlers(); });
  if (openSignUpNow) openSignUpNow.addEventListener('click', (e) => { e.preventDefault(); openModal(signUpHtml()); attachModalFormHandlers(); });
  if (openSignInMobileNow) openSignInMobileNow.addEventListener('click', (e) => { e.preventDefault(); openModal(signInHtml()); attachModalFormHandlers(); if (mobileMenu) mobileMenu.style.display = 'none'; });
}

// initialize auth area on load
renderAuthArea();

const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const computed = window.getComputedStyle(mobileMenu).display;
    const isOpen = computed === 'flex' || computed === 'block';
    mobileMenu.style.display = isOpen ? 'none' : 'flex';
    hamburger.setAttribute('aria-expanded', (!isOpen).toString());
  });
}

// Hide mobile menu after clicking any menu link (so it closes like when navigating to Programs)
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    try { mobileMenu.style.display = 'none'; } catch (e) {}
    try { hamburger.setAttribute('aria-expanded', 'false'); } catch (e) {}
  }));
}

// ===== Hero Slider (safe initialization) =====
const slides = Array.from(document.querySelectorAll('.slide'));
const dotsContainer = document.getElementById('dots');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

let current = 0;
let timer;

if (slides.length && prev && next && dotsContainer) {
  // Render navigation dots
  function renderDots() {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  // Go to a specific slide
  function goTo(index) {
    slides[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    renderDots();
    resetAuto();
  }

  // Next/Prev slide
  function nextSlide() { goTo(current + 1); }
  function prevSlide() { goTo(current - 1); }

  // Auto slide every 5 seconds
  function startAuto() { timer = setInterval(nextSlide, 5000); }
  function resetAuto() { clearInterval(timer); startAuto(); }

  // Event listeners
  prev.addEventListener('click', prevSlide);
  next.addEventListener('click', nextSlide);

  // Initialize
  renderDots();
  startAuto();
}

// ===== Show transforming hero text only once on first slide (3s) =====
(function() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  // Ensure JS can reveal it; start hidden via CSS
  let shown = false;

  function showOnceFor3s() {
    if (shown) return;
    const activeSlide = document.querySelector('.slide.active');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const idx = slides.indexOf(activeSlide);
    if (idx === 0) {
      heroContent.classList.add('show');
      shown = true;
      setTimeout(() => { heroContent.classList.remove('show'); }, 9000);
    }
  }

  // Try immediately (page load)
  showOnceFor3s();

  // Poll briefly in case slider initializes after this script runs
  const poll = setInterval(() => {
    if (shown) { clearInterval(poll); return; }
    showOnceFor3s();
  }, 300);
  // Stop polling after 12 seconds
  setTimeout(() => clearInterval(poll), 12000);
})();

// ===== Footer Year =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Note: Authentication form handling is implemented in signin.html (module) and auth.js.
// This file avoids implementing auth logic to prevent duplicate/conflicting code across pages.

// ===== Countdown (switchable modes) =====
const countdownRoot = document.getElementById('eternal-countdown');
if (countdownRoot) {
  const elMonths = document.getElementById('cd-months');
  const elWeeks = document.getElementById('cd-weeks');
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');
  const titleEl = countdownRoot.querySelector('.countdown-title');
  const noteEl = countdownRoot.querySelector('.count-note');
  const btnEternal = document.getElementById('cdModeEternal');
  const btnSunday = document.getElementById('cdModeSunday');

  function getLastFridayOfOctober(year) {
    const d = new Date(year, 9, 31, 19, 0, 0);
    const day = d.getDay(); // 0=Sun .. 6=Sat
    const offset = (day - 5 + 7) % 7; // days to subtract to get back to Friday
    return new Date(year, 9, 31 - offset, 19, 0, 0);
  }

  function getNextEternalExperience(now) {
    const thisYear = getLastFridayOfOctober(now.getFullYear());
    if (now < thisYear) return thisYear;
    return getLastFridayOfOctober(now.getFullYear() + 1);
  }

  function getNextSundayAtNine(now) {
    // Sunday is 0
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
    const day = now.getDay();
    let daysToAdd = (7 - day) % 7; // 0 means today is Sunday
    if (daysToAdd === 0) {
      // If today is Sunday, check time
      if (now >= today) daysToAdd = 7; // next Sunday
      else daysToAdd = 0; // later today at 9:00
    }
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToAdd, 9, 0, 0);
    return target;
  }

  function addMonths(date, months) {
    const d = new Date(date.getTime());
    const y = d.getFullYear();
    const m = d.getMonth() + months;
    const nd = new Date(y, m, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
    while (nd.getMonth() !== ((m % 12 + 12) % 12)) nd.setDate(nd.getDate() - 1);
    return nd;
  }

  function computeParts(now, target) {
    if (target <= now) return { months:0, weeks:0, days:0, hours:0, minutes:0, seconds:0 };
    let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    if (months < 0) months = 0;
    while (months > 0 && addMonths(now, months) > target) months--;
    const afterMonths = addMonths(now, months);
    let delta = Math.max(0, target - afterMonths);
    let seconds = Math.floor(delta / 1000);
    const weeks = Math.floor(seconds / (7 * 24 * 3600));
    seconds -= weeks * 7 * 24 * 3600;
    const days = Math.floor(seconds / (24 * 3600));
    seconds -= days * 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return { months, weeks, days, hours, minutes, seconds };
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  // Mode: 'eternal' or 'sunday'
  let mode = 'eternal';

  function setMode(m) {
    mode = m;
    if (btnEternal && btnSunday) {
      btnEternal.classList.toggle('active', mode === 'eternal');
      btnSunday.classList.toggle('active', mode === 'sunday');
    }
    if (titleEl) titleEl.textContent = mode === 'eternal' ? 'Eternal Experience' : 'Sunday Service';
    if (noteEl) noteEl.textContent = mode === 'eternal' ? 'Next last Friday of October' : 'Next Sunday service — 9:00 AM';
    updateCountdown();
  }

  function getTargetForMode(now) {
    return mode === 'sunday' ? getNextSundayAtNine(now) : getNextEternalExperience(now);
  }

  function updateCountdown() {
    const now = new Date();
    const target = getTargetForMode(now);
    const parts = computeParts(now, target);
    if (elMonths) elMonths.textContent = parts.months;
    if (elWeeks) elWeeks.textContent = parts.weeks;
    if (elDays) elDays.textContent = parts.days;
    if (elHours) elHours.textContent = pad(parts.hours);
    if (elMinutes) elMinutes.textContent = pad(parts.minutes);
    if (elSeconds) elSeconds.textContent = pad(parts.seconds);

    // Add highlight pulse when a value changes (subtle animation)
    try {
      ['cd-months','cd-weeks','cd-days','cd-hours','cd-minutes','cd-seconds'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const parent = el.closest('.count-item');
        if (!parent) return;
        parent.classList.remove('highlight');
        // reflow then add class to retrigger animation
        void parent.offsetWidth;
        parent.classList.add('highlight');
      });
    } catch (e) {}
  }

  // Auto-switch between modes every 4 seconds; restart when user interacts
  const AUTO_SWITCH_MS = 10000;
  let autoSwitchId = null;
  function startAutoSwitch() {
    stopAutoSwitch();
    autoSwitchId = setInterval(() => {
      setMode(mode === 'eternal' ? 'sunday' : 'eternal');
    }, AUTO_SWITCH_MS);
  }
  function stopAutoSwitch() {
    if (autoSwitchId) { clearInterval(autoSwitchId); autoSwitchId = null; }
  }

  if (btnEternal) btnEternal.addEventListener('click', () => { setMode('eternal'); startAutoSwitch(); });
  if (btnSunday) btnSunday.addEventListener('click', () => { setMode('sunday'); startAutoSwitch(); });

  console.log('Countdown initialized (switchable modes)');
  setMode('eternal');
  startAutoSwitch();
  setInterval(updateCountdown, 1000);
}

// ===== Newsletter subscription (Firestore) =====
import { getApp, getApps } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

let db = null;
try {
  if (getApps().length) {
    db = getFirestore(getApp());
  } else {
    console.warn('Firebase app not initialized in page — newsletter will not work without initializing Firebase.');
  }
} catch (e) {
  console.error('Error initializing Firestore:', e);
}

const newsletterForm = document.getElementById('newsletterForm');
const newsletterResult = document.getElementById('newsletterResult');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const input = newsletterForm.querySelector('input[name="EMAIL"]');
    const email = input && input.value && input.value.trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      if (newsletterResult) { newsletterResult.style.display = 'block'; newsletterResult.className = 'auth-message error'; newsletterResult.textContent = 'Please enter a valid email.'; }
      return;
    }
    // Immediate UI feedback
    const subscribeBtn = document.getElementById('subscribeBtn');
    if (newsletterResult) { newsletterResult.style.display = 'block'; newsletterResult.className = 'auth-message success'; newsletterResult.textContent = 'Subscribed'; }
    subscribeBtn && (subscribeBtn.disabled = true);

    // If Firestore isn't available, leave the UI as 'Subscribed' and re-enable shortly
    if (!db) {
      console.warn('Firestore not initialized — storing subscribers disabled.');
      setTimeout(() => { subscribeBtn && (subscribeBtn.disabled = false); }, 1500);
      return;
    }

    try {
      await addDoc(collection(db, 'newsletter_subscribers'), { email, createdAt: serverTimestamp(), source: 'website' });
      // keep 'Subscribed' message; reset form
      newsletterForm.reset();
    } catch (err) {
      console.error('Failed to add subscriber:', err);
      if (newsletterResult) { newsletterResult.style.display = 'block'; newsletterResult.className = 'auth-message error'; newsletterResult.textContent = 'Subscription failed. Please try again later.'; }
    } finally {
      subscribeBtn && (subscribeBtn.disabled = false);
    }
  });
}


