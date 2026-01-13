// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCxU2lluCuO_c3o0bIcZ0b-FC4NBVfiS8",
  authDomain: "ecmi-48962.firebaseapp.com",
  projectId: "ecmi-48962",
  storageBucket: "ecmi-48962.firebasestorage.app",
  messagingSenderId: "259495398658",
  appId: "1:259495398658:web:8eb51cd45799e223e1861b",
  measurementId: "G-GRRNNWLCFG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
// ===== Footer Year =====
document.getElementById('year').textContent = new Date().getFullYear();
// ===== Footer Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Firebase Auth =====
const signinForm = document.getElementById('signinForm');
const forgotPasswordLink = document.getElementById('forgotPassword');

if (signinForm) {
  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert("Signed in successfully!");
        // Redirect to dashboard or home
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  });
}

if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert("Password reset email sent!");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  });
}
// ===== Create Account =====
const signupForm = document.getElementById('signupForm');
const signupMessage = document.getElementById('signupMessage');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  signupMessage.textContent = '';
  signupMessage.className = 'auth-message';

  const firstName = document.getElementById('firstName').value.trim();
  const surname = document.getElementById('surname').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const country = document.getElementById('country').value.trim();
  const address = document.getElementById('address').value.trim();
  const province = document.getElementById('province').value.trim();
  const district = document.getElementById('district').value.trim();
  const postalCode = document.getElementById('postalCode').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('signupPassword').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // TODO: Save extra info in Firestore or Realtime Database
    // Example (if using Firestore):
    // import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
    // const db = getFirestore(app);
    // await setDoc(doc(db, "users", user.uid), {
    //   firstName, surname, email, country, address, province, district, postalCode, phone
    // });

    signupMessage.textContent = "Account created successfully!";
    signupMessage.classList.add('success');
  } catch (err) {
    signupMessage.textContent = err.message;
    signupMessage.classList.add('error');
  }
});


