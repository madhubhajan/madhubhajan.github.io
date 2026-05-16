# Phase E — Premium + Razorpay

**Website:** https://madhubhajan.github.io/  
**Firebase project:** `madhubhajan-fc952`

- **Song 1 & 2** — free (after login)  
- **Song 3** — premium (🔒 until paid)  
- **Price:** ₹99 (set in `functions/index.js`)

Payments **must** be verified on the server (Cloud Functions). The website alone cannot safely turn on premium.

---

## Part 1 — Razorpay account & test keys

1. Sign up: https://dashboard.razorpay.com/
2. Complete basic business profile (test mode works without full KYC)
3. **Settings** → **API Keys** → **Generate test keys**
4. Copy:
   - **Key ID** (starts with `rzp_test_`)
   - **Key secret** (show once — save safely)

---

## Part 2 — Upgrade Firebase to Blaze (required for Functions)

Cloud Functions need the **Blaze** plan (pay-as-you-go). You only pay if usage exceeds free limits.

1. Firebase Console → **Upgrade** (Spark → Blaze)
2. Add billing account (Google Cloud)

---

## Part 3 — Install Firebase CLI (PC, one time)

1. Install Node.js: https://nodejs.org/ (LTS)
2. Open PowerShell:

```powershell
npm install -g firebase-tools
firebase login
```

Sign in with the Google account that owns the Firebase project.

---

## Part 4 — Set Razorpay secrets (new method)

The old `functions:config:set` command is deprecated. Use **secrets** instead.

In PowerShell:

```powershell
cd D:\music-pwa
firebase use madhubhajan-fc952
```

Set Key ID (paste your `rzp_test_...` when asked):

```powershell
firebase functions:secrets:set RAZORPAY_KEY_ID
```

Set Key secret (paste your secret when asked — it will not show on screen):

```powershell
firebase functions:secrets:set RAZORPAY_KEY_SECRET
```

**Security:** Never paste keys in chat or commit them to GitHub. If a key was exposed, regenerate it in Razorpay Dashboard → API Keys.

---

## Part 5 — Deploy Cloud Functions

```powershell
cd D:\music-pwa\functions
npm install
cd D:\music-pwa
firebase deploy --only functions
```

Wait until you see URLs for `createRazorpayOrder` and `verifyRazorpayPayment`.

Functions deploy to **asia-south1 (Mumbai)**. Check with:

```powershell
firebase functions:list
```

Location should show `asia-south1`. Delete old `us-central1` copies in Firebase Console → **Functions** if they still appear (optional).

---

## Part 6 — Push website code

```powershell
cd D:\music-pwa
git add .
git commit -m "Phase E: premium songs and Razorpay upgrade"
git push
```

Wait 1–2 minutes. Open https://madhubhajan.github.io/ → **Ctrl + F5**

---

## Part 7 — Test payment (test mode)

1. Log in with Google
2. Song 3 should show **🔒 (Premium)**
3. Tap **Upgrade to Premium — ₹99**
4. Razorpay test payment (pick one):
   - **UPI:** `success@razorpay`
   - **Indian test card:** `5267 3181 8797 5449` (expiry any future, CVV `123`)
   - Avoid `4111 1111 1111 1111` if you see “International cards not supported”
5. After success → Song 3 plays → Firestore `isPremium: true`

---

## Go live (real money)

1. Razorpay → complete **KYC** → switch to **Live mode** → live API keys  
2. Run `firebase functions:config:set` again with **live** keys  
3. `firebase deploy --only functions`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Razorpay keys not configured` | Part 4 again, then redeploy functions |
| `internal` on upgrade | Functions not deployed (Part 5) |
| Paid but still locked | Check Firestore `users` → your doc → `isPremium` |
| Premium lost after login | Fixed in code — `isPremium` not reset on login |

---

## Change price

Edit `PREMIUM_AMOUNT_PAISE` in `functions/index.js` (100 paise = ₹1), then:

```powershell
firebase deploy --only functions
```

Reply when Part 5 deploy succeeds or paste any error message.
