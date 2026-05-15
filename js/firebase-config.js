/**
 * Paste your values from Firebase Console:
 * Project settings (gear) → Your apps → Web app → firebaseConfig
 */
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID",
};

function isFirebaseConfigReady() {
  return (
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("PASTE_YOUR")
  );
}

if (typeof firebase !== "undefined" && isFirebaseConfigReady()) {
  firebase.initializeApp(firebaseConfig);
}
