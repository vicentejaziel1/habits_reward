import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0FVVItn5OkaKbd0wRLut8enbddkgBXnA",
  authDomain: "habits-reward.firebaseapp.com",
  projectId: "habits-reward",
  storageBucket: "habits-reward.appspot.com",
  messagingSenderId: "65390094179",
  appId: "1:65390094179:web:e5ed03f2ebdf3673d99556"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };