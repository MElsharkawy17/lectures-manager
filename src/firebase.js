import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTi27iPom5AUhLhn5hox5PGXjBctUlaZU",
  authDomain: "lecture-manager-69a1b.firebaseapp.com",
  projectId: "lecture-manager-69a1b",
  storageBucket: "lecture-manager-69a1b.firebasestorage.app",
  messagingSenderId: "666351151433",
  appId: "1:666351151433:web:1b846acf5788014ca4d298",
  measurementId: "G-XG3VRKE107"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);