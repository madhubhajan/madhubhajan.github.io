/**
 * PWA: service worker + optional Install button (Chrome / Edge / Android).
 */

let deferredInstallPrompt = null;

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.error("Service worker failed:", err));
  });
}

function setupInstallButton() {
  const installBtn = document.getElementById("install-app-btn");
  if (!installBtn) return;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installBtn.classList.remove("hidden");
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
      showInstallHint();
      return;
    }

    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installBtn.classList.add("hidden");
  });

  window.addEventListener("appinstalled", () => {
    installBtn.classList.add("hidden");
    deferredInstallPrompt = null;
  });
}

function showInstallHint() {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const msg = isIOS
    ? "On iPhone: tap Share → Add to Home Screen."
    : "On Android: menu (⋮) → Install app, or Add to Home screen.";
  alert(msg);
}

registerServiceWorker();
document.addEventListener("DOMContentLoaded", setupInstallButton);
