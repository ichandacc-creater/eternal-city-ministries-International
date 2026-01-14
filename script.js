// Firebase initialization is handled in page-specific module(s) (e.g. inline in index.html).
// Avoid importing Firebase here to keep this file usable as a plain module without bundling.

// ===== Mobile Menu Toggle (safe) =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const computed = window.getComputedStyle(mobileMenu).display;
    const isOpen = computed === 'flex' || computed === 'block';
    mobileMenu.style.display = isOpen ? 'none' : 'flex';
    hamburger.setAttribute('aria-expanded', (!isOpen).toString());
  });
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


