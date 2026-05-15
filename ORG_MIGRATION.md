# Move site to https://madhubhajan.github.io

Organization ready: https://github.com/madhubhajan

---

## Step 1 — Create the special repo (browser)

You must be logged in as someone who **owns** the `madhubhajan` org.

1. Open: https://github.com/organizations/madhubhajan/repositories/new  
   (Or: org page → **Repositories** → **New repository**)
2. Fill in:
   - **Owner:** `madhubhajan` (organization)
   - **Repository name:** `madhubhajan.github.io` (exactly this)
   - **Public**
   - **Do NOT** check “Add a README”
3. Click **Create repository**

---

## Step 2 — Push code from your PC

Open PowerShell and run **one line at a time**:

```powershell
cd D:\music-pwa
```

```powershell
git remote set-url origin https://github.com/madhubhajan/madhubhajan.github.io.git
```

```powershell
git push -u origin main
```

Sign in with GitHub if asked (use an account that can push to the `madhubhajan` org).

---

## Step 3 — Turn on GitHub Pages

1. Open: https://github.com/madhubhajan/madhubhajan.github.io/settings/pages
2. **Source:** Deploy from a branch
3. **Branch:** `main` → **`/ (root)`** → **Save**
4. Wait 2–10 minutes
5. Your site: **https://madhubhajan.github.io/**

---

## Step 4 — Firebase (Google login)

1. https://console.firebase.google.com/ → project **madhubhajan-fc952**
2. **Authentication** → **Settings** → **Authorized domains**
3. **Add domain:** `madhubhajan.github.io`
4. Keep `omdattaadmin.github.io` for now (old link) or remove later

---

## Step 5 — Test

1. Open **https://madhubhajan.github.io/**
2. **Ctrl + F5**
3. **Continue with Google**
4. Play a bhajan

---

## Old URL

`https://omdattaadmin.github.io/madhubhajan/` may still work for a while. Use the new URL everywhere (WhatsApp, posters, etc.).
