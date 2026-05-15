/**
 * Login placeholder for MVP.
 * Phase E will connect Firebase Phone OTP here.
 * For now: "demo login" so you can test the player flow.
 */

window.MusicAuth = {
  loggedIn: false,

  canPlay() {
    return this.loggedIn;
  },

  setLoggedIn(value) {
    this.loggedIn = value;
    this.updateUI();
    if (typeof window.onAuthChanged === "function") {
      window.onAuthChanged(value);
    }
  },

  updateUI() {
    const status = document.getElementById("user-status");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const phoneInput = document.getElementById("phone-input");

    if (this.loggedIn) {
      status.textContent = "Logged in (demo). Firebase login comes next.";
      status.classList.remove("hidden");
      loginBtn.disabled = true;
      phoneInput.disabled = true;
      logoutBtn.classList.remove("hidden");
    } else {
      status.classList.add("hidden");
      loginBtn.disabled = false;
      phoneInput.disabled = false;
      logoutBtn.classList.add("hidden");
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const phoneInput = document.getElementById("phone-input");

  loginBtn.addEventListener("click", () => {
    const phone = phoneInput.value.trim();
    if (phone.length < 10) {
      alert("Enter your 10-digit mobile number (India: without +91).");
      return;
    }
    window.MusicAuth.setLoggedIn(true);
  });

  logoutBtn.addEventListener("click", () => {
    window.MusicAuth.setLoggedIn(false);
    phoneInput.value = "";
  });

  window.MusicAuth.updateUI();
});
