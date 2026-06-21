import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const uid = user.uid;

  // ================= USER PROFILE =================
  const userSnap = await get(ref(db, "users/" + uid + "/profile"));
  if (userSnap.exists()) {
    const userData = userSnap.val();

    document.getElementById("userName").textContent =
      userData.name || "User";

    document.getElementById("userPhoto").src =
      userData.photo || "https://i.pravatar.cc/100";
  }

  // ================= PLAN =================
  const planSnap = await get(ref(db, "users/" + uid + "/plan"));
  if (planSnap.exists()) {
    document.getElementById("userPlan").textContent =
      planSnap.val() || "Free Plan";
  }

  // ================= ANALYTICS =================
  const snap = await get(ref(db, "users/" + uid + "/analytics"));

  if (!snap.exists()) return;

  const data = snap.val();

  // update cards safely (DO NOT overwrite grid)
  const cards = document.querySelectorAll(".grid .card");

  if (cards[0]) cards[0].querySelector("h2").textContent = data.watchTime || "--";
  if (cards[1]) cards[1].querySelector("h2").textContent = data.timeSaved || "--";
  if (cards[2]) cards[2].querySelector("h2").textContent = data.blockedVideos || "--";
  if (cards[3]) cards[3].querySelector("h2").textContent = data.focus || "--";

});