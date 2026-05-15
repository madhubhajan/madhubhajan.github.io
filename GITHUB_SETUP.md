# GitHub setup for Madhu Bhajan

Your project folder on this PC: **`D:\music-pwa`**

Your GitHub repo: **[omdattaadmin/madhubhajan](https://github.com/omdattaadmin/madhubhajan)**

---

## Part 1 — Create repo on GitHub ✅ DONE

You already created:

- **Username:** `omdattaadmin`
- **Repo name:** `madhubhajan`
- **URL:** https://github.com/omdattaadmin/madhubhajan

---

## Part 2 — Push your code from Windows

Your PC already has the code and a git commit. You only need to **connect** GitHub and **push**.

1. Press **Win + R**, type `powershell`, press Enter.
2. Copy and paste these lines **one at a time** (press Enter after each):

```powershell
cd D:\music-pwa
```

```powershell
git remote add origin https://github.com/omdattaadmin/madhubhajan.git
```

> If you see *“remote origin already exists”*, run this instead, then push again:
>
> ```powershell
> git remote set-url origin https://github.com/omdattaadmin/madhubhajan.git
> ```

```powershell
git push -u origin main
```

3. If Git asks you to sign in:
   - Use your **omdattaadmin** GitHub account, or
   - Sign in via browser when prompted.

4. Refresh https://github.com/omdattaadmin/madhubhajan — you should see files like `index.html`, `css`, `js`, `songs`.

---

## Part 3 — Turn on GitHub Pages

1. Open https://github.com/omdattaadmin/madhubhajan
2. Click **Settings** → **Pages** (left sidebar).
3. Under **Build and deployment** → **Source**: choose **Deploy from a branch**.
4. **Branch:** `main` → folder **`/ (root)`** → **Save**.
5. Wait 1–2 minutes. Your live site will be at:

   **https://omdattaadmin.github.io/madhubhajan/**

6. Open that link on your phone’s browser to test.

---

## Part 4 — Add your 3 MP3 files

1. Copy these into `D:\music-pwa\songs\`:
   - `song1.mp3`
   - `song2.mp3`
   - `song3.mp3`
2. In PowerShell:

```powershell
cd D:\music-pwa
git add songs/*.mp3
git -c user.name="omdattaadmin" -c user.email="omdattaadmin@users.noreply.github.com" commit -m "Add 3 free songs"
git push
```

3. After push, wait ~1 minute and reload **https://omdattaadmin.github.io/madhubhajan/**

---

## Razorpay (later)

**Not in MVP.** Premium payments come in **version 2**, after Firebase phone login works.

---

## Test on your computer (before or after push)

1. Add the 3 MP3 files to `D:\music-pwa\songs\`.
2. Double-click `D:\music-pwa\index.html`.
3. Enter any 10-digit number → **Continue** → tap a song.

If something fails, say which step (2, 3, or 4) and paste the error message.
