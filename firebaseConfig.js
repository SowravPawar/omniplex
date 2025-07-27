import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Firebase Config
export const firebaseConfig = {
  apiKey: "AIzaSyCZ3FYwNlmx0dLPQfpLA6hEWYC-Ag3T1xc",
  authDomain: "omniplex-fb381.firebaseapp.com",
  projectId: "omniplex-fb381",
  storageBucket: "omniplex-fb381.firebasestorage.app",
  messagingSenderId: "837629502954",
  appId: "1:837629502954:web:a54a59150d59ba97a83e93",
  measurementId: "G-1JJQLYZ44X"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

export const initializeFirebase = () => {
  return app;
};
