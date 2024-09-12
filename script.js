const images = [
    { src: 'image1.jpg', text: 'Első kép leírása.' },
    { src: 'image2.jpg', text: 'Második kép leírása.' },
    { src: 'image3.jpg', text: 'Harmadik kép leírása.' },
];

let currentIndex = 0;
let isPaused = false;
let speechSynthesisUtterance = null;
const imageElement = document.getElementById('currentImage');
const textElement = document.getElementById('currentText');
const thumbnailsElement = document.getElementById('thumbnails');

// Beállítjuk a kezdeti képet és szöveget
function updateSlide(index) {
    if (index < 0 || index >= images.length) return;
    currentIndex = index;
    imageElement.src = images[index].src;
    textElement.textContent = images[index].text;
    updateThumbnails();
    readText(images[index].text);
}

// Szöveg felolvasása
function readText(text) {
    if (speechSynthesisUtterance) {
        speechSynthesis.cancel(); // Ha folyamatban van egy felolvasás, azt megszakítjuk
    }

    speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    speechSynthesisUtterance.lang = 'hu-HU';

    speechSynthesisUtterance.onend = function() {
        if (!isPaused) {
            nextImage();
        }
    };

    speechSynthesis.speak(speechSynthesisUtterance);
}

// Következő kép
function nextImage() {
    if (currentIndex < images.length - 1) {
        updateSlide(currentIndex + 1);
    }
}

// Előző kép
function previousImage() {
    if (currentIndex > 0) {
        updateSlide(currentIndex - 1);
    }
}

// Pause, resume, reset funkciók
document.getElementById('pause').addEventListener('click', function() {
    isPaused = true;
    speechSynthesis.pause();
});

document.getElementById('resume').addEventListener('click', function() {
    isPaused = false;
    speechSynthesis.resume();
});

document.getElementById('reset').addEventListener('click', function() {
    isPaused = false;
    updateSlide(0);
});

document.getElementById('previousImage').addEventListener('click', function() {
    isPaused = false;
    previousImage();
});

document.getElementById('nextImage').addEventListener('click', function() {
    isPaused = false;
    nextImage();
});

// Thumbnail kattintások
function createThumbnail(image, index) {
    const thumbnail = document.createElement('img');
    thumbnail.src = image.src;
    thumbnail.addEventListener('click', function() {
        isPaused = false;
        updateSlide(index);
    });
    thumbnailsElement.appendChild(thumbnail);
}

// Frissíti a thumbnailokat
function updateThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnails img');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentIndex);
    });
}

// Thumbnail képek létrehozása
images.forEach((image, index) => {
    createThumbnail(image, index);
});

// Induláskor az első kép megjelenítése
updateSlide(currentIndex);
