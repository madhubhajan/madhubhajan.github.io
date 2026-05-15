# Enable Google Sign-In (one-time, in browser)

Do this **before** testing **Continue with Google** on your site.

---

## Step 1 — Turn on Google in Firebase

1. Open https://console.firebase.google.com/
2. Select project **madhubhajan-fc952**
3. **Build** → **Authentication** → **Sign-in method**
4. Click **Google** → turn **Enable** ON
5. Choose a **Project support email** (your email)
6. Click **Save**

Firebase creates the Google OAuth client for you automatically.

---

## Step 2 — Check authorized domains

1. **Authentication** → **Settings** → **Authorized domains**
2. Confirm **`omdattaadmin.github.io`** is listed
3. **`localhost`** should also be there (for testing on PC)

---

## Step 3 — Test live site

1. Open https://omdattaadmin.github.io/madhubhajan/
2. Hard refresh: **Ctrl + F5**
3. Click **Continue with Google**
4. Pick your Google account
5. Play a bhajan

You should stay logged in when you return later (no daily SMS).

---

## Phone backup (optional)

1. Click **Use mobile number instead**
2. Use test number `9999999999` and OTP `123456` (if you set that in Firebase)

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `auth/operation-not-allowed` | Enable Google in Step 1 |
| `auth/unauthorized-domain` | Add `omdattaadmin.github.io` to authorized domains |
| Popup blocked | Site will try redirect — allow popups or try again |
| Google works but phone fails | Enable **Phone** sign-in method separately |

Reply with the exact error text if stuck.
