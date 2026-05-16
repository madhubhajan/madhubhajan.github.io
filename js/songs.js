/**
 * Song folders — edit titles and files here.
 * MP3 files go in songs/free/ and songs/premium/ on your PC.
 */
window.SONG_LIBRARY = {
  folders: [
    {
      id: "free",
      title: "Free",
      description: "All logged-in listeners",
      premiumRequired: false,
      tracks: [
        {
          id: "free-1",
          title: "Bhajan 1",
          file: "songs/free/song1.mp3",
        },
        {
          id: "free-2",
          title: "Bhajan 2",
          file: "songs/free/song2.mp3",
        },
      ],
    },
    {
      id: "premium",
      title: "Premium",
      description: "After ₹99 upgrade",
      premiumRequired: true,
      tracks: [
        {
          id: "premium-1",
          title: "Bhajan 3",
          file: "songs/premium/song3.mp3",
        },
      ],
    },
  ],
};
