// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6N9G7RU7Ab-fiZPN1uI7-ViYJ5DVh6mc",
  authDomain: "auth-app-b5960.firebaseapp.com",
  projectId: "auth-app-b5960",
  storageBucket: "auth-app-b5960.appspot.com", // fixed URL format too
  messagingSenderId: "106738017388",
  appId: "1:106738017388:web:5e890c364b630244a9e449"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const db = getFirestore(FIREBASE_APP); 
