import { auth, provider } from "./firebase.js";

import {
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const msg = document.getElementById("msg");

// SAFETY CHECK
if (!loginBtn) {
  console.error("loginBtn not found in HTML");
}

// LOGIN
loginBtn?.addEventListener("click", async () => {
  try {
    msg.innerText = "Signing in...";

    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    if (!user) throw new Error("No user returned");

    msg.innerText = "Login successful";

    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    msg.innerText = err.message;
  }
});

// AUTO REDIRECT
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "dashboard.html";
  }
});