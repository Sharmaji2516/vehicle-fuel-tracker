// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// REPLACE these values with your own from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyD2bQd4oUkDAal0QO1hovr0tTIaL_l5fns",
    authDomain: "fuel-tracker-db5f6.firebaseapp.com",
    projectId: "fuel-tracker-db5f6",
    storageBucket: "fuel-tracker-db5f6.firebasestorage.app",
    messagingSenderId: "1048910366910",
    appId: "1:1048910366910:web:4f657ac7bd34ffb33a36ef",
    measurementId: "G-5M03JBTV5P"
};

// Initialize Firebase
// Check if config is replaced
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let app;
let db;
let auth;
let googleProvider;

if (isConfigured) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
} else {
    console.warn("Firebase is not configured. Cloud sync will be disabled.");
}

export { db, auth, googleProvider, isConfigured };
