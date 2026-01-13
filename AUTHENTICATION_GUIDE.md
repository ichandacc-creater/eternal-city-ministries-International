# Authentication System Documentation

## Overview
This is a complete Firebase Authentication system for the Eternal City Ministries International website. It supports user registration, login, password reset, and persistent sessions.

## Files Created/Modified

### 1. **auth.js** - Core Authentication Module
Main module handling all Firebase authentication operations.

**Key Functions:**
- `signIn(email, password)` - Authenticate existing user
- `signUp(userData)` - Create new user account
- `resetPassword(email)` - Send password reset email
- `logOut()` - Sign out current user
- `getCurrentUser()` - Get active user object
- `onUserAuthStateChanged(callback)` - Listen to auth state changes
- `getUserProfile(uid)` - Fetch user data from Firestore

**Example Usage:**
```javascript
import { signIn, signUp } from './auth.js';

// Sign in
const result = await signIn('user@example.com', 'password123');
if (result.success) {
  console.log('Logged in:', result.user);
} else {
  console.error('Login failed:', result.error);
}
```

### 2. **authContext.js** - User State Management
Handles user state across pages and updates UI based on authentication status.

**Key Functions:**
- `setupAuthUI()` - Initialize auth UI on page load
- `initAuthState()` - Check current auth state
- `updateUIForLoggedIn(user)` - Show logged-in UI
- `updateUIForLoggedOut()` - Show logged-out UI
- `handleLogout()` - Handle logout action
- `requireAuth()` - Protect pages from unauthorized access
- `isAuthenticated()` - Check if user is logged in

**Example Usage:**
```javascript
import { setupAuthUI, requireAuth } from './authContext.js';

// On page load
const user = await setupAuthUI();

// Require authentication on certain pages
await requireAuth(); // Redirects to signin if not logged in
```

### 3. **signin.html** - Login/Registration Page
Clean, modern interface with two tabs:
- **Sign In Tab** - Login for existing users
- **Create Account Tab** - Registration form for new users

**Features:**
- Email/password sign in
- User registration with profile information
- Password reset via email
- Form validation
- Real-time error/success messages
- Responsive mobile design
- Tab switching between Sign In and Sign Up

### 4. **styles.css** - Authentication Styling
Professional CSS for authentication components.

**Classes:**
- `.auth-section` - Main container
- `.signin-card` - Card wrapper
- `.auth-tabs` - Tab navigation
- `.auth-form` - Form container
- `.form-group` - Field wrapper
- `.form-row` - Multi-column layout
- `.auth-message` - Error/success messages
- `.btn-block` - Full-width buttons

## Setup Instructions

### 1. Firebase Configuration
The system uses your existing Firebase project credentials:
```
Project ID: ecmi-48962
Auth Domain: ecmi-48962.firebaseapp.com
API Key: AIzaSyCCxU2lluCuO_c3o0bIcZ0b-FC4NBVfiS8
```

**Required Firebase Services:**
- Authentication (Email/Password)
- Firestore Database (for storing user profiles)

### 2. Enable Firebase Authentication
1. Go to Firebase Console
2. Select "ecmi-48962" project
3. Navigate to Authentication → Sign-in method
4. Enable "Email/Password" provider

### 3. Create Firestore Database
1. Go to Firestore Database
2. Create a new database in production mode
3. Create a collection called "users"
4. Security rules (recommended):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, update, delete: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
    }
  }
}
```

## Usage Guide

### Basic Sign In
```html
<a href="signin.html" class="cta">Sign In</a>
```

### Check Authentication Status
```javascript
import { setupAuthUI } from './authContext.js';

// Initialize auth on page load
setupAuthUI();
```

### Protect Pages
```javascript
import { requireAuth } from './authContext.js';

// User must be logged in to access this page
await requireAuth();
```

### Create Logout Button
```html
<button id="logoutBtn">Log Out</button>
```

Then in your script:
```javascript
import { setupAuthUI } from './authContext.js';
setupAuthUI(); // Automatically handles logout button
```

### Update Navbar for Logged-In Users
Add these attributes to your navbar:
```html
<!-- Show when user is logged in -->
<a href="profile.html" data-auth="user">Profile</a>
<button id="logoutBtn" data-auth="user">Logout</button>

<!-- Show when user is NOT logged in -->
<a href="signin.html" data-auth="signin">Sign In</a>
```

## User Data Structure
When users sign up, their profile is stored in Firestore with this structure:
```json
{
  "uid": "user-uid",
  "email": "user@example.com",
  "firstName": "John",
  "surname": "Doe",
  "country": "United States",
  "address": "123 Main St",
  "province": "California",
  "district": "San Francisco",
  "postalCode": "94103",
  "phone": "+1 (415) 555-0123",
  "createdAt": "2024-01-13T10:00:00Z",
  "updatedAt": "2024-01-13T10:00:00Z"
}
```

## Security Features
- ✅ Password minimum 6 characters
- ✅ Email verification ready
- ✅ Password reset via email
- ✅ Persistent login (localStorage)
- ✅ Automatic logout on sign out
- ✅ Protected user data in Firestore
- ✅ Form validation on client and server

## Error Handling
The system provides user-friendly error messages for:
- Invalid email format
- Weak passwords
- Email already in use
- Wrong password
- User not found
- Network errors

## Customization

### Modify Sign-In Fields
Edit the form in `signin.html` and update the corresponding field IDs in the form handlers.

### Change Redirect After Login
In `signin.html`, update the redirect URL:
```javascript
window.location.href = 'dashboard.html'; // Change this
```

### Custom Styling
All auth styles are in `styles.css` under the `/* ===== Authentication Styles ===== */` section.

### Add Additional User Fields
1. Add input field to signup form in `signin.html`
2. Add field to `userData` object in form handler
3. Update `setDoc` call in `auth.js` signup function
4. Add field to Firestore security rules

## Troubleshooting

### Users can't sign in
- Check Firebase Authentication is enabled
- Verify email/password are correct
- Check browser console for errors

### Profile data not saving
- Verify Firestore database is created
- Check Firestore security rules
- Ensure collection is named "users"

### Persistent login not working
- Check browser localStorage is enabled
- Verify `browserLocalPersistence` is set in auth.js

### Password reset email not received
- Check email address is correct
- Verify Firebase project has email configured
- Check spam folder

## Next Steps

1. **Implement Email Verification**
   - Add `sendEmailVerification()` after signup
   - Verify email before full access

2. **Add User Profile Page**
   - Create `profile.html` to display/edit user info
   - Use `getUserProfile()` to fetch data

3. **Add Social Login**
   - Enable Google/Facebook in Firebase
   - Add social auth buttons to signin form

4. **Implement Role-Based Access**
   - Add role field to user document
   - Check roles in `requireAuth()` function

5. **Add Two-Factor Authentication**
   - Implement phone verification
   - Store phone number in user profile

## Support
For Firebase documentation, visit: https://firebase.google.com/docs/auth
