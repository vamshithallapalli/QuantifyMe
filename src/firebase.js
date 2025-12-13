import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwdCU83KYlt2StqRl2qkEYSOt4ORiRQe0",
  authDomain: "quantifyme-927d5.firebaseapp.com",
  projectId: "quantifyme-927d5",
  storageBucket: "quantifyme-927d5.firebasestorage.app",
  messagingSenderId: "296102943084",
  appId: "1:296102943084:web:20ba6a9a9d256382c63b49",
  measurementId: "G-V3Z79V5FCH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc}