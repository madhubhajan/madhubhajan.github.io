# Phase B — Firebase phone login (step by step)

Do **Part 1** in the browser, then **Part 2** on your PC, then **Part 3** to go live.

Your live site: https://omdattaadmin.github.io/madhubhajan/

---

## Part 1 — Create Firebase project (browser)

### 1.1 Create project

1. Open https://console.firebase.google.com/
2. Click **Create a project** (or **Add project**).
3. **Project name:** `madhubhajan` (or any name you like).
4. Click **Continue** → turn off Google Analytics if you want (optional) → **Create project** → **Continue**.

### 1.2 Add a web app

1. On the project home page, click the **Web** icon (`</>`).
2. **App nickname:** `madhubhajan-web`
3. **Do not** check Firebase Hosting for now.
4. Click **Register app**.
5. You will see a code block like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "something.firebaseapp.com",
  projectId: "something",
  ...
};
```

6. **Keep this tab open** — you need these values in Part 2.

### 1.3 Turn on Phone sign-in

1. Left menu → **Build** → **Authentication**.
2. Click **Get started** (if shown).
3. Tab **Sign-in method** → click **Phone** → turn **Enable** ON → **Save**.

### 1.4 Allow your GitHub website

1. Still in **Authentication** → tab **Settings**.
2. Scroll to **Authorized domains**.
3. Confirm these exist (add if missing):
   - `localhost`
   - `omdattaadmin.github.io`
4. If `omdattaadmin.github.io` is missing, click **Add domain** and type:  
   `omdattaadmin.github.io`  
   (no `https://`, no `/madhubhajan`).

### 1.5 Test phone (free — no real SMS yet)

1. **Authentication** → **Sign-in method** → **Phone**.
2. Open **Phone numbers for testing** (or scroll to test numbers).
3. Click **Add phone number**:
   - Phone: `+91 9999999999`
   - Test code: `123456`
4. **Save**.

You can log in on the website with number `9999999999` and OTP `123456` before paying for real SMS.

---

## Part 2 — Paste keys into your project (PC)

1. Open this file in Notepad:

   `D:\music-pwa\js\firebase-config.js`

2. Replace each `PASTE_...` value with the matching value from Firebase (Part 1.2).

   Example — yours will be different:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy........",
  authDomain: "madhubhajan-xxxxx.firebaseapp.com",
  projectId: "madhubhajan-xxxxx",
  storageBucket: "madhubhajan-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef",
};
```

3. Save the file.

### Test on your computer

1. Double-click `D:\music-pwa\index.html` (or use a simple local server).
2. Complete the **reCAPTCHA** (“I’m not a robot”).
3. Enter test number `9999999999` → **Send OTP**.
4. Enter `123456` → **Verify OTP**.
5. Play a song.

---

## Part 3 — Push to GitHub

In PowerShell:

```powershell
cd D:\music-pwa
git add js/firebase-config.js js/auth.js js/firebase-config.js index.html css/style.css FIREBASE_SETUP.md
git commit -m "Add Firebase phone OTP login"
git push
```

Wait 1–2 minutes, then test: https://omdattaadmin.github.io/madhubhajan/

---

## Real SMS to any phone (later)

Firebase may ask you to upgrade to the **Blaze (pay-as-you-go)** plan for real SMS outside test numbers. You only pay for what you use.

Until then, use the **test phone** from Part 1.5.

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| “Firebase is not set up yet” | Finish Part 2 — no `PASTE_YOUR` left in `firebase-config.js` |
| reCAPTCHA error | Add `omdattaadmin.github.io` in Authorized domains |
| `auth/invalid-app-credential` | Wrong `apiKey` or domain not authorized |
| OTP never arrives (real number) | Use test number first; enable Blaze for production SMS |

Reply with a screenshot or the exact error text if stuck.
