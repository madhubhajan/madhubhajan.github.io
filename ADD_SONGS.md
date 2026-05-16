# How to add or rename bhajans

## Rename titles (easy — no new files)

1. Open `D:\music-pwa\js\songs.js`
2. Change the `title` for each song (e.g. `"Shree Krishna Bhajan"`)
3. Save, then push:

```powershell
cd D:\music-pwa
git add js/songs.js
git commit -m "Update bhajan titles"
git push
```

Wait 1–2 minutes → refresh https://madhubhajan.github.io/

---

## Add a new bhajan (4 steps)

### 1. Add MP3 file

Copy your file into `D:\music-pwa\songs\`, e.g. `song4.mp3`

Keep files under ~5 MB each when possible.

### 2. Register in songs.js

Add a new block at the end of the list in `js/songs.js`:

```javascript
  {
    id: "song4",
    title: "Your Bhajan Name",
    file: "songs/song4.mp3",
    premium: true,
  },
```

- `premium: false` = free for logged-in users  
- `premium: true` = only after ₹99 upgrade  

### 3. Push to GitHub

```powershell
cd D:\music-pwa
git add songs/song4.mp3 js/songs.js
git commit -m "Add song4 bhajan"
git push
```

### 4. Test on phone

Open the site → log in → play the new track.

---

## Many songs later (100+)

GitHub Pages is fine for a small library. For large traffic or huge files, plan **Firebase Storage** or a CDN (Phase G — ask when ready).
