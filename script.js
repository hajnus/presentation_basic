console.log("A script.js fájl sikeresen betöltődött.");

        const images = Array.from({ length: 45 }, (_, i) => ({
            src: `https://via.placeholder.com/1600x900?text=Kép+${i+1}`,
            text: `Ez a(z) ${i + 1}. kép. <span class="highlight">Ez kiemelt szöveg.</span>`
        }));

        let currentIndex = 0;
        let isPaused = false;
        let isSpeaking = false;

        const currentImage = document.getElementById('currentImage');
        const currentText = document.getElementById('currentText');
        const thumbnailsContainer = document.getElementById('thumbnails');
        const pauseButton = document.getElementById('pause');
        const resumeButton = document.getElementById('resume');
        const resetButton = document.getElementById('reset');
        const nextButton = document.getElementById('nextImage');
        const previousButton = document.getElementById('previousImage');
        const homeButton = document.getElementById('home');

        images.forEach((image, index) => {
            const thumb = document.createElement('img');
            thumb.src = image.src;
            thumb.dataset.index = index;
            thumb.addEventListener('click', () => showSlide(index));
            thumbnailsContainer.appendChild(thumb);
        });

        function updateThumbnails() {
            const thumbnails = document.querySelectorAll('.thumbnails img');
            thumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === currentIndex);
            });
            centerThumbnail(currentIndex);
        }

        function centerThumbnail(index) {
            const thumbnails = document.querySelectorAll('.thumbnails img');
            const thumbnailWidth = thumbnails[0].clientWidth;
            const thumbnailsWidth = thumbnailsContainer.clientWidth;
            const thumbnailPosition = thumbnails[index].offsetLeft;

            thumbnailsContainer.scrollLeft = thumbnailPosition - (thumbnailsWidth / 2) + (thumbnailWidth / 2);
        }

        function showSlide(index) {
            currentIndex = index;
            currentImage.src = images[currentIndex].src;
            currentText.innerHTML = images[currentIndex].text;
            updateThumbnails();
            speakText(images[currentIndex].text);
        }

        function speakText(text) {
            const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, ''));
            utterance.lang = 'hu-HU';

            speechSynthesis.getVoices().then(voices => {
                const maleVoice = voices.find(voice => voice.lang === 'hu-HU' && voice.name.toLowerCase().includes('male'));
                if (maleVoice) {
                    utterance.voice = maleVoice;
                }
                utterance.onend = () => {
                    isSpeaking = false;
                    if (!isPaused) {
                        nextSlide();
                    }
                };
                isSpeaking = true;
                speechSynthesis.speak(utterance);
            });
        }

        function nextSlide() {
            if (!isPaused && !isSpeaking) {
                currentIndex = (currentIndex + 1) % images.length;
                showSlide(currentIndex);
            }
        }

        function previousSlide() {
            if (!isPaused && !isSpeaking) {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showSlide(currentIndex);
            }
        }

        pauseButton.addEventListener('click', () => {
            isPaused = true;
            pauseButton.classList.add('disabled');
            resumeButton.classList.remove('disabled');
            resetButton.classList.add('disabled');
            speechSynthesis.cancel();
        });

        resumeButton.addEventListener('click', () => {
            isPaused = false;
            pauseButton.classList.remove('disabled');
            resumeButton.classList.add('disabled');
            resetButton.classList.remove('disabled');
            if (!isSpeaking) {
                nextSlide();
            }
        });

        resetButton.addEventListener('click', () => {
            isPaused = false;
            currentIndex = 0;
            showSlide(currentIndex);
            pauseButton.classList.remove('disabled');
            resumeButton.classList.add('disabled');
            resetButton.classList.add('disabled');
            if (!isSpeaking) {
                nextSlide();
            }
        });

        nextButton.addEventListener('click', nextSlide);
        previousButton.addEventListener('click', previousSlide);
        homeButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        showSlide(0);
