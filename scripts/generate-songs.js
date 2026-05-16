/**
 * Scan songs/free and songs/premium → write js/songs.js
 * Run: node scripts/generate-songs.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SONGS_DIR = path.join(ROOT, "songs");
const OUT_FILE = path.join(ROOT, "js", "songs.js");

function slug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function titleFromFilename(name) {
  return name.replace(/\.mp3$/i, "").trim();
}

function collectMp3s(dirPath, urlPrefix) {
  const tracks = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === "README.txt") continue;

    const full = path.join(dirPath, entry.name);
    const urlPath = urlPrefix + "/" + entry.name;

    if (entry.isDirectory()) {
      tracks.push(...collectMp3s(full, urlPath));
    } else if (/\.mp3$/i.test(entry.name)) {
      tracks.push({
        id: slug(urlPath),
        title: titleFromFilename(entry.name),
        file: "songs" + urlPath.replace(/\\/g, "/"),
      });
    }
  }

  tracks.sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));
  return tracks;
}

function scanTier(tierId, premiumRequired) {
  const tierPath = path.join(SONGS_DIR, tierId);
  if (!fs.existsSync(tierPath)) return [];

  const albums = [];
  const entries = fs.readdirSync(tierPath, { withFileTypes: true });
  const rootTracks = [];

  for (const entry of entries) {
    if (entry.name === "README.txt") continue;

    const full = path.join(tierPath, entry.name);
    const urlBase = "/" + tierId;

    if (entry.isDirectory()) {
      const tracks = collectMp3s(full, urlBase + "/" + entry.name);
      if (tracks.length > 0) {
        albums.push({
          id: tierId + "-" + slug(entry.name),
          title: entry.name,
          description: tracks.length + " bhajans",
          premiumRequired,
          tracks,
        });
      }
    } else if (/\.mp3$/i.test(entry.name)) {
      rootTracks.push({
        id: slug(tierId + "-" + entry.name),
        title: titleFromFilename(entry.name),
        file: ("songs" + urlBase + "/" + entry.name).replace(/\\/g, "/"),
      });
    }
  }

  if (rootTracks.length > 0) {
    albums.unshift({
      id: tierId + "-general",
      title: "General",
      description: rootTracks.length + " bhajans",
      premiumRequired,
      tracks: rootTracks.sort((a, b) => a.title.localeCompare(b.title)),
    });
  }

  return albums;
}

const freeAlbums = scanTier("free", false);
const premiumAlbums = scanTier("premium", true);
const folders = [...freeAlbums, ...premiumAlbums];

const output =
  "/**\n" +
  " * Auto-generated from songs/free and songs/premium\n" +
  " * Re-run: node scripts/generate-songs.js\n" +
  " */\n" +
  "window.SONG_LIBRARY = " +
  JSON.stringify({ folders }, null, 2) +
  ";\n";

fs.writeFileSync(OUT_FILE, output, "utf8");

console.log("Wrote " + OUT_FILE);
console.log("Folders: " + folders.length);
console.log(
  "Tracks: " + folders.reduce((n, f) => n + f.tracks.length, 0)
);
