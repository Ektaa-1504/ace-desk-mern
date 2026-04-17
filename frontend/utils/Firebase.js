/**
 * ============================================
 * FIREBASE.JS - Firebase Auth Setup
 * ============================================
 * Initializes Firebase and exports auth + Google provider for "Sign in with Google".
 * 
 * CONNECTION: SignUp.jsx and Login.jsx import { auth, provider } from here
 * and use signInWithPopup(auth, provider) for Google login.
 */

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,  // From .env - Vite uses import.meta.env
  authDomain: "loginvirtualcourses-d40ab.firebaseapp.com",
  projectId: "loginvirtualcourses-d40ab",
  storageBucket: "loginvirtualcourses-d40ab.firebasestorage.app",
  messagingSenderId: "745569775178",
  appId: "1:745569775178:web:1f476fb3848a99db0fc0b3",
};

// Initialize Firebase app - required before using any Firebase service
const app = initializeApp(firebaseConfig);

// getAuth: Firebase Authentication service - handles user sessions, tokens
const auth = getAuth(app);

// GoogleAuthProvider: Tells Firebase we want Google OAuth - used with signInWithPopup
const provider = new GoogleAuthProvider();

export { auth, provider };
