// src/Components/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBibg9y4v7oh1ke2qlN_tA36Bq5q_v8YRI",
  authDomain: "task-manager-6b5e4.firebaseapp.com",
  projectId: "task-manager-6b5e4",
  storageBucket: "task-manager-6b5e4.firebasestorage.app",
  messagingSenderId: "1049593996829",
  appId: "1:1049593996829:web:8236104c99b96f817608f4",
  measurementId: "G-JQ630ZY1L0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

export { auth };
