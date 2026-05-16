# Phase E — Finish premium + Razorpay (step by step)

You completed: **functions in Mumbai** (`asia-south1`). Finish the steps below in order.

**Site:** https://madhubhajan.github.io/

---

## Step 1 — Confirm Razorpay secrets (PowerShell)

```powershell
cd D:\music-pwa
firebase use madhubhajan-fc952
firebase functions:secrets:describe RAZORPAY_KEY_ID
firebase functions:secrets:describe RAZORPAY_KEY_SECRET
```

If either says **not found**, set them again:

```powershell
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase deploy --only functions
```

Use **test** keys from Razorpay (Dashboard → **Test mode** ON → API Keys).

---

## Step 2 — Firebase authorized domain

1. https://console.firebase.google.com/ → **madhubhajan-fc952**
2. **Authentication** → **Settings** → **Authorized domains**
3. Must include: **`madhubhajan.github.io`**
4. Save if you added it

---

## Step 3 — Confirm functions (you did this)

```powershell
firebase functions:list
```

Both must show **`asia-south1`**:

- `createRazorpayOrder`
- `verifyRazorpayPayment`

---

## Step 4 — Refresh the website

1. Open https://madhubhajan.github.io/
2. **Ctrl + F5** (hard refresh)
3. **Continue with Google** — log in

You should see:

- **Premium** card with **Upgrade to Premium — ₹99**
- **Bhajan 3 · Premium** with a lock (if not premium yet)

---

## Step 5 — Test payment (test mode)

1. Tap **Upgrade to Premium — ₹99**
2. **Expected:** Razorpay payment window opens
3. Pay using **one** of these (Razorpay **test mode**):

   **Option A — Indian test card (use this if you saw “International cards not supported”)**
   - Number: `5267 3181 8797 5449` (domestic Mastercard)
   - Or: `4012 0010 3714 1112` (domestic Visa)
   - Expiry: any future date (e.g. `12/30`)
   - CVV: `123`
   - OTP: `123456` if asked

   **Do not use** `4111 1111 1111 1111` on India-only accounts — Razorpay treats it as **international** and blocks it.

   **Option B — Test UPI (easiest)**
   - Tap **UPI** on the Razorpay screen
   - UPI ID: `success@razorpay`
   - Approve → payment succeeds in test mode
4. **Expected:** Alert **“Thank you! Premium is now active.”**
5. **Bhajan 3** plays (no lock)
6. **✓ Premium member** shows on screen

---

## Step 6 — Confirm in Firestore

1. Firebase → **Firestore** → **Data** → **users** → your document
2. Check:
   - `isPremium: true`
   - `razorpayPaymentId` (filled)
   - `premiumSince` (timestamp)

---

## Step 7 — Confirm in Razorpay

1. https://dashboard.razorpay.com/ → **Test mode** ON
2. **Transactions** → payment about **₹99**

---

## Phase E = DONE when all pass

| Check | Done? |
|-------|-------|
| Upgrade opens Razorpay | ☐ |
| Test payment succeeds | ☐ |
| Bhajan 3 unlocks | ☐ |
| Firestore `isPremium: true` | ☐ |

---

## If Upgrade fails — common fixes

| Error / symptom | Fix |
|-----------------|-----|
| `internal` or `failed-precondition` | Redeploy: `firebase deploy --only functions` |
| `Razorpay keys not set` | Step 1 — set secrets again |
| `unauthenticated` | Log in with Google first |
| `auth/unauthorized-domain` | Step 2 — add `madhubhajan.github.io` |
| Razorpay popup does not open | Use Chrome; check browser console (F12) |
| **International cards are not supported** | Use **5267 3181 8797 5449** or UPI `success@razorpay` (see Step 5) |
| Payment OK but still locked | Wait 5 sec; refresh page; check Firestore rules |

### See detailed error (browser)

1. On site, press **F12** → **Console**
2. Tap **Upgrade** again
3. Copy the red error text and share it for help

---

## After Phase E works

- Rename bhajans: `js/songs.js` + `ADD_SONGS.md`
- Go live: `PRODUCTION_CHECKLIST.md` (Razorpay live keys + KYC)
