# Bhajan folders (free + premium)

## Folder layout on your PC

```
D:\music-pwa\songs\
  free\          ← free tier (login required)
    song1.mp3
    song2.mp3
  premium\       ← premium tier (after payment)
    song3.mp3
```

**Yes — upload / move MP3 files into these folders**, then register them in `js/songs.js`.

---

## Step 1 — Move your MP3 files (File Explorer)

1. Open `D:\music-pwa\songs\`
2. Create folders `free` and `premium` if they are missing
3. Move files:
   - `song1.mp3` → `songs\free\song1.mp3`
   - `song2.mp3` → `songs\free\song2.mp3`
   - `song3.mp3` → `songs\premium\song3.mp3`

---

## Step 2 — Edit the catalog

Open `D:\music-pwa\js\songs.js` and set titles / files to match.

---

## Step 3 — Push to GitHub

```powershell
cd D:\music-pwa
git add songs/ js/songs.js js/app.js index.html css/style.css
git commit -m "Organize bhajans into free and premium folders"
git push
```

Wait 1–2 minutes → https://madhubhajan.github.io/

---

## What users see

| User | After login |
|------|-------------|
| Free (logged in) | **Free** folder only |
| Premium (paid) | **Free** + **Premium** folders |

Before login: **no folders** — only login + upgrade.

---

## Add more songs

1. Copy MP3 into `songs/free/` or `songs/premium/`
2. Add a track entry in `js/songs.js` under the right folder
3. `git add` → `commit` → `push`

---

## Add another folder later

Add a new block in `js/songs.js`:

```javascript
{
  id: "special",
  title: "Special",
  description: "Premium only",
  premiumRequired: true,
  tracks: [
    { id: "special-1", title: "My bhajan", file: "songs/special/my.mp3" },
  ],
},
```

Create matching folder `songs/special/` on disk.
