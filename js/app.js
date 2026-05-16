/**
 * Music player — uses song list from songs.js
 */

const audio = document.getElementById("audio-player");
const songListEl = document.getElementById("song-list");
const nowPlayingEl = document.getElementById("now-playing");

let activeId = null;

function getSongs() {
  return window.SONGS || [];
}

function canPlaySong(song) {
  if (window.MusicAuth && !window.MusicAuth.canPlay()) {
    return false;
  }
  if (window.MusicPremium && !window.MusicPremium.canPlaySong(song)) {
    return false;
  }
  return true;
}

function renderSongList() {
  const songs = getSongs();
  songListEl.innerHTML = "";

  songs.forEach((song) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    const locked =
      song.premium && window.MusicPremium && !window.MusicPremium.isPremium;
    let label = song.title;
    if (song.premium) label += locked ? " · Premium" : " · Premium ✓";
    if (locked) label = "🔒 " + label;
    btn.textContent = label;
    btn.dataset.id = song.id;
    if (song.id === activeId) btn.classList.add("active");
    if (locked) btn.classList.add("locked");
    btn.addEventListener("click", () => playSong(song));
    li.appendChild(btn);
    songListEl.appendChild(li);
  });

  updateSongCountHint();
}

function updateSongCountHint() {
  const el = document.getElementById("song-count-hint");
  if (!el) return;
  const songs = getSongs();
  const free = songs.filter((s) => !s.premium).length;
  const premium = songs.filter((s) => s.premium).length;
  el.textContent =
    free + " free · " + premium + " premium · log in to listen";
}

window.renderSongList = renderSongList;

function playSong(song) {
  if (!canPlaySong(song)) {
    if (window.MusicAuth && !window.MusicAuth.canPlay()) {
      nowPlayingEl.textContent = "Please log in to play music.";
    } else if (song.premium) {
      nowPlayingEl.textContent = "Premium only — tap Upgrade to unlock.";
    }
    return;
  }

  activeId = song.id;
  audio.src = song.file;
  audio.play().catch(() => {
    nowPlayingEl.textContent =
      "Could not play. Add " + song.file.split("/").pop() + " to the songs folder.";
  });
  nowPlayingEl.textContent = "Now playing: " + song.title;
  renderSongList();
}

audio.addEventListener("ended", () => {
  const songs = getSongs();
  const idx = songs.findIndex((s) => s.id === activeId);
  if (idx >= 0 && idx < songs.length - 1) {
    const next = songs[idx + 1];
    if (canPlaySong(next)) {
      playSong(next);
    }
  }
});

renderSongList();
