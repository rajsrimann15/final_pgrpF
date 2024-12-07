import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAndRjCwzxx_bft0kjyGuv_J6yxKm0u-II",
  authDomain: "public-grievance-portal-41225.firebaseapp.com",
  projectId: "public-grievance-portal-41225",
  storageBucket: "public-grievance-portal-41225.appspot.com",
  messagingSenderId: "1016759484422",
  appId: "1:1016759484422:web:72570bd61b0c3be9aec387"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log('Auth object:', auth);

export {auth};

