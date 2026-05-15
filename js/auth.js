/**
 * Firebase Phone OTP login (India +91)
 */

window.MusicAuth = {
  loggedIn: false,
  phoneNumber: "",

  canPlay() {
    return this.loggedIn;
  },

  setLoggedIn(value, phoneNumber) {
    this.loggedIn = value;
    this.phoneNumber = phoneNumber || "";
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
    const otpSection = document.getElementById("otp-section");

    if (this.loggedIn) {
      const display = this.phoneNumber || "your phone";
      status.textContent = "Logged in as " + display;
      status.classList.remove("hidden");
      loginBtn.classList.add("hidden");
      phoneInput.disabled = true;
      logoutBtn.classList.remove("hidden");
      if (otpSection) otpSection.classList.add("hidden");
    } else {
      status.classList.add("hidden");
      loginBtn.classList.remove("hidden");
      phoneInput.disabled = false;
      logoutBtn.classList.add("hidden");
    }
  },
};

let confirmationResult = null;
let otpStep = false;

function showError(message) {
  const status = document.getElementById("user-status");
  status.textContent = message;
  status.classList.remove("hidden");
  status.style.color = "#f87171";
}

function clearError() {
  const status = document.getElementById("user-status");
  status.style.color = "#4ade80";
}

function firebaseReady() {
  return (
    typeof firebase !== "undefined" &&
    typeof isFirebaseConfigReady === "function" &&
    isFirebaseConfigReady() &&
    firebase.apps.length > 0
  );
}

async function setupRecaptcha() {
  if (!firebaseReady()) return null;

  const container = document.getElementById("recaptcha-container");
  if (!container) return null;

  container.innerHTML = "";

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    { size: "normal" }
  );

  await window.recaptchaVerifier.render();
  return window.recaptchaVerifier;
}

async function sendOtp() {
  clearError();

  if (!firebaseReady()) {
    showError("Firebase is not set up yet. See FIREBASE_SETUP.md on GitHub.");
    return;
  }

  const phoneInput = document.getElementById("phone-input");
  const loginBtn = document.getElementById("login-btn");
  const otpSection = document.getElementById("otp-section");
  const phone = phoneInput.value.trim().replace(/\D/g, "");

  if (phone.length !== 10) {
    alert("Enter your 10-digit Indian mobile number (without +91).");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Sending…";

  try {
    if (!window.recaptchaVerifier) {
      await setupRecaptcha();
    }

    const fullNumber = "+91" + phone;
    confirmationResult = await firebase
      .auth()
      .signInWithPhoneNumber(fullNumber, window.recaptchaVerifier);

    otpStep = true;
    otpSection.classList.remove("hidden");
    loginBtn.textContent = "Verify OTP";
    loginBtn.disabled = false;
    document.getElementById("otp-input").focus();
    showError("OTP sent! Enter the 6-digit code from SMS.");
  } catch (err) {
    console.error(err);
    showError(err.message || "Could not send OTP. Try again.");
    loginBtn.textContent = "Send OTP";
    loginBtn.disabled = false;

    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        /* ignore */
      }
      window.recaptchaVerifier = null;
      await setupRecaptcha();
    }
  }
}

async function verifyOtp() {
  clearError();

  const code = document.getElementById("otp-input").value.trim().replace(/\D/g, "");
  if (code.length !== 6) {
    alert("Enter the 6-digit code from your SMS.");
    return;
  }

  if (!confirmationResult) {
    showError("Please send OTP first.");
    return;
  }

  const loginBtn = document.getElementById("login-btn");
  loginBtn.disabled = true;
  loginBtn.textContent = "Verifying…";

  try {
    await confirmationResult.confirm(code);
    clearError();
  } catch (err) {
    console.error(err);
    showError("Wrong code or expired. Try again or resend OTP.");
    loginBtn.disabled = false;
    loginBtn.textContent = "Verify OTP";
  }
}

function resetOtpFlow() {
  confirmationResult = null;
  otpStep = false;
  const otpSection = document.getElementById("otp-section");
  const loginBtn = document.getElementById("login-btn");
  const otpInput = document.getElementById("otp-input");

  if (otpSection) otpSection.classList.add("hidden");
  if (otpInput) otpInput.value = "";
  if (loginBtn) {
    loginBtn.textContent = "Send OTP";
    loginBtn.disabled = false;
    loginBtn.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const phoneInput = document.getElementById("phone-input");

  loginBtn.addEventListener("click", () => {
    if (otpStep) {
      verifyOtp();
    } else {
      sendOtp();
    }
  });

  logoutBtn.addEventListener("click", async () => {
    resetOtpFlow();
    phoneInput.value = "";

    if (firebaseReady()) {
      try {
        await firebase.auth().signOut();
      } catch (err) {
        console.error(err);
      }
    }

    window.MusicAuth.setLoggedIn(false);
  });

  if (firebaseReady()) {
    setupRecaptcha().catch((err) => {
      console.error("reCAPTCHA setup failed:", err);
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        window.MusicAuth.setLoggedIn(true, user.phoneNumber || "");
        resetOtpFlow();
      } else {
        window.MusicAuth.setLoggedIn(false);
      }
    });
  } else {
    showError(
      "Add your Firebase keys in js/firebase-config.js (see FIREBASE_SETUP.md)."
    );
  }

  window.MusicAuth.updateUI();
});
