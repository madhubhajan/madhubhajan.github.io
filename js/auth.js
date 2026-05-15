/**
 * Firebase auth: Google (primary) + Phone OTP (optional backup)
 */

window.MusicAuth = {
  loggedIn: false,
  displayLabel: "",

  canPlay() {
    return this.loggedIn;
  },

  setLoggedIn(value, displayLabel) {
    this.loggedIn = value;
    this.displayLabel = displayLabel || "";
    this.updateUI();
    if (typeof window.onAuthChanged === "function") {
      window.onAuthChanged(value);
    }
  },

  updateUI() {
    const status = document.getElementById("user-status");
    const logoutBtn = document.getElementById("logout-btn");
    const loggedOutView = document.getElementById("logged-out-view");

    if (this.loggedIn) {
      status.textContent = "Logged in as " + (this.displayLabel || "user");
      status.classList.remove("hidden");
      status.style.color = "#4ade80";
      logoutBtn.classList.remove("hidden");
      if (loggedOutView) loggedOutView.classList.add("hidden");
    } else {
      status.classList.add("hidden");
      logoutBtn.classList.add("hidden");
      if (loggedOutView) loggedOutView.classList.remove("hidden");
    }
  },
};

let confirmationResult = null;
let otpStep = false;
let recaptchaReady = false;

function getUserLabel(user) {
  if (!user) return "";
  if (user.displayName) return user.displayName;
  if (user.email) return user.email;
  if (user.phoneNumber) return user.phoneNumber;
  return "user";
}

function showMessage(message, isError) {
  const status = document.getElementById("user-status");
  status.textContent = message;
  status.classList.remove("hidden");
  status.style.color = isError ? "#f87171" : "#a1a1aa";
}

function clearMessage() {
  const status = document.getElementById("user-status");
  if (!window.MusicAuth.loggedIn) {
    status.classList.add("hidden");
  }
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

async function signInWithGoogle() {
  clearMessage();

  if (!firebaseReady()) {
    showMessage("Firebase is not set up. See FIREBASE_SETUP.md.", true);
    return;
  }

  const btn = document.getElementById("google-login-btn");
  btn.disabled = true;
  btn.textContent = "Opening Google…";

  const provider = new firebase.auth.GoogleAuthProvider();

  try {
    await firebase.auth().signInWithPopup(provider);
    clearMessage();
  } catch (err) {
    console.error(err);

    if (
      err.code === "auth/popup-blocked" ||
      err.code === "auth/popup-closed-by-user" ||
      err.code === "auth/cancelled-popup-request"
    ) {
      try {
        await firebase.auth().signInWithRedirect(provider);
        return;
      } catch (redirectErr) {
        console.error(redirectErr);
        showMessage(redirectErr.message || "Google sign-in failed.", true);
      }
    } else {
      showMessage(err.message || "Google sign-in failed.", true);
    }
  } finally {
    btn.disabled = false;
    btn.textContent = "Continue with Google";
  }
}

async function setupRecaptcha() {
  if (!firebaseReady() || recaptchaReady) return;

  const container = document.getElementById("recaptcha-container");
  if (!container) return;

  container.innerHTML = "";

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    { size: "normal" }
  );

  await window.recaptchaVerifier.render();
  recaptchaReady = true;
}

async function sendOtp() {
  clearMessage();

  if (!firebaseReady()) {
    showMessage("Firebase is not set up. See FIREBASE_SETUP.md.", true);
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
    if (!recaptchaReady) {
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
    showMessage("OTP sent. Enter the 6-digit code from SMS.", false);
  } catch (err) {
    console.error(err);
    showMessage(err.message || "Could not send OTP. Try again.", true);
    loginBtn.textContent = "Send OTP";
    loginBtn.disabled = false;

    recaptchaReady = false;
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        /* ignore */
      }
      window.recaptchaVerifier = null;
    }
  }
}

async function verifyOtp() {
  clearMessage();

  const code = document.getElementById("otp-input").value.trim().replace(/\D/g, "");
  if (code.length !== 6) {
    alert("Enter the 6-digit code from your SMS.");
    return;
  }

  if (!confirmationResult) {
    showMessage("Please send OTP first.", true);
    return;
  }

  const loginBtn = document.getElementById("login-btn");
  loginBtn.disabled = true;
  loginBtn.textContent = "Verifying…";

  try {
    await confirmationResult.confirm(code);
    clearMessage();
  } catch (err) {
    console.error(err);
    showMessage("Wrong code or expired. Try again.", true);
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
  }
}

function hidePhoneBackup() {
  const section = document.getElementById("phone-backup-section");
  const toggle = document.getElementById("toggle-phone-login");
  if (section) section.classList.add("hidden");
  if (toggle) toggle.textContent = "Use mobile number instead";
}

document.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("google-login-btn");
  const togglePhone = document.getElementById("toggle-phone-login");
  const phoneBackup = document.getElementById("phone-backup-section");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const phoneInput = document.getElementById("phone-input");

  googleBtn.addEventListener("click", signInWithGoogle);

  togglePhone.addEventListener("click", async () => {
    const opening = phoneBackup.classList.contains("hidden");
    phoneBackup.classList.toggle("hidden");
    togglePhone.textContent = opening
      ? "Hide mobile login"
      : "Use mobile number instead";

    if (opening && firebaseReady()) {
      try {
        await setupRecaptcha();
      } catch (err) {
        console.error("reCAPTCHA setup failed:", err);
        showMessage("Could not load verification. Refresh and try again.", true);
      }
    }
  });

  loginBtn.addEventListener("click", () => {
    if (otpStep) {
      verifyOtp();
    } else {
      sendOtp();
    }
  });

  logoutBtn.addEventListener("click", async () => {
    resetOtpFlow();
    hidePhoneBackup();
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
    firebase
      .auth()
      .getRedirectResult()
      .catch((err) => {
        if (err.code && err.code !== "auth/null-user") {
          console.error(err);
          showMessage(err.message || "Google sign-in failed.", true);
        }
      });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        window.MusicAuth.setLoggedIn(true, getUserLabel(user));
        resetOtpFlow();
        hidePhoneBackup();
      } else {
        window.MusicAuth.setLoggedIn(false);
      }
    });
  } else {
    showMessage(
      "Add Firebase keys in js/firebase-config.js (see FIREBASE_SETUP.md).",
      true
    );
  }

  window.MusicAuth.updateUI();
});
