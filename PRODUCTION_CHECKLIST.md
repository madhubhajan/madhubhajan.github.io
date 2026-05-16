# Go live — Madhu Bhajan production checklist

Site: https://madhubhajan.github.io/

---

## Already done

- [x] GitHub Pages (public repo `madhubhajan.github.io`)
- [x] Google login (primary)
- [x] Phone OTP (backup)
- [x] Firestore users — **Mumbai**
- [x] Cloud Functions payments — **Mumbai**
- [x] PWA install
- [x] Premium + Razorpay (test mode)

---

## Before real customers pay

### 1. Test premium end-to-end (test mode)

- [ ] Log in with Google
- [ ] Upgrade with test card `4111 1111 1111 1111`
- [ ] Song 3 (premium) plays
- [ ] Firestore `isPremium: true`

### 2. Razorpay live mode

- [ ] Complete Razorpay **KYC**
- [ ] Dashboard → switch to **Live mode**
- [ ] New **live** API keys
- [ ] Update secrets:

```powershell
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase deploy --only functions
```

### 3. Real bhajan names

- [ ] Edit `js/songs.js` titles
- [ ] Only use audio you have rights to share

### 4. Firebase authorized domains

- [ ] `madhubhajan.github.io` in Authentication → Settings
- [ ] Add custom domain here too if you buy one later

### 5. Billing safety (Google Cloud)

- [ ] Budget alert (e.g. ₹500/month) in Cloud Billing
- [ ] Review Blaze usage after first month

### 6. Share the app

- [ ] Share link: https://madhubhajan.github.io/
- [ ] Install on home screen (PWA)
- [ ] Optional: custom domain in GitHub Pages settings

---

## Optional improvements (later)

| Item | Why |
|------|-----|
| Custom domain (`madhubhajan.in`) | Easier to remember |
| Firebase Storage for MP3s | Scale beyond GitHub bandwidth |
| Admin page to upload songs | No code edits for each track |
| Email support link in footer | User help |
| Privacy policy page | Good for Play Store / payments |

---

## Support email idea

Add your contact in the footer when ready (e.g. `omdattaadmin@gmail.com`).

---

## Quick health check

| Check | URL / tool |
|-------|------------|
| Site loads | https://madhubhajan.github.io/ |
| Functions | `firebase functions:list` → `asia-south1` |
| Firestore | Console → Mumbai |
| Payments | Razorpay → Transactions |

Reply in chat if you want help with **custom domain**, **more songs**, or **live Razorpay** step-by-step.
