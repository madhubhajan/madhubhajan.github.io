/**
 * Firebase config — madhubhajan-fc952
 * From Firebase Console → Project settings → Your apps → Web app
 */
const firebaseConfig = {
  apiKey: "AIzaSyBIPjUcEHBDxpY59t4aQKyK20mGZVm6RtU",
  authDomain: "madhubhajan-fc952.firebaseapp.com",
  projectId: "madhubhajan-fc952",
  storageBucket: "madhubhajan-fc952.firebasestorage.app",
  messagingSenderId: "821592342294",
  appId: "1:821592342294:web:ea3621b449cf668aa15a37",
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
