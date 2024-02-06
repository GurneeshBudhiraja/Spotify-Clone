let currentAudio = null;
let isPLaying = null;
// to keep track of the last clicked button
let lastClickedButton = null;

// for your library section
document.querySelector('.all-songs').addEventListener('click', function (event) {
  // Check if the clicked element is a child of song-card
  let songCard = event.target.closest(".song-card");
  if (songCard) {
    // for changing the icons on the songs
    let button = songCard.querySelector(".play-pause");
    const songname = songCard.dataset.songname;
    // Checking if there is any audio playing
    if (currentAudio) {
      if (currentAudio.dataset.songname === songname) {
        if (!currentAudio.paused) {
          currentAudio.pause();
          isPLaying = false;
          toggleButton(button, isPLaying);
          console.log("audio paused");
          return;
        }
      } else {
        // If a different song is clicked, pause the current one
        currentAudio.pause();
        isPLaying = false;
        toggleButton(button, isPLaying);
      }
    }
    let audio = new Audio(`/songs/${songname}.mp3`);
    currentAudio = audio;
    // for storing the current playing song
    currentAudio.dataset.songname = songname;
    songPlay(currentAudio);
    isPLaying=true;
    toggleButton(button,isPLaying);
    if(lastClickedButton && lastClickedButton!==button) {
      toggleButton(lastClickedButton,false)
    }
    lastClickedButton=button;
  }
});

// for spotify playlists section
document.querySelector(".cards").addEventListener("click", function (evt) {
  if(lastClickedButton) {
    toggleButton(lastClickedButton,false);
  }
  const card = evt.target.closest(".card");
  if (card) {
    const songname = card.dataset.songname;
    if (currentAudio) {
      if (currentAudio.dataset.songname === songname) {
        if (!currentAudio.paused) {
          currentAudio.pause();
          return;
        }
      } else {
        currentAudio.pause();
      }
    }
    let audio = new Audio(`/songs/${songname}.mp3`);
    currentAudio = audio;
    currentAudio.dataset.songname = songname;
    songPlay(currentAudio);
  }
});


// play the song
function songPlay(currentAudio) {
  currentAudio.addEventListener("canplaythrough", function () {
    currentAudio.play();
    console.log("audio playing");
  });
  return;
}

// for changing the play pause icon
function toggleButton(button, isPLaying) {
  if (isPLaying) {
    button.classList.remove("ri-play-circle-line");
    button.classList.add("ri-pause-circle-line")
  } else {
    button.classList.remove("ri-pause-circle-line");
    button.classList.add("ri-play-circle-line");
  }
  return;
}