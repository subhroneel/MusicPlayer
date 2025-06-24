let currentIndex = 0;
const audioPlayer = document.getElementById('audioPlayer');
const songList = document.getElementById('songList');
const seekBar = document.getElementById('seekBar');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');

// === Load selected song ===
function selectSong(selectElement) {
    const selectedSong = selectElement.value;
    currentIndex = playlist.indexOf(selectedSong);
    playSong(selectedSong);
}

// === Play song ===
function playSong(songName) {
    audioPlayer.src = `/music/${songName}`;
    audioPlayer.play();
    songList.value = songName;
}

// === Start or resume ===
function startSong() {
    if (!audioPlayer.src) {
        playSong(playlist[currentIndex]);
    } else {
        audioPlayer.play();
    }
}

// === Pause ===
function pauseSong() {
    audioPlayer.pause();
}

// === Stop ===
function stopSong() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
}

// === Next ===
function nextSong() {
    currentIndex = (currentIndex + 1) % playlist.length;
    playSong(playlist[currentIndex]);
}

// === Previous ===
function prevSong() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playSong(playlist[currentIndex]);
}

// === Volume slider ===
volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value / 100;
    volumeValue.textContent = `${volumeSlider.value}%`;
});

// === Seek bar updates ===
audioPlayer.addEventListener('timeupdate', () => {
    seekBar.max = audioPlayer.duration;
    seekBar.value = audioPlayer.currentTime;

    // Format time display
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
    durationDisplay.textContent = formatTime(audioPlayer.duration);
});

// === Seek by dragging slider ===
seekBar.addEventListener('input', () => {
    audioPlayer.currentTime = seekBar.value;
});

// === Format time (mm:ss) ===
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

let localSongs = [];

function addLocalSongs() {
    const input = document.getElementById('localFile');
    const files = Array.from(input.files);

    files.forEach(file => {
        const url = URL.createObjectURL(file);
        localSongs.push({ name: file.name, url: url });
        const option = new Option(file.name, url);
        songList.appendChild(option);
    });

    // Optional: auto-select first added song
    if (files.length > 0) {
        songList.value = localSongs[0].url;
        audioPlayer.src = localSongs[0].url;
        audioPlayer.play();
    }
}
