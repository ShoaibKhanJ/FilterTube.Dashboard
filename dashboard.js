import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const uid = user.uid;

  const userRef = ref(db, "users/" + uid);

  // ================= REAL-TIME LISTENER =================
  onValue(userRef, (snapshot) => {
    if (!snapshot.exists()) return;

    const data = snapshot.val();

    // PROFILE
    if (data.profile) {
      document.getElementById("userName").textContent =
        data.profile.name || "User";

      document.getElementById("userPhoto").src =
        data.profile.photoURL || "https://i.pravatar.cc/100";
    }

    // PLAN
    document.getElementById("userPlan").textContent =
      data.plan || "Free Plan";

    // ANALYTICS
    if (data.analytics) {
      const cards = document.querySelectorAll(".grid .card");

      const a = data.analytics;

      if (cards[0]) cards[0].querySelector("h2").textContent = a.watchTime || "--";
      if (cards[1]) cards[1].querySelector("h2").textContent = a.timeSaved || "--";
      if (cards[2]) cards[2].querySelector("h2").textContent = a.blockedVideos || "--";
      if (cards[3]) cards[3].querySelector("h2").textContent = a.focus || "--";
    }

  });
});