console.log("A script.js fájl sikeresen betöltődött.");


// Generáljunk 45 slide-ot, egyelőre ugyanazokkal a placeholder képekkel és szövegekkel
const images = Array.from({ length: 45 }, (_, i) => ({
    src: `https://via.placeholder.com/1000x600?text=Kép+${i+1}`,
    text: `Ez a(z) ${i + 1}. kép. <span class="highlight">Ez kiemelt szöveg.</span>`
}));

let currentIndex = 0;
let isPaused = false;
let isSpeaking = false; // Azt jelzi, hogy a szöveg felolvasása folyamatban van

const currentImage = document.getElementById('currentImage');
const currentText = document.getElementById('currentText');
const thumbnailsContainer = document.getElementById('thumbnails');

// Thumbnails generálása
images.forEach((image, index) => {
    const thumb = document.createElement('img');
    thumb.src = image.src;
    thumb.addEventListener('click', () => showSlide(index));
    thumbnailsContainer.appendChild(thumb);
});

function updateThumbnails() {
    document.querySelectorAll('.thumbnails img').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentIndex);
    });
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
            nextSlide();
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
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showSlide(currentIndex);
}

// Eseménykezelők a gombokra
document.getElementById('nextImage').addEventListener('click', nextSlide);
document.getElementById('previousImage').addEventListener('click', previousSlide);
document.getElementById('pause').addEventListener('click', () => {
    isPaused = !isPaused;
    if (isPaused) {
        speechSynthesis.cancel();
    } else {
        nextSlide();
    }
});
document.getElementById('restart').addEventListener('click', () => {
    showSlide(0);
});
document.getElementById('home').addEventListener('click', () => {
    // Itt visszairányíthatod a főoldalra
    window.location.href = 'index.html';
});

// Induláskor az első kép megjelenítése
showSlide(0);
