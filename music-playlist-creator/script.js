let songsArray, playlistsArray;

//Fetch songs
async function fetchSongs() {
   try{
      const res = await fetch("./data/songs.json");
      if(!res.ok){
         throw new Error(res.status)
      }

      const jsonSongs = await res.json();
      console.log("Songs: " + jsonSongs)
      return jsonSongs;
   }catch(e){
      console.error(e.message)
   }
}

//Fetch playlists
async function fetchPlaylists() {
   try{
      const res = await fetch("./data/data.json");
      if(!res.ok){
         throw new Error(res.status)
      }

      const jsonPlaylits = await res.json();
      console.log("Playlists: " + jsonPlaylits);
      return jsonPlaylits;
   }catch(e){
      console.error(e.message)
   }
}

async function startFlow() {
   try {
      //Fetch songs and playlists from the json files
      songsArray = await fetchSongs();
      playlistsArray = await fetchPlaylists();

      //Render playlists boxes
      const playlistsContainer = document.getElementById('playlist-cards');
      for(const playlist of playlistsArray){
         console.log(playlist)

         let playlistCard = document.createElement('div');
         playlistCard.className = 'playlist-card';
         playlistCard.onclick = () => openModal(playlist)

         let playlistImg = document.createElement('img');
         playlistImg.src = playlist.playlist_art;
         playlistImg.alt = playlist.playlist_name;
         playlistCard.appendChild(playlistImg)

         let info = document.createElement('div');
         info.className = 'info'
         let playlistName = document.createElement('h3');
         playlistName.textContent = playlist.playlist_name;
         info.appendChild(playlistName);
         let playlistAuthor = document.createElement('p');
         playlistAuthor.textContent = playlist.playlist_author;
         info.appendChild(playlistAuthor);
         playlistCard.appendChild(info)

         let likeContainer = document.createElement('div');
         likeContainer.className = 'like-container';
         let likeButton = document.createElement('button')
         let likeIcon = document.createElement('i');
         likeIcon.className = 'fa-regular fa-heart'
         likeButton.appendChild(likeIcon);
         let likeCount = document.createElement('p');
         likeCount.textContent = playlist.likes;
         likeContainer.appendChild(likeButton);
         likeContainer.appendChild(likeCount);
         playlistCard.appendChild(likeContainer);

         playlistsContainer.appendChild(playlistCard);
      }

   } catch (error) {
      console.error(error.message)
   }
   
}

//Loads everithing on loading
startFlow();

//Load Modal on opening
const modal = document.getElementById("event-modal");

function openModal(playlist) {
   try {
      modal.innerHTML = `
         <div class="modal-content">
               <span class="close">&times;</span>
               <section class="modal-playlist-header">
                  <img src=${playlist.playlist_art} alt=${playlist.playlist_name}>
                  <div class="modal-playlist-info">
                     <h2>${playlist.playlist_name}</h2>
                     <h3>${playlist.playlist_author}</h3>
                  </div>
               </section>
               <section id="modal-playlist-songs">
                  
               </section>
         </div>
      `

      //Modal logic
      const span = document.querySelector(".close");

      span.onclick = function() {
         modal.style.display = "none";
      }
      window.onclick = function(event) {
         if (event.target == modal) {
            modal.style.display = "none";
         }
      }

      //Load and generate songs containers
      const songsContainer = document.getElementById('modal-playlist-songs');
      console.log(playlist.songs)
      for(const songID of playlist.songs){
         let song = songsArray[songID-1];
         songsContainer.innerHTML += `
            <div class="modal-playlist-song-card">
               <div class="song-info">
                  <img src=${song.song_art} alt=${song.song_name} class="song-image">
                  <div>
                     <h4>${song.song_name}</h4>
                     <p>${song.song_author}</p>
                     <p>${song.song_album}</p>
                  </div>
               </div>
               <h4>${song.song_duration}</h4>
            </div>
         `
      }

      modal.style.display = "block";
   } catch (error) {
      console.log("bruh")
      console.error(error)
   }
}