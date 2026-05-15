/**
 * Save logged-in user to Firestore (users collection).
 */

async function saveUserToFirestore(user) {
  if (!user || typeof firebase === "undefined" || !firebase.firestore) {
    return;
  }

  const db = firebase.firestore();
  const ref = db.collection("users").doc(user.uid);
  const snap = await ref.get();

  const provider =
    user.providerData && user.providerData[0]
      ? user.providerData[0].providerId
      : "";

  const profile = {
    uid: user.uid,
    displayName: user.displayName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    photoURL: user.photoURL || "",
    loginProvider: provider,
    isPremium: false,
    lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  if (!snap.exists) {
    profile.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  }

  await ref.set(profile, { merge: true });
}
