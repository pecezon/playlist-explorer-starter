import { fetchPlaylists, fetchSongs } from "./script.js";
let featuredPlaylist, playlistsArray, songsArray;

//Pick featured playlist function
function pickFeaturedPlaylist() {
  return playlistsArray[Math.floor(Math.random() * playlistsArray.length)];
}

//Load Featured Playlist Page
async function loadFeaturedPlaylistPage() {
  try {
    songsArray = await fetchSongs();
    playlistsArray = await fetchPlaylists();
  } catch (error) {
    console.error(error);
  }

  featuredPlaylist = pickFeaturedPlaylist();

  const featuredPlaylistInfoContainer = document.getElementById(
    "featured-playlist-description"
  );
  featuredPlaylistInfoContainer.innerHTML = `
      <img src="${featuredPlaylist.playlist_art}" alt="Playlist Image">
      <div>
         <h1>${featuredPlaylist.playlist_name}</h1>
         <h3>${featuredPlaylist.playlist_author}</h3>
      </div>
   `;

  //Songs
  const featuredSongsContainer = document.getElementById(
    "featured-playlist-songs"
  );

  console.log("Container" + featuredSongsContainer);

  // Reset the innerHTML
  featuredSongsContainer.innerHTML = "";

  //Display song by song
  for (const songID of featuredPlaylist.songs) {
    console.log("Featured Play Song " + songID);
    let song = songsArray[songID - 1];
    featuredSongsContainer.innerHTML += `
            <div class="featured-playlist-song">
                <div class="featured-playlist-song-info">
                    <i class="fa-solid fa-music"></i>
                    <img src=${song.song_art} alt=${song.song_name}>
                    <div>
                        <h3>${song.song_name}</h3>
                        <p>${song.song_author}</p>
                    </div>
                </div>
                <h4 class="featured-song-album">${song.song_album}</h4>
                <h4 class="featured-song-duration">${song.song_duration}</h4>
            </div>
         `;
  }
}

loadFeaturedPlaylistPage();
