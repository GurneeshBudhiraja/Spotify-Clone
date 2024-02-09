let currentAudio = null;
let isPLaying = null;
// to keep track of the last clicked button
let lastClickedButton = null;
let volumeControl = document.querySelector(".volume-bar");
const volumeIcon = document.querySelector(".volume-icon");
const playerPlay = document.querySelector(".player-play");
let globalButton = null;
let playTime = document.querySelector(".play-time");
let totalDuration = document.querySelector(".total-duration");
console.log(playTime, totalDuration);
// for your library section
document.querySelector('.all-songs').addEventListener('click', function (event) {
  // Check if the clicked element is a child of song-card
  let songCard = event.target.closest(".song-card");
  if (songCard) {
    // for changing the icons on the songs
    let button = songCard.querySelector(".play-pause");
    globalButton = button;
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
    isPLaying = true;
    toggleButton(button, isPLaying);
    if (lastClickedButton && lastClickedButton !== button) {
      toggleButton(lastClickedButton, false)
    }
    lastClickedButton = button;
  }
});

// for spotify playlists section
document.querySelector(".cards").addEventListener("click", function (evt) {
  if (lastClickedButton) {
    toggleButton(lastClickedButton, false);
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

// volume control
volumeControl.addEventListener('input', function () {
  if (currentAudio) {
    currentAudio.volume = volumeControl.value;
    // for changing this
    if (currentAudio.volume === 0) {
      changeVolumeIcon(true);
    } else {
      changeVolumeIcon(false);
    }
  }
});

// for changing the volume buttom
function changeVolumeIcon(bool) {
  if (bool) {
    volumeIcon.classList.remove("ri-volume-up-line");
    volumeIcon.classList.add("ri-volume-mute-line");
    return;
  }
  // if !bool
  volumeIcon.classList.add("ri-volume-up-line");
  volumeIcon.classList.remove("ri-volume-mute-line");
}

// play the song
function songPlay(currentAudio) {
  currentAudio.addEventListener("canplaythrough", function () {
    currentAudio.play();
    // totalDuration.innerText=(currentAudio.duration);
    //return the duration in seconds
    let totalDurationSec = Math.trunc(currentAudio.duration);
    let totalDurationMin = null;
    // converting the seconds into minutes
    if (totalDurationSec >= 60) {
      while (totalDurationSec >= 60) {
        totalDurationMin += 1;
        totalDurationSec -= 60;
      }
    }
    let formattedSeconds = totalDurationSec < 10 ? "0" + totalDurationSec : totalDurationSec == 0 ? "00" : totalDurationSec;
    let formattedTime = totalDurationMin + ":" + formattedSeconds;
    totalDuration.textContent = formattedTime;
    console.log("audio playing");
    // moving the circle on the progress bar as the song plays
    currentAudio.addEventListener("timeupdate", function () {
      let progress = (currentAudio.currentTime / currentAudio.duration) * 100;
      let circlePosition = progress + "%";
      document.querySelector(".bar-circle").style.left = circlePosition;
      const currentTimeSec = Math.floor(this.currentTime); //getting the floor value
      // converting to minutes
      const minutes = Math.floor(currentTimeSec / 60);
      // getting the seconds from the currenTimeSec
      const seconds = currentTimeSec % 60;
      // Format minutes and seconds with leading zeros
      const formattedTime = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
      // Update the playTime element's text content
      playTime.textContent = formattedTime;

    });
    return;
  });
}

// for changing the play pause icon
function toggleButton(button, isPLaying) {
  if (isPLaying) {
    button.classList.remove("ri-play-circle-line");
    button.classList.add("ri-pause-circle-line");
    playerPlay.classList.add("ri-pause-mini-line");
    playerPlay.classList.remove("ri-play-mini-line");

  } else {
    button.classList.remove("ri-pause-circle-line");
    button.classList.add("ri-play-circle-line");
    playerPlay.classList.add("ri-play-mini-line");
    playerPlay.classList.remove("ri-pause-mini-line");
  }
  return;
}
playerPlay.addEventListener("click", function () {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    toggleButton(globalButton, false);
  } else if (currentAudio && currentAudio.paused) {
    currentAudio.play();
    toggleButton(globalButton, true);
  }
})

// toggle volume bar visibility for max-width:700px
document.addEventListener("DOMContentLoaded", function () {
  // Function to toggle volume bar visibility
  function toggleVolumeBar() {
    volumeControl.style.display = (volumeControl.style.display === "block") ? "none" : "block";
  }
  if (window.innerWidth <= 1200) {
    volumeIcon.addEventListener("click", toggleVolumeBar);
  }
});
