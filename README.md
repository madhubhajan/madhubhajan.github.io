# Madhu Bhajan (Music PWA)

A simple bhajan/music player you can open in the browser and install on your phone.

**GitHub:** https://github.com/omdattaadmin/madhubhajan  
**Live site (after Pages is enabled):** https://omdattaadmin.github.io/madhubhajan/

## MVP (this repo)

- 3 free songs (add your own MP3 files — see `songs/README.txt`)
- Phone login (Firebase — added in a later step)
- Premium / Razorpay — **version 2** (after login works)

## Run on your computer

1. Open `index.html` in Chrome (double-click, or right-click → Open with → Chrome).
2. Add three MP3 files to the `songs` folder (names in `songs/README.txt`).
3. Refresh the page and tap a song.

## Put on GitHub Pages (after you create the repo on GitHub)

1. On GitHub: repo → **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` → folder `/ (root)` → **Save**
4. Wait 1–2 minutes. Your site will be at:
   https://omdattaadmin.github.io/madhubhajan/

## Folder map

| File / folder      | What it does                          |
|--------------------|----------------------------------------|
| `index.html`       | Main page                              |
| `css/style.css`    | Colors and layout                      |
| `js/app.js`        | Player + song list                     |
| `js/auth.js`       | Login (Firebase — wired up later)      |
| `songs/`           | Your MP3 files                         |
| `manifest.json`    | “Install app” on phone (step later)    |
