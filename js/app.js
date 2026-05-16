/**
 * Library dashboard — folders visible only after login.
 */

const audio = document.getElementById("audio-player");
const folderDashboardEl = document.getElementById("folder-dashboard");
const librarySectionEl = document.getElementById("library-section");
const playerSectionEl = document.getElementById("player-section");
const nowPlayingEl = document.getElementById("now-playing");

let activeId = null;

function getLibrary() {
  return window.SONG_LIBRARY || { folders: [] };
}

function isLoggedIn() {
  return window.MusicAuth && window.MusicAuth.loggedIn;
}

function canAccessFolder(folder) {
  if (!folder.premiumRequired) return true;
  return window.MusicPremium && window.MusicPremium.isPremium;
}

function canPlayTrack(folder) {
  if (!isLoggedIn()) return false;
  if (!canAccessFolder(folder)) return false;
  return true;
}

function getVisibleFolders() {
  const folders = getLibrary().folders || [];
  const isPremium = window.MusicPremium && window.MusicPremium.isPremium;

  return folders.filter((folder) => {
    if (!folder.premiumRequired) return true;
    return isPremium;
  });
}

function updateHeaderHint() {
  const el = document.getElementById("song-count-hint");
  if (!el) return;

  if (!isLoggedIn()) {
    el.textContent = "Log in to see your bhajan folders";
    return;
  }

  const isPremium = window.MusicPremium && window.MusicPremium.isPremium;
  if (isPremium) {
    el.textContent = "Premium member — all folders unlocked";
  } else {
    el.textContent = "Free folder unlocked · upgrade for premium folder";
  }
}

function setLibraryVisible(visible) {
  if (librarySectionEl) {
    librarySectionEl.classList.toggle("hidden", !visible);
  }
  if (playerSectionEl) {
    playerSectionEl.classList.toggle("hidden", !visible);
  }
}

function renderLibrary() {
  updateHeaderHint();

  if (!folderDashboardEl) return;

  if (!isLoggedIn()) {
    setLibraryVisible(false);
    folderDashboardEl.innerHTML = "";
    if (nowPlayingEl) {
      nowPlayingEl.textContent = "Log in to see folders and play bhajans.";
    }
    return;
  }

  setLibraryVisible(true);

  const visibleFolders = getVisibleFolders();
  folderDashboardEl.innerHTML = "";

  if (visibleFolders.length === 0) {
    folderDashboardEl.innerHTML =
      '<p class="hint">No folders configured. Edit js/songs.js</p>';
    return;
  }

  visibleFolders.forEach((folder) => {
    const block = document.createElement("div");
    block.className = "folder-block";

    const heading = document.createElement("div");
    heading.className = "folder-heading";

    const title = document.createElement("h3");
    title.textContent = folder.title;
    heading.appendChild(title);

    if (folder.description) {
      const desc = document.createElement("p");
      desc.className = "folder-desc";
      desc.textContent = folder.description;
      heading.appendChild(desc);
    }

    if (folder.premiumRequired) {
      const badge = document.createElement("span");
      badge.className = "folder-badge premium";
      badge.textContent = "Premium";
      heading.appendChild(badge);
    } else {
      const badge = document.createElement("span");
      badge.className = "folder-badge free";
      badge.textContent = "Free";
      heading.appendChild(badge);
    }

    block.appendChild(heading);

    const list = document.createElement("ul");
    list.className = "song-list";

    (folder.tracks || []).forEach((track) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = track.title;
      btn.dataset.id = track.id;

      if (track.id === activeId) btn.classList.add("active");

      btn.addEventListener("click", () => playTrack(track, folder));
      li.appendChild(btn);
      list.appendChild(li);
    });

    block.appendChild(list);
    folderDashboardEl.appendChild(block);
  });

  const allFolders = getLibrary().folders || [];
  const hiddenPremium = allFolders.some(
    (f) => f.premiumRequired && !canAccessFolder(f)
  );

  if (hiddenPremium) {
    const note = document.createElement("p");
    note.className = "hint folder-locked-note";
    note.textContent =
      "Premium folder is hidden until you upgrade. Tap Upgrade above to unlock all folders.";
    folderDashboardEl.appendChild(note);
  }
}

window.renderLibrary = renderLibrary;
window.renderSongList = renderLibrary;

function playTrack(track, folder) {
  if (!isLoggedIn()) {
    nowPlayingEl.textContent = "Please log in first.";
    return;
  }

  if (!canPlayTrack(folder)) {
    nowPlayingEl.textContent = "Upgrade to Premium to open this folder.";
    return;
  }

  activeId = track.id;
  audio.src = encodeURI(track.file).replace(/#/g, "%23");
  audio.play().catch(() => {
    nowPlayingEl.textContent =
      "Could not play. Put the file at: " + track.file;
  });
  nowPlayingEl.textContent = "Now playing: " + track.title + " (" + folder.title + ")";
  renderLibrary();
}

function playNextInLibrary() {
  const folders = getVisibleFolders();
  let foundCurrent = false;

  for (let f = 0; f < folders.length; f++) {
    const tracks = folders[f].tracks || [];
    for (let t = 0; t < tracks.length; t++) {
      if (foundCurrent) {
        playTrack(tracks[t], folders[f]);
        return;
      }
      if (tracks[t].id === activeId) {
        foundCurrent = true;
      }
    }
  }
}

audio.addEventListener("ended", playNextInLibrary);

window.onAuthChanged = function () {
  if (!isLoggedIn()) {
    activeId = null;
    audio.pause();
    audio.removeAttribute("src");
  }
  renderLibrary();
};

document.addEventListener("DOMContentLoaded", () => {
  renderLibrary();
});
