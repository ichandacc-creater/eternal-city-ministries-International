// ===== Firebase Configuration & Authentication =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

// Enable persistent login
setPersistence(auth, browserLocalPersistence).catch(err => console.error("Persistence error:", err));

// ===== Authentication Functions =====

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Create a new user account
 */
export async function signUp(userData) {
  const {
    email,
    password,
    firstName,
    surname,
    country,
    address,
    province,
    district,
    postalCode,
    phone
  } = userData;

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      firstName,
      surname,
      country,
      address,
      province,
      district,
      postalCode,
      phone,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Sign out the current user
 */
export async function logOut() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get current user
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onUserAuthStateChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid) {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: "User profile not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { auth, db };
