# Phase D — Install Madhu Bhajan as an app (PWA)

After code is deployed, users can add the site to their phone home screen like an app.

---

## Already done in code

- `manifest.json` — app name, colors, icons
- `sw.js` — caches the app shell (faster repeat visits)
- **Install app** button (shows when the browser allows it)

---

## Test on Android (Chrome)

1. Open https://madhubhajan.github.io/
2. Wait for the page to load fully
3. Either:
   - Tap **Install app** (if the button appears), or
   - Menu **⋮** → **Install app** / **Add to Home screen**
4. Open the icon on your home screen — it should open without the browser bar

---

## Test on iPhone (Safari)

Apple does not show our Install button. Use Safari only:

1. Open https://madhubhajan.github.io/ in **Safari**
2. Tap **Share** (square with arrow)
3. **Add to Home Screen**
4. Tap **Add**

---

## Push updates (after code change)

```powershell
cd D:\music-pwa
git add .
git commit -m "Your message"
git push
```

If the app looks old on the phone, close it fully and open again. Service worker cache updates on next visit.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| No Install button | Normal on iPhone; use Share → Add to Home Screen |
| Install button never on Android | Use Chrome; visit site twice; check HTTPS |
| Old version after update | Close app from recent apps; reopen site in browser once |

---

Next phase (E): premium bhajans + Razorpay when you are ready.
