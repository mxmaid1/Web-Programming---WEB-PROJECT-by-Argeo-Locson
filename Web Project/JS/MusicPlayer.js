
        const songs = [
            "Audios/Full Moon Full Life.mp3",
            "Audios/Deep Breath Deep Breath.mp3",
            "Audios/Deep Breath Deep Breath -Reincarnation.mp3",
            "Audios/It’s Going Down Now.mp3",
            "Audios/Color Your Night.mp3",
            "Audios/Burn My Dread -Last Battle Reload-.mp3",
            "Audios/Mass Destruction -Reload-.mp3",
            "Audios/When The Moon's Reaching Out Stars -Reload-.mp3",
            "Audios/Paulownia Mall -Reload-.mp3",
            "Audios/Aria of the Soul (P3R ver.).mp3",
        ];

        let currentSongIndex = 0;
        const audio = document.getElementById("audio");
        const playPauseBtn = document.getElementById("playPauseBtn");
        const songTitle = document.getElementById("songTitle");
        const loopBtn = document.getElementById("loopBtn");
        const progressContainer = document.getElementById("progressContainer");
        const progressBar = document.getElementById("progressBar");
        const progressHandle = document.getElementById("progressHandle");
        const songList = document.getElementById("songList");
        const marqueeTextPlaying = document.getElementsByClassName("marquee-vertical");
        let isDragging = false;
        let wasDragging = false;
        
        function isPlaying(boolean) {
            if (boolean) {
                marqueeTextPlaying[0].textContent = "NOW PLAYING"
                playPauseBtn.textContent = "Pause"
            } else {
                marqueeTextPlaying[0].textContent = "MUSIC PAUSED"
                playPauseBtn.textContent = "Play"
            }

        }

        function updateSongTitle() {
            const songPath = songs[currentSongIndex];
            const songName = songPath.substring(songPath.lastIndexOf("/") + 1, songPath.lastIndexOf("."));
            songTitle.textContent = songName;
            highlightActiveSong();
        }

        function changeSong(index = currentSongIndex) {
            currentSongIndex = index;
            audio.src = songs[currentSongIndex];
            audio.play();
            isPlaying(true)
            updateSongTitle();
            highlightActiveSong(); // <-- make sure it's always called here
        }


        function prevSong() {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            changeSong();
        }

        function nextSong() {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            changeSong();
        }

        function togglePlayPause() {
            if (audio.paused) {
                audio.play();
                isPlaying(true)
            } else {
                audio.pause();
                isPlaying(false)
            }
        }

        function toggleLoop() {
            audio.loop = !audio.loop;
            loopBtn.textContent = "Loop: " + (audio.loop ? "On" : "Off");
        }

        function updateProgress() {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = percent + "%";
            progressHandle.style.left = percent + "%";
        }

        function seekAudio(offsetX) {
            const width = progressContainer.clientWidth;
            const duration = audio.duration;

            if (!isFinite(duration)) {
                console.warn("Duration not available yet.");
                return;
            }

            const percent = offsetX / width;
            audio.currentTime = percent * duration;
        }


        progressContainer.addEventListener("click", (event) => {
            if (wasDragging) return; // prevent conflict with drag
            seekAudio(event.offsetX);
        });

        progressHandle.addEventListener("mousedown", () => {
            isDragging = true;
            wasDragging = false;
            document.addEventListener("mousemove", onDrag);
            document.addEventListener("mouseup", onDragEnd);
        });

        function onDrag(event) {
            if (isDragging) {
                const rect = progressContainer.getBoundingClientRect();
                let offsetX = event.clientX - rect.left;
                offsetX = Math.max(0, Math.min(offsetX, rect.width));
                seekAudio(offsetX);
                wasDragging = true; // Mark drag as having occurred
            }
        }

        function onDragEnd() {
            isDragging = false;
            setTimeout(() => wasDragging = false, 50); // reset after short delay
            document.removeEventListener("mousemove", onDrag);
            document.removeEventListener("mouseup", onDragEnd);
        }


        function populateSongList() {
            const tableBody = document.querySelector("#songList tbody");
            tableBody.innerHTML = ""; // clear existing rows

            songs.forEach((song, index) => {
                const row = document.createElement("tr");

                // Create and fill table cells
                const numberCell = document.createElement("td");
                numberCell.textContent = index + 1;

                const titleCell = document.createElement("td");
                titleCell.textContent = song.substring(song.lastIndexOf("/") + 1, song.lastIndexOf("."));

                const durationCell = document.createElement("td");
                durationCell.textContent = "Loading...";

                // Add cells to the row
                row.appendChild(numberCell);
                row.appendChild(titleCell);
                row.appendChild(durationCell);

                // Click to change song
                row.addEventListener("click", () => {
                    changeSong(index);
                });

                // Set data-index for tracking
                row.setAttribute("data-index", index);

                // Append row to table
                tableBody.appendChild(row);

                // Load duration using temporary audio element
                const tempAudio = new Audio(song);
                tempAudio.addEventListener("loadedmetadata", () => {
                    const minutes = Math.floor(tempAudio.duration / 60);
                    const seconds = Math.floor(tempAudio.duration % 60).toString().padStart(2, "0");
                    durationCell.textContent = `${minutes}:${seconds}`;
                });
            });
        }

        function highlightActiveSong() {
            const rows = document.querySelectorAll("#songList tbody tr");
            rows.forEach(row => {
                row.classList.remove("active");
            });

            const activeRow = document.querySelector(`#songList tbody tr[data-index='${currentSongIndex}']`);
            if (activeRow) {
                activeRow.classList.add("active");
            }
        }

        progressContainer.style.pointerEvents = "none";

        audio.addEventListener("loadedmetadata", () => {
            progressContainer.style.pointerEvents = "auto";
        });

        audio.addEventListener("timeupdate", updateProgress);

        populateSongList();
        updateSongTitle();
