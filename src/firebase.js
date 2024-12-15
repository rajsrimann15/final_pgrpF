import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbxCV_o2V0HvxI5NaspcMPQF96HJsD8o0",
  authDomain: "pgrp-42bb0.firebaseapp.com",
  projectId: "pgrp-42bb0",
  storageBucket: "pgrp-42bb0.firebasestorage.app",
  messagingSenderId: "674635542259",
  appId: "1:674635542259:web:d93bf834b89b4364769186"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log('Auth object:', auth);

export {auth};

