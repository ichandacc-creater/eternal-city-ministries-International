// ===== Mobile Menu Toggle =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.style.display === 'flex';
  mobileMenu.style.display = isOpen ? 'none' : 'flex';
  hamburger.setAttribute('aria-expanded', (!isOpen).toString());
});

// ===== Hero Slider =====
const slides = Array.from(document.querySelectorAll('.slide'));
const dotsContainer = document.getElementById('dots');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

let current = 0;
let timer;

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

// ===== Footer Year =====
document.getElementById('year').textContent = new Date().getFullYear();
