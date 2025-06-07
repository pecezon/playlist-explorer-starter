let songsArray, playlistsArray;

//Fetch songs
export async function fetchSongs() {
  try {
    const res = await fetch("./data/songs.json");
    if (!res.ok) {
      throw new Error(res.status);
    }

    const jsonSongs = await res.json();
    console.log("Songs: " + jsonSongs);
    return jsonSongs;
  } catch (e) {
    console.error(e.message);
  }
}

//Fetch playlists
export async function fetchPlaylists() {
  try {
    const res = await fetch("./data/data.json");
    if (!res.ok) {
      throw new Error(res.status);
    }

    const jsonPlaylits = await res.json();
    console.log("Playlists: " + jsonPlaylits);
    return jsonPlaylits;
  } catch (e) {
    console.error(e.message);
  }
}

//Create Playlists Cards given an array of playlists (default is ordered by creation date)
function createPlaylistCards(playlistsArr = playlistsArray) {
  //Render playlists boxes
  const playlistsContainer = document.getElementById("playlist-cards");

  //Empty playlists container
  playlistsContainer.innerHTML = "";

  for (const playlist of playlistsArr) {
    //Create playlist card
    let playlistCard = document.createElement("div");
    playlistCard.className = "playlist-card";

    //Create Image Section
    let playlistImg = document.createElement("img");
    playlistImg.src = playlist.playlist_art;
    playlistImg.alt = playlist.playlist_name;
    playlistCard.appendChild(playlistImg);
    playlistImg.onclick = () => openModal(playlist);

    let info = document.createElement("div");
    info.className = "info";
    let playlistName = document.createElement("h3");
    playlistName.textContent = playlist.playlist_name;
    info.appendChild(playlistName);
    let playlistAuthor = document.createElement("p");
    playlistAuthor.textContent = playlist.playlist_author;
    info.appendChild(playlistAuthor);
    playlistCard.appendChild(info);
    info.onclick = () => openModal(playlist);

    let cardFooter = document.createElement("div");
    cardFooter.className = "card-footer";

    let likeContainer = document.createElement("div");
    likeContainer.className = "like-container";
    let likeButton = document.createElement("button");
    let likeIcon = document.createElement("i");
    likeIcon.className = "fa-regular fa-heart";
    likeButton.appendChild(likeIcon);
    let likeCount = document.createElement("p");
    likeCount.textContent = playlist.likes;
    likeButton.onclick = () =>
      likePlaylist(playlist.playlistID, likeButton, likeIcon, likeCount);
    likeContainer.appendChild(likeButton);
    likeContainer.appendChild(likeCount);

    let deleteIcon = document.createElement("i");
    deleteIcon.className = "delete-icon ";
    deleteIcon.classList.add("fa");
    deleteIcon.classList.add("fa-trash");
    deleteIcon.onclick = () => {
      playlistCard.style.display = "none";
    };

    cardFooter.appendChild(likeContainer);
    cardFooter.appendChild(deleteIcon);

    playlistCard.appendChild(cardFooter);
    playlistsContainer.appendChild(playlistCard);
  }
}

//Starting flow to render page
async function startFlow() {
  try {
    //Fetch songs and playlists from the json files
    songsArray = await fetchSongs();
    playlistsArray = await fetchPlaylists();
    createPlaylistCards();

    let filteredPlaylistsArray = playlistsArray;

    //Logic for SearchBar on Enter
    const searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        filteredPlaylistsArray = playlistsArray.filter((playlist) =>
          playlist.playlist_name
            .toLowerCase()
            .includes(searchBar.value.toLowerCase())
        );
        console.log(filteredPlaylistsArray);
        createPlaylistCards(filteredPlaylistsArray);
      }
    });

    //SearchBar Button Logic
    const searchButton = document.getElementById("search-button");
    searchButton.onclick = () => {
      console.log("bruh");
      filteredPlaylistsArray = playlistsArray.filter((playlist) =>
        playlist.playlist_name
          .toLowerCase()
          .includes(searchBar.value.toLowerCase())
      );
      console.log(filteredPlaylistsArray);
      createPlaylistCards(filteredPlaylistsArray);
    };

    //Clear Search Bar Logic
    const clearSearchButton = document.getElementById("clear-search-button");
    clearSearchButton.onclick = () => {
      searchBar.value = "";
      filteredPlaylistsArray = playlistsArray;
      createPlaylistCards();
    };

    //Logic for Sort By Menu
    const radioGroup = document.getElementById("radio-container");
    radioGroup.addEventListener("change", () =>
      sortPlaylist(filteredPlaylistsArray)
    );

    //Logic for new playlist modal opening
    const newPlaylistButton = document.getElementById("new-playlist-button");
    newPlaylistButton.addEventListener("click", () => openNewPlaylistModal());
  } catch (error) {
    console.error(error.message);
  }
}

//Sort playlist given the radio input value
function sortPlaylist(playlistsArr = playlistsArray) {
  if (event.target.type === "radio") {
    if (event.target.value === "sort-dates") {
      let sortedPlaylistsArray = [...playlistsArr].sort(
        (a, b) => a.playlistID - b.playlistID
      );
      console.log(playlistsArray);
      createPlaylistCards(sortedPlaylistsArray);
    } else if (event.target.value === "sort-likes") {
      let sortedPlaylistsArray = [...playlistsArr].sort(
        (a, b) => a.likes - b.likes
      );
      console.log(playlistsArray);
      createPlaylistCards(sortedPlaylistsArray);
    } else if (event.target.value === "sort-names") {
      let sortedPlaylistsArray = [...playlistsArr].sort((a, b) =>
        a.playlist_name > b.playlist_name
          ? 1
          : b.playlist_name > a.playlist_name
          ? -1
          : 0
      );
      createPlaylistCards(sortedPlaylistsArray);
    }
  }
}

//Loads everything on loading
startFlow();

//Load Modal on opening
const modal = document.getElementById("event-modal");

//Open Modal given a playlist object
function openModal(playlist) {
  try {
    modal.innerHTML = `
         <div class="modal-content">
            <div id="modal-nav">
              <span class="close">&times;</span>
            </div> 
            <section class="modal-playlist-header">
              <img src=${playlist.playlist_art} alt=${playlist.playlist_name}>
              <div class="modal-playlist-info">
                <h2>${playlist.playlist_name}</h2>
                <h3>${playlist.playlist_author}</h3>
                <button id="shuffle-btn">Shuffle</button>
              </div>
            </section>
            <section id="modal-playlist-songs">
                    
            </section>
         </div>
      `;

    //Give a onclick to the shuffle button
    const shuffleButton = document.getElementById("shuffle-btn");
    shuffleButton.onclick = () => shufflePlaylist(playlist);

    //Render songs
    loadSongs(playlist);

    //Modal closing logic
    const span = document.querySelector(".close");

    span.onclick = function () {
      modal.style.display = "none";
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };

    modal.style.display = "block";
  } catch (error) {
    console.error(error);
  }
}

//New Playlist Modal Form
const newPlaylistModal = document.getElementById("new-playlist-modal");

//Open Modal given a playlist object
function openNewPlaylistModal() {
  newPlaylistModal.style.display = "block";

  window.onclick = function (event) {
    if (event.target == newPlaylistModal) {
      newPlaylistModal.style.display = "none";
    }
  };
  console.log("abriendo");
}

//Load and generate songs containers
function loadSongs(playlist) {
  const songsContainer = document.getElementById("modal-playlist-songs");
  console.log(playlist.songs);

  // Reset the innerHTML
  songsContainer.innerHTML = "";

  for (const songID of playlist.songs) {
    let song = songsArray[songID - 1];
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
         `;
  }
}

//Shuffle an array function
function shuffleArray(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

//Shuffle playlist function
function shufflePlaylist(playlist) {
  playlist.songs = shuffleArray(playlist.songs);
  loadSongs(playlist);
}

//Like process
async function likePlaylist(playlistID, buttonContainer, icon, likeCount) {
  if (buttonContainer.classList.contains("liked")) {
    //Logic for already liked element

    //Remove the class for styling
    buttonContainer.classList.remove("liked");
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");

    //Subtract 1 to the like total
    playlistsArray[playlistID - 1].likes--;
    likeCount.textContent = playlistsArray[playlistID - 1].likes;
  } else {
    //Logic for unliked element

    //Add liked class for styling
    buttonContainer.classList.add("liked");
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");

    //Add 1 to the like total
    if (playlistsArray[playlistID - 1].likes > 0) {
      playlistsArray[playlistID - 1].likes++;
    }
    likeCount.textContent = playlistsArray[playlistID - 1].likes;
  }

  //TODO: here I would code the logic of saving the updated playlists, but  browser logic doesnt let the user to modify the files contents (POST, PUT, PATCH)
}
