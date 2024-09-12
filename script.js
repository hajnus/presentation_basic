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
const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');
const resetButton = document.getElementById('reset');
const nextButton = document.getElementById('nextImage');
const previousButton = document.getElementById('previousImage');
const homeButton = document.getElementById('home');

// Thumbnails generálása
images.forEach((image, index) => {
    const thumb = document.createElement('img');
    thumb.src = image.src;
    thumb.dataset.index = index; // Tároljuk az indexet a thumbnailen
    thumb.addEventListener('click', () => {
        handleNavigation(index);
    });
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
    if (!isPaused) {
        speakText(images[currentIndex].text);
    }
}

// Magyar férfi hang beállítása
async function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, '')); // eltávolítjuk a HTML tageket
    utterance.lang = 'hu-HU';

    const voices = await getVoice();
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

function getVoice() {
    return new Promise(resolve => {
        const voices = speechSynthesis.getVoices();
        if (voices.length) {
            resolve(voices);
        } else {
            speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
        }
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

function handleNavigation(index) {
    if (isSpeaking) {
        speechSynthesis.cancel(); // Megakadályozzuk a szöveg további felolvasását
    }
    showSlide(index);
    if (!isPaused) {
        speakText(images[index].text); // Az új kép szövegének felolvasása
    }
}

// Pause funkció
pauseButton.addEventListener('click', () => {
    isPaused = true;
    pauseButton.classList.add('disabled'); // Pause gomb állapotának módosítása
    resumeButton.classList.remove('disabled'); // Resume gomb engedélyezése
    resetButton.classList.add('disabled'); // Reset gomb letiltása
    speechSynthesis.cancel(); // A felolvasás megszakítása
});

// Resume funkció
resumeButton.addEventListener('click', () => {
    isPaused = false;
    pauseButton.classList.remove('disabled'); // Pause gomb engedélyezése
    resumeButton.classList.add('disabled'); // Resume gomb letiltása
    resetButton.classList.remove('disabled'); // Reset gomb engedélyezése
    if (!isSpeaking) {
        speakText(images[currentIndex].text); // Az aktuális kép szövegének felolvasása
    }
});

// Reset funkció
resetButton.addEventListener('click', () => {
    isPaused = false;
    currentIndex = 0;
    showSlide(currentIndex);
    pauseButton.classList.remove('disabled'); // Pause gomb engedélyezése
    resumeButton.classList.add('disabled'); // Resume gomb letiltása
    resetButton.classList.add('disabled'); // Reset gomb állapotának módosítása
    if (!isSpeaking) {
        nextSlide(); // Folytatás a következő képpel a reset után
    }
});

nextButton.addEventListener('click', () => {
    if (isSpeaking) {
        speechSynthesis.cancel(); // Megakadályozzuk a szöveg további felolvasását
    }
    nextSlide();
    if (!isPaused) {
        speakText(images[currentIndex].text); // Az aktuális kép szövegének felolvasása
    }
});

previousButton.addEventListener('click', () => {
    if (isSpeaking) {
        speechSynthesis.cancel(); // Megakadályozzuk a szöveg további felolvasását
    }
    previousSlide();
    if (!isPaused) {
        speakText(images[currentIndex].text); // Az aktuális kép szövegének felolvasása
    }
});

homeButton.addEventListener('click', () => {
    if (isSpeaking) {
        speechSynthesis.cancel(); // Megakadályozzuk a szöveg további felolvasását
    }
    window.location.href = 'index.html';
});

// Induláskor az első kép megjelenítése
showSlide(0);
