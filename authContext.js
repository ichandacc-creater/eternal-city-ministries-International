// ===== User Auth State Management (minimal, safe) =====
import { onUserAuthStateChanged, getCurrentUser, logOut } from './auth.js';

export async function initAuthState() {
  return new Promise((resolve) => {
    onUserAuthStateChanged((user) => {
      if (user) {
        updateUIForLoggedIn(user);
        resolve(user);
      } else {
        updateUIForLoggedOut();
        resolve(null);
      }
    });
  });
}

export function updateUIForLoggedIn(user) {
  const authLinks = document.querySelectorAll('[data-auth="signin"]');
  const userLinks = document.querySelectorAll('[data-auth="user"]');
  authLinks.forEach(el => el.style.display = 'none');
  userLinks.forEach(el => el.style.display = 'inline-block');
  const userNameElement = document.getElementById('userName');
  if (userNameElement) userNameElement.textContent = user.email.split('@')[0];
}

export function updateUIForLoggedOut() {
  const authLinks = document.querySelectorAll('[data-auth="signin"]');
  const userLinks = document.querySelectorAll('[data-auth="user"]');
  authLinks.forEach(el => el.style.display = 'inline-block');
  userLinks.forEach(el => el.style.display = 'none');
}

export async function handleLogout() {
  const res = await logOut();
  if (res.success) {
    updateUIForLoggedOut();
    window.location.href = 'index.html';
  } else {
    alert('Logout error: ' + res.error);
  }
}

export function getCurrentUserEmail() {
  const u = getCurrentUser();
  return u ? u.email : null;
}

export async function setupAuthUI() {
  await initAuthState();
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); handleLogout(); });
}

export async function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'signin.html';
    return null;
  }
  return user;
}
