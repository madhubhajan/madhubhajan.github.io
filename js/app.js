/**
 * Music player — free + premium bhajans
 */

const SONGS = [
  { id: "song1", title: "Song 1", file: "songs/song1.mp3", premium: false },
  { id: "song2", title: "Song 2", file: "songs/song2.mp3", premium: false },
  { id: "song3", title: "Song 3", file: "songs/song3.mp3", premium: true },
];

const audio = document.getElementById("audio-player");
const songListEl = document.getElementById("song-list");
const nowPlayingEl = document.getElementById("now-playing");

let activeId = null;

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
  songListEl.innerHTML = "";
  SONGS.forEach((song) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    const locked = song.premium && window.MusicPremium && !window.MusicPremium.isPremium;
    btn.textContent = locked ? "🔒 " + song.title + " (Premium)" : song.title;
    btn.dataset.id = song.id;
    if (song.id === activeId) btn.classList.add("active");
    if (locked) btn.classList.add("locked");
    btn.addEventListener("click", () => playSong(song));
    li.appendChild(btn);
    songListEl.appendChild(li);
  });
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
  const idx = SONGS.findIndex((s) => s.id === activeId);
  if (idx >= 0 && idx < SONGS.length - 1) {
    const next = SONGS[idx + 1];
    if (canPlaySong(next)) {
      playSong(next);
    }
  }
});

renderSongList();
