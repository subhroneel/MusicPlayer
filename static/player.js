// Access the playlist populated by the script in index.html
// DO NOT re-declare it here as let playlist = [];
// Use window.playlist if declared on window, or just playlist if in global scope

let currentIndex = 0;
const audioPlayer = document.getElementById('audioPlayer');
const songList = document.getElementById('songList');
const seekBar = document.getElementById('seekBar');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const localFileInput = document.getElementById('localFile'); // Get file input element

// Check if playlist was initialized (optional defensive check)
if (!window.playlist) {
    console.error("Playlist was not initialized by the preceding script in index.html.");
    window.playlist = []; // Initialize as empty fallback
} else {
    console.log("Playlist initialized successfully from index.html.");
}


// === Load selected song ===
// Modified to find the index based on the selected option's value (which is now the URL)
function selectSong(selectElement) {
    console.log("selectSong called with value:", selectElement.value);
    const selectedUrl = selectElement.value;
    // Find the index of the song object in the playlist with this URL
    const newIndex = window.playlist.findIndex(song => song.url === selectedUrl);

    if (newIndex !== -1) {
        console.log("Found song at index:", newIndex);
        currentIndex = newIndex;
        playSong(currentIndex); // Play by index
    } else {
        console.error("Selected song not found in playlist:", selectedUrl);
        // Handle error - maybe stop or select the first song
        stopSong();
        if (window.playlist.length > 0) {
            songList.selectedIndex = 0; // Select the first item visually
        }
    }
}

// === Play song ===
// Modified to accept the index from the playlist
function playSong(index) {
    console.log("playSong called with index:", index);
    if (index < 0 || index >= window.playlist.length) {
        console.error("Invalid playlist index:", index);
        stopSong(); // Or handle appropriately
        return;
    }

    currentIndex = index;
    const song = window.playlist[currentIndex];
    console.log("Attempting to play:", song);
    audioPlayer.src = song.url; // Use the correct URL from the object
    audioPlayer.play();

    // Update the select list to show the currently playing song
    // Find the option whose value matches the current song's URL
    const options = Array.from(songList.options);
    const optionToSelect = options.find(option => option.value === song.url);
    if (optionToSelect) {
        songList.value = song.url; // Set the select value to the song's URL
        console.log("Updated select list value to:", song.url);
    } else {
        console.warn("Could not find option for current song URL in select list:", song.url);
        // This might happen if the list isn't perfectly in sync, but should be rare with correct logic
    }

    console.log(`Now Playing: ${song.name} (Index: ${currentIndex})`);
}

// === Start or resume ===
function startSong() {
    console.log("startSong called");
    if (audioPlayer.paused && audioPlayer.src) {
        console.log("Resuming playback.");
        audioPlayer.play();
    } else if (window.playlist.length > 0) {
         console.log("No source or stopped, attempting to play current/first song.");
        // If not playing and playlist has songs, start the current or first one
        playSong(currentIndex >= 0 && currentIndex < window.playlist.length ? currentIndex : 0);
    } else {
        console.log("Cannot start: Playlist is empty.");
    }
}

// === Pause ===
function pauseSong() {
    console.log("pauseSong called");
    audioPlayer.pause();
}

// === Stop ===
function stopSong() {
    console.log("stopSong called");
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    seekBar.value = 0; // Reset seek bar visually
    currentTimeDisplay.textContent = '0:00'; // Reset time display
    // durationDisplay.textContent = '0:00'; // Keep duration if available, or reset? Let's keep for now.
}

// === Next ===
function nextSong() {
    console.log("nextSong called");
    if (window.playlist.length === 0) {
        console.log("Playlist is empty, cannot play next.");
        return;
    }
     if (currentIndex === -1) currentIndex = 0; // Handle case where no song is selected initially
    currentIndex = (currentIndex + 1) % window.playlist.length;
    playSong(currentIndex);
}

// === Previous ===
function prevSong() {
    console.log("prevSong called");
    if (window.playlist.length === 0) {
         console.log("Playlist is empty, cannot play previous.");
        return;
    }
    if (currentIndex === -1) currentIndex = 0; // Handle case where no song is selected initially
    currentIndex = (currentIndex - 1 + window.playlist.length) % window.playlist.length;
    playSong(currentIndex);
}

// === Volume slider ===
volumeSlider.addEventListener('input', () => {
    // Ensure volume is between 0 and 1
    const volume = parseFloat(volumeSlider.value) / 100;
    audioPlayer.volume = volume;
    volumeValue.textContent = `${volumeSlider.value}%`;
    // console.log("Volume changed to:", audioPlayer.volume);
});

// Initialize volume display
// This should be done after the element is created, ideally in index.html script block or here after DOM load
audioPlayer.volume = parseFloat(volumeSlider.value) / 100; // Set initial volume
volumeValue.textContent = `${volumeSlider.value}%`;


// === Seek bar updates ===
audioPlayer.addEventListener('timeupdate', () => {
    // Only update seek bar if audio duration is available and not NaN/Infinity
    if (!isNaN(audioPlayer.duration) && isFinite(audioPlayer.duration)) {
        seekBar.max = audioPlayer.duration;
        seekBar.value = audioPlayer.currentTime;
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        // Only update duration display once it's known
         if (durationDisplay.textContent === '0:00') {
             durationDisplay.textContent = formatTime(audioPlayer.duration);
         }
    } else {
        // If duration is not available yet, reset or show default
         seekBar.max = 0;
         seekBar.value = 0;
         currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime); // Still show elapsed time if possible
         durationDisplay.textContent = '0:00'; // Or 'Loading...'
    }
});

// Event listener for when duration is first available
audioPlayer.addEventListener('loadedmetadata', () => {
     console.log("loadedmetadata event fired. Duration:", audioPlayer.duration);
    if (!isNaN(audioPlayer.duration) && isFinite(audioPlayer.duration)) {
        seekBar.max = audioPlayer.duration;
        durationDisplay.textContent = formatTime(audioPlayer.duration);
         // Reset seek bar on new song load
        seekBar.value = 0;
        currentTimeDisplay.textContent = '0:00';
    }
});

audioPlayer.addEventListener('error', (e) => {
    console.error("Audio playback error:", e);
    alert("Error playing audio. Check browser console for details.");
    stopSong(); // Stop on error
});


// === Seek by dragging slider ===
seekBar.addEventListener('input', () => {
    // Only update current time if audio duration is available
     if (!isNaN(audioPlayer.duration) && isFinite(audioPlayer.duration)) {
         // console.log("Seeking to:", seekBar.value);
        audioPlayer.currentTime = seekBar.value;
     }
});

// === Auto play next song when current one ends ===
audioPlayer.addEventListener('ended', () => {
     console.log("Audio ended, playing next song.");
    nextSong();
});


// === Format time (mm:ss) ===
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// === Add Local Songs ===
// This function is now triggered by the change event of the hidden input
function addLocalSongs() {
    console.log("addLocalSongs function called");
    const files = Array.from(localFileInput.files);
    console.log("Selected files array:", files);

    if (files.length === 0) {
        console.log("No files selected in the picker.");
        return;
    }

    const initialPlaylistLength = window.playlist.length;
    console.log("Current playlist length before adding:", initialPlaylistLength);

    files.forEach(file => {
        try {
            console.log("Processing file:", file.name);
            const url = URL.createObjectURL(file); // Create object URL for local file
            console.log("Created object URL:", url);
            const songObject = { name: file.name, url: url };

            // Add to the shared playlist array
            window.playlist.push(songObject);
            console.log("Added song object to playlist:", songObject);

            // Add to the select list
            const option = new Option(window.playlist.length + ". " + file.name, url); // Use URL as the option value
            songList.appendChild(option);
            console.log("Appended option to song list for:", file.name);

        } catch (error) {
            console.error("Error processing local file:", file.name, error);
            // Continue with the next file
        }
    });

    console.log(`Finished adding local songs. New playlist length: ${window.playlist.length}`);

    // Optional: auto-play the first added song if nothing was playing
    if (!audioPlayer.src || audioPlayer.paused) {
        console.log("No song playing or paused. Attempting to play the first added local song.");
        const firstAddedIndex = initialPlaylistLength;
         if (firstAddedIndex < window.playlist.length) {
             playSong(firstAddedIndex);
         } else {
             console.log("No songs were actually added.");
         }
    }

     // Clear the file input so the same file(s) can be selected again later
     // console.log("Clearing file input value.");
     localFileInput.value = ''; // Do this outside the loop
}

// === Remove Song ===
function removeSong() {
    console.log("removeSong called");
    const selectedIndex = songList.selectedIndex;

    if (selectedIndex !== -1) {
         console.log("Selected index for removal:", selectedIndex);
        // Get the URL of the song to be removed
        const songToRemoveUrl = songList.options[selectedIndex].value;
        const songToRemoveName = songList.options[selectedIndex].textContent;
        console.log(`Attempting to remove: ${songToRemoveName} (URL: ${songToRemoveUrl})`);


        // Find the index in the playlist array using the URL
        const playlistIndex = window.playlist.findIndex(song => song.url === songToRemoveUrl);

         console.log("Corresponding playlist index:", playlistIndex);

        if (playlistIndex !== -1) {
             // Remove from the playlist array
            window.playlist.splice(playlistIndex, 1);
             console.log(`Removed song from playlist array. New length: ${window.playlist.length}`);

             // Remove from the <select> options
            songList.remove(selectedIndex);
             console.log("Removed option from select list.");


            // Adjust currentIndex if the removed song was before or at the current index
            if (currentIndex === playlistIndex) {
                console.log("Removed currently playing song.");
                // If the currently playing song is removed, stop playback
                stopSong();
                // Optionally, select the next song if available, or first if none
                if (window.playlist.length > 0) {
                     // Try to play the song that is now at the original playlistIndex position
                     // If the original index was the last one, play the new last song (which is at length - 1)
                     const nextIndex = Math.min(playlistIndex, window.playlist.length - 1);
                     console.log("Attempting to play next song at index:", nextIndex);
                     playSong(nextIndex);
                } else {
                    // Playlist is empty
                    console.log("Playlist is now empty after removal.");
                    currentIndex = 0; // Reset index
                }
            } else if (currentIndex > playlistIndex) {
                // If a song before the current one was removed, decrement currentIndex
                currentIndex--;
                 console.log("Adjusted current index down after removal. New index:", currentIndex);
            }
             // If currentIndex is less than playlistIndex, no index adjustment needed

        } else {
             console.warn("Could not find song object in playlist array based on select value.");
             // This case shouldn't happen if select list and playlist are in sync
             // Still remove from the select list even if playlist sync failed just visually
              songList.remove(selectedIndex);
        }


        // If there are still songs, ensure one is selected in the list (if the removed item was selected)
        if (songList.options.length > 0 && songList.selectedIndex === -1) {
            songList.selectedIndex = 0;
             console.log("Resetting select list selection to the first item.");
             // Don't auto-play here, just select in the list
        } else if (songList.options.length === 0) {
            // If list is empty, reset UI
            console.log("Select list is now empty.");
            songList.value = '';
             currentIndex = 0; // Reset index
        }


    } else {
        console.log("No song selected for removal.");
    }
}

// --- Initial State ---
// Ensure the select list reflects the initial playlist content
// This should be handled by the Jinja loop and the script block in index.html
// However, we need to make sure the select options have the correct 'value' (the URL)
// The Jinja loop in the revised index.html already sets value="/music/{{ song }}", which is correct.
// The initial script block in index.html populates window.playlist with {name, url: /music/songName}

// Set the currently selected item in the select list initially if playlist is not empty
// This runs when player.js loads
if (window.playlist && window.playlist.length > 0) {
     console.log("Setting initial select list selection.");
     currentIndex = 0; // Start with the first song
     const initialSongUrl = window.playlist[currentIndex].url;
     const options = Array.from(songList.options);
     const optionToSelect = options.find(option => option.value === initialSongUrl);
     if (optionToSelect) {
         songList.value = initialSongUrl;
         console.log("Initial song selected in list:", initialSongUrl);
     } else {
         console.warn("Could not find initial song URL in select list options.");
         // This could happen if the Jinja options don't match the playlist exactly initially
     }
} else {
    console.log("Initial playlist is empty.");
     currentIndex = 0; // Ensure index is 0 if playlist is empty
}

// Optional: auto-play the first song when the page loads
// Make sure the playlist has songs before attempting to play
// if (window.playlist && window.playlist.length > 0) {
//     playSong(0); // Uncomment this line to auto-play the first song on load
// }

console.log("player.js finished loading.");
