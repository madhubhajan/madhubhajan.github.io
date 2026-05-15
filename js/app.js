/**
 * Music player — 3 free songs (MVP)
 * Login gate is prepared in auth.js (Firebase comes later).
 */

const SONGS = [
  { id: "song1", title: "Song 1", file: "songs/song1.mp3" },
  { id: "song2", title: "Song 2", file: "songs/song2.mp3" },
  { id: "song3", title: "Song 3", file: "songs/song3.mp3" },
];

const audio = document.getElementById("audio-player");
const songListEl = document.getElementById("song-list");
const nowPlayingEl = document.getElementById("now-playing");

let activeId = null;

function renderSongList() {
  songListEl.innerHTML = "";
  SONGS.forEach((song) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = song.title;
    btn.dataset.id = song.id;
    if (song.id === activeId) btn.classList.add("active");
    btn.addEventListener("click", () => playSong(song));
    li.appendChild(btn);
    songListEl.appendChild(li);
  });
}

function playSong(song) {
  if (window.MusicAuth && !window.MusicAuth.canPlay()) {
    nowPlayingEl.textContent = "Please log in to play music.";
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
    playSong(SONGS[idx + 1]);
  }
});

renderSongList();
