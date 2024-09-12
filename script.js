console.log("A script.js fájl sikeresen betöltődött.");

// Generáljunk 45 slide-ot, egyelőre ugyanazokkal a placeholder képekkel és szövegekkel
const images = Array.from({ length: 45 }, (_, i) => ({
    src: `https://via.placeholder.com/1600x900?text=Kép+${i+1}`,
    text: `Ez a(z) ${i + 1}. kép. <span class="highlight">Ez kiemelt szöveg.</span>`
}));

let currentIndex = 0;
let isPaused = false;
let isSpeaking = false; // Azt jelzi, hogy a szöveg felolvasása folyamatban van

const currentImage = document.getElementById('currentImage');
const currentText = document.getElementById('currentText');
const thumbnailsContainer = document.getElementById('thumbnails');
const stopButton = document.getElementById('stop');
const playButton = document.getElementById('play');
const resetButton = document.getElementById('reset');

// Thumbnails generálása
images.forEach((image, index) => {
    const thumb = document.createElement('img');
    thumb.src = image.src;
    thumb.dataset.index = index; // Tároljuk az indexet a thumbnailen
    thumb.addEventListener('click', () => showSlide(index));
    thumbnailsContainer.appendChild(thumb);
});

function updateThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnails img');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentIndex);
    });
    centerThumbnail(currentIndex); // Thumbnail sáv középre igazítása
}

function centerThumbnail(index) {
    const thumbnails = document.querySelectorAll('.thumbnails img');
    const thumbnailWidth = thumbnails[0].clientWidth;
    const thumbnailsWidth = thumbnailsContainer.clientWidth;
    const thumbnailPosition = thumbnails[index].offsetLeft;

    // A thumbnail sávot úgy görgetjük, hogy a kiválasztott thumbnail középen legyen
    thumbnailsContainer.scrollLeft = thumbnailPosition - (thumbnailsWidth / 2) + (thumbnailWidth / 2);
}

// Diavetítés frissítése
function showSlide(index) {
    currentIndex = index;
    currentImage.src = images[currentIndex].src;
    currentText.innerHTML = images[currentIndex].text;
    updateThumbnails();
    speakText(images[currentIndex].text);
}

// Magyar férfi hang beállítása
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, '')); // eltávolítjuk a HTML tageket
    utterance.lang = 'hu-HU';

    const voices = speechSynthesis.getVoices();
    const maleVoice = voices.find(voice => voice.lang === 'hu-HU' && voice.name.toLowerCase().includes('male'));

    if (maleVoice) {
        utterance.voice = maleVoice; // Férfi hang kiválasztása
    }

    utterance.onend = () => {
        isSpeaking = false; // Szöveg befejeződött, folytatódhat a lejátszás
        if (!isPaused) {
            nextSlide(); // Amint végez a felolvasással, automatikusan megy a következőre
        }
    };

    isSpeaking = true;
    speechSynthesis.speak(utterance);
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

// Stop funkció
stopButton.addEventListener('click', () => {
    isPaused = true;
    stopButton.classList.add('disabled'); // Stop gomb állapotának módosítása
    playButton.classList.remove('disabled'); // Play gomb engedélyezése
    resetButton.classList.add('disabled'); // Reset gomb letiltása
    speechSynthesis.cancel(); // A felolvasás megszakítása
});

// Play funkció
playButton.addEventListener('click', () => {
    isPaused = false;
    stopButton.classList.remove('disabled'); // Stop gomb engedélyezése
    playButton.classList.add('disabled'); // Play gomb letiltása
    resetButton.classList.remove('disabled'); // Reset gomb engedélyezése
    nextSlide(); // Folytatás a következő képpel
});

// Reset funkció
resetButton.addEventListener('click', () => {
    isPaused = false;
    currentIndex = 0;
    showSlide(currentIndex);
    stopButton.classList.remove('disabled'); // Stop gomb engedélyezése
    playButton.classList.add('disabled'); // Play gomb letiltása
    resetButton.classList.add('disabled'); // Reset gomb állapotának módosítása
    if (!isSpeaking) {
        nextSlide(); // Folytatás a következő képpel a reset után
    }
});

document.getElementById('nextImage').addEventListener('click', nextSlide);
document.getElementById('previousImage').addEventListener('click', previousSlide);
document.getElementById('home').addEventListener('click', () => {
    // Itt visszairányíthatod a főoldalra
    window.location.href = 'index.html';
});

// Induláskor az első kép megjelenítése
showSlide(0);
