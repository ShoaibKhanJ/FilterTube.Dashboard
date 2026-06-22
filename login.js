import { auth, provider, db } from "./firebase.js";

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
  ref,
  set,
  get
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const btn = document.getElementById("googleLogin");

/* ===============================
   REDIRECT RESULT HANDLER
================================ */
getRedirectResult(auth)
  .then(async (result) => {
    if (result?.user) {
      await handleUser(result.user);
    }
  })
  .catch((err) => console.error("Redirect error:", err));

/* ===============================
   LOGIN BUTTON
================================ */
btn?.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    await handleUser(result.user);

  } catch (err) {
    console.warn("Popup blocked → redirect login used", err.code);
    signInWithRedirect(auth, provider);
  }
});

/* ===============================
   USER HANDLER
================================ */
async function handleUser(user) {
  try {
    const uid = user.uid;

    const userRef = ref(db, "users/" + uid);

    const snap = await get(userRef);

    if (!snap.exists()) {
      await set(userRef, {
        profile: {
          name: user.displayName || "User",
          email: user.email || "",
          photo: user.photoURL || ""
        },
        settings: {
          filterEnabled: true,
          hideShorts: false,
          focusMode: false
        },
        analytics: {
          blockedVideos: 0,
          timeSaved: 0
        }
      });
    }

    // ===============================
    // EXTENSION SYNC (IMPORTANT)
    // ===============================

    localStorage.setItem("uid", uid);

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ uid });
    }

    console.log("Login successful:", uid);

    window.location.href = "dashboard.html";

  } catch (err) {
    console.error("handleUser error:", err);
    alert(err.message);
  }
}