# Quick Reference - Authentication API

## Import Statements

```javascript
// Authentication functions
import { 
  signIn, 
  signUp, 
  resetPassword, 
  logOut,
  getCurrentUser,
  onUserAuthStateChanged,
  getUserProfile
} from './auth.js';

// State management
import { 
  setupAuthUI, 
  requireAuth, 
  isAuthenticated,
  getCurrentUserEmail,
  getCurrentUserUID,
  handleLogout
} from './authContext.js';
```

## Core Functions

### Authentication

#### Sign In
```javascript
const result = await signIn(email, password);
// Returns: { success: true, user } or { success: false, error }
```

#### Sign Up
```javascript
const result = await signUp({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  surname: 'Doe',
  country: 'USA',
  address: '123 Main St',
  province: 'CA',
  district: 'San Francisco',
  postalCode: '94103',
  phone: '+1 (415) 555-0123'
});
// Returns: { success: true, user } or { success: false, error }
```

#### Password Reset
```javascript
const result = await resetPassword(email);
// Returns: { success: true } or { success: false, error }
```

#### Logout
```javascript
const result = await logOut();
// Returns: { success: true } or { success: false, error }
```

### User State

#### Initialize Auth UI
```javascript
const user = await setupAuthUI();
// Automatically handles:
// - Showing/hiding auth elements based on login status
// - Setting up logout button
// - Returning current user or null
```

#### Require Authentication
```javascript
const user = await requireAuth();
// Redirects to signin.html if not logged in
// Returns user if authenticated
```

#### Check if Authenticated
```javascript
if (isAuthenticated()) {
  console.log('User is logged in');
}
```

#### Get User Info
```javascript
const email = getCurrentUserEmail();
const uid = getCurrentUserUID();
const user = getCurrentUser();
```

#### Listen to Auth Changes
```javascript
onUserAuthStateChanged((user) => {
  if (user) {
    console.log('User logged in:', user.email);
  } else {
    console.log('User logged out');
  }
});
```

#### Get User Profile
```javascript
const result = await getUserProfile(uid);
if (result.success) {
  const profile = result.data;
  console.log(profile.firstName, profile.surname);
}
```

## HTML Data Attributes

```html
<!-- Show only when logged OUT -->
<a href="signin.html" data-auth="signin">Sign In</a>

<!-- Show only when logged IN -->
<a href="profile.html" data-auth="user">Profile</a>
<button id="logoutBtn" data-auth="user">Logout</button>
```

## Common Patterns

### Initialize Page
```javascript
<script type="module">
  import { setupAuthUI } from './authContext.js';
  
  // Initialize auth on every page
  setupAuthUI();
</script>
```

### Protect Page (require login)
```javascript
<script type="module">
  import { requireAuth } from './authContext.js';
  
  // Redirect to signin if not logged in
  const user = await requireAuth();
  
  // Code here only runs if user is authenticated
  console.log('Welcome,', user.email);
</script>
```

### Display User Email
```javascript
<script type="module">
  import { setupAuthUI, getCurrentUserEmail } from './authContext.js';
  
  setupAuthUI();
  
  const email = getCurrentUserEmail();
  if (email) {
    document.getElementById('userEmail').textContent = email;
  }
</script>
```

### Logout Button
```html
<button id="logoutBtn">Log Out</button>

<script type="module">
  import { setupAuthUI } from './authContext.js';
  setupAuthUI(); // Automatically sets up logout button
</script>
```

## Error Codes

```javascript
'auth/invalid-email'        // Invalid email format
'auth/user-not-found'       // User doesn't exist
'auth/wrong-password'       // Incorrect password
'auth/weak-password'        // Password < 6 characters
'auth/email-already-in-use' // Email already registered
'auth/network-request-failed' // Network error
'auth/too-many-requests'    // Too many login attempts
```

## Firestore User Document

Default structure when user signs up:

```javascript
{
  uid: "user-id-from-firebase",
  email: "user@example.com",
  firstName: "John",
  surname: "Doe",
  country: "USA",
  address: "123 Main St",
  province: "CA",
  district: "San Francisco",
  postalCode: "94103",
  phone: "+1 (415) 555-0123",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## CSS Classes for Customization

```css
.auth-section      /* Main auth container */
.signin-card       /* Card wrapper */
.auth-tabs         /* Tab navigation */
.auth-tab          /* Individual tab */
.auth-form         /* Form container */
.auth-form.active-form /* Currently visible form */
.form-group        /* Form field wrapper */
.form-row          /* Multi-column row */
.auth-message      /* Message container */
.auth-message.success /* Success message */
.auth-message.error   /* Error message */
.btn-block         /* Full-width button */
```

## Files Reference

| File | Purpose | Import |
|------|---------|--------|
| `auth.js` | Core Firebase functions | `import { ... } from './auth.js'` |
| `authContext.js` | State management | `import { ... } from './authContext.js'` |
| `signin.html` | Login/Register page | Link in navbar |
| `styles.css` | All styling | Included in HTML |

## Debugging

```javascript
// Check if user is logged in
console.log(getCurrentUser());

// Listen to all auth changes
onUserAuthStateChanged((user) => {
  console.log('Auth state changed:', user);
});

// Get full profile
const profile = await getUserProfile(uid);
console.log(profile);
```

## Common Mistakes to Avoid

❌ Forgetting to add `type="module"` to script tags
❌ Not calling `setupAuthUI()` on pages
❌ Trying to use auth functions without importing
❌ Not enabling Firebase services in console
❌ Using wrong element IDs

✅ Always import what you need
✅ Call `setupAuthUI()` on every page
✅ Check console for error messages
✅ Test in incognito mode for fresh session
✅ Use developer tools Network tab to debug

---

For more details, see: `AUTHENTICATION_GUIDE.md`
For examples, see: `AUTH_INTEGRATION_EXAMPLES.html`
