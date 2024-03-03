// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sabaragamu-athsalu-management.firebaseapp.com",
  projectId: "sabaragamu-athsalu-management",
  storageBucket: "sabaragamu-athsalu-management.appspot.com",
  messagingSenderId: "61892469355",
  appId: "1:61892469355:web:49053f4ba9acc956aac72e",
  measurementId: "G-MYE2L52960",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
