# Phase C — Save users in Firebase database

When someone logs in with Google (or phone), their profile is saved in **Cloud Firestore**.

---

## Step 1 — Create Firestore (browser)

1. Open https://console.firebase.google.com/ → project **madhubhajan-fc952**
2. Left menu → **Build** → **Firestore Database**
3. Click **Create database**
4. Choose **Start in production mode** → **Next**
5. **Location:** pick closest to India (e.g. `asia-south1` Mumbai) → **Enable**
6. Wait until the database is ready (empty screen is OK)

---

## Step 2 — Security rules (who can read/write)

1. In Firestore, open tab **Rules**
2. Replace everything with this, then click **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This means: each user can only read/write **their own** document.

---

## Step 3 — Push latest code (PC)

```powershell
cd D:\music-pwa
git pull
git push
```

(If you already have the latest code on GitHub, skip.)

Wait 1–2 minutes, then open https://madhubhajan.github.io/

---

## Step 4 — Test

1. **Log out** on the site → **Continue with Google** again
2. In Firebase: **Firestore Database** → **Data** tab
3. You should see collection **`users`** → document with your user id
4. Fields like `displayName`, `email`, `lastLoginAt`, `isPremium: false`

---

## What each field means

| Field | Example |
|-------|---------|
| `displayName` | Mukund Pohakar |
| `email` | your@gmail.com |
| `loginProvider` | google.com |
| `isPremium` | false (for Razorpay later) |
| `createdAt` | first login time |
| `lastLoginAt` | updated every login |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| No `users` collection | Complete Steps 1–2, log out and log in again |
| Permission denied in browser console | Publish rules from Step 2 |
| Rules editor error | Copy rules exactly; use Publish |

Reply **“see users in Firestore”** when Step 4 works — next phase can be PWA install or premium tracks.
