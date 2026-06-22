import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxxH1QgNC-6xZLkKZG8R6JoBiIWytP1Ww",
  authDomain: "filtertube-492a6.firebaseapp.com",
  databaseURL: "https://filtertube-492a6-default-rtdb.firebaseio.com",
  projectId: "filtertube-492a6",
  storageBucket: "filtertube-492a6.firebasestorage.app",
  messagingSenderId: "1054748277981",
  appId: "1:1054748277981:web:0da8a908def74f8637af34",
  measurementId: "G-JFJKYJJ38K"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);

