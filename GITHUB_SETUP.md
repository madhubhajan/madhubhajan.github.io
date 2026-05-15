# Create your GitHub repo (copy-paste steps)

Do these in order. Your project folder on this PC is:

`D:\music-pwa`

---

## Part 1 — Create empty repo on GitHub (website)

1. Open https://github.com/new in your browser.
2. Sign in if needed.
3. Fill in:
   - **Repository name:** `music-pwa` (use exactly this so URLs match our docs)
   - **Description:** (optional) `Music player PWA`
   - **Public** — selected
   - **Do NOT** check “Add a README” (we already have files on your PC)
4. Click **Create repository**.
5. Leave that page open — you will see commands under “…or push an existing repository from the command line”.

---

## Part 2 — Push your folder from Windows

1. Press **Win + R**, type `powershell`, press Enter.
2. Copy and paste these lines **one at a time** (press Enter after each):

```powershell
cd D:\music-pwa
```

```powershell
git init
```

```powershell
git add .
```

```powershell
git commit -m "Initial MVP: player, login placeholder, 3 songs"
```

```powershell
git branch -M main
```

Replace `YOUR_GITHUB_USERNAME` with your real username, then run:

```powershell
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/music-pwa.git
```

```powershell
git push -u origin main
```

3. If Git asks you to sign in, use your GitHub account (browser or token).

---

## Part 3 — Turn on GitHub Pages

1. On GitHub, open your repo `music-pwa`.
2. Click **Settings** → **Pages** (left sidebar).
3. Under **Build and deployment** → **Source**: choose **Deploy from a branch**.
4. **Branch:** `main` → folder **`/ (root)`** → **Save**.
5. After 1–2 minutes, your app is live at:

   `https://YOUR_GITHUB_USERNAME.github.io/music-pwa/`

---

## Part 4 — Add your 3 MP3 files

1. Copy `song1.mp3`, `song2.mp3`, `song3.mp3` into `D:\music-pwa\songs\`.
2. In PowerShell:

```powershell
cd D:\music-pwa
git add songs/*.mp3
git commit -m "Add 3 free songs"
git push
```

---

## Razorpay (our choice for you)

**Not in MVP.** We add premium payments in **version 2** after Firebase phone login works. That keeps today’s setup simple (only GitHub Pages, no server bill yet).

---

## Test locally before pushing

1. Add the 3 MP3 files to `songs\`.
2. Double-click `D:\music-pwa\index.html`.
3. Enter any 10-digit number → **Continue** → tap a song.

If something fails, say which step number and what you see on screen.
