import { auth, provider, db } from "./firebase.js";

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { ref, set, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const btn = document.getElementById("googleLogin");

// ===============================
// HANDLE REDIRECT RESULT (IMPORTANT)
// ===============================
getRedirectResult(auth)
  .then(async (result) => {
    if (result?.user) {
      await handleUser(result.user);
    }
  })
  .catch((err) => {
    console.error("Redirect error:", err);
  });

// ===============================
// BUTTON LOGIN
// ===============================
btn?.addEventListener("click", async () => {
  try {
    console.log("Login started...");

    const result = await signInWithPopup(auth, provider);
    await handleUser(result.user);

  } catch (err) {
    console.warn("Popup failed, switching to redirect...", err.code);

    // 🔥 fallback (fix popup blocked issue)
    signInWithRedirect(auth, provider);
  }
});

// ===============================
// USER HANDLER (CLEAN + SAFE)
// ===============================
async function handleUser(user) {
  try {
    const uid = user.uid;

    const userRef = ref(db, "users/" + uid + "/profile");

    // check if user already exists
    const snap = await get(userRef);

    if (!snap.exists()) {
      await set(ref(db, "users/" + uid + "/profile"), {
        name: user.displayName || "User",
        email: user.email || "",
        photo: user.photoURL || ""
      });

      await set(ref(db, "users/" + uid + "/settings"), {
        filterEnabled: true,
        hideShorts: false,
        focusMode: false
      });

      await set(ref(db, "users/" + uid + "/analytics"), {
        blockedVideos: 0,
        timeSaved: 0
      });
    }

    localStorage.setItem("uid", uid);

    console.log("Login success:", uid);

    window.location.href = "dashboard.html";

  } catch (err) {
    console.error("User setup error:", err);
    alert(err.message);
  }
}