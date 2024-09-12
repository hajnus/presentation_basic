console.log("A script.js fájl sikeresen betöltődött.");

// Generáljunk 45 slide-ot, egyelőre ugyanazokkal a placeholder képekkel és szövegekkel
const images = Array.from({ length: 45 }, (_, i) => ({
    src: `https://via.placeholder.com/1600x900?text=Kép+${i+1}`,
    text: `Ez a(z) ${i + 1}. kép. <span class="highlight">Ez kiemelt szöveg.</span>`
}));

let currentIndex = 0;
let isPaused = false;
let isSpeaking = false; // Azt jelzi, hogy a szöveg felolvasása folyamatban van
let currentUtterance = null; // Aktuális felolvasás tárolása

// Elemenek
const currentImage = document.getElementById('currentImage');
const currentText = document.getElementById('currentText');
const thumbnails = document.getElementById('thumbnails');
const previousButton = document.getElementById('previousImage');
const nextButton = document.getElementById('nextImage');
const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');
const resetButton = document.getElementById('reset');
const homeButton = document.getElementById('home');

let currentIndex = 0;
let intervalId;
let isPaused = false;

// Kép és szöveg frissítése
function updateContent() {
    currentImage.src = images[currentIndex];
    currentText.textContent = texts[currentIndex];
    updateThumbnails();
}

// Thumbnailok frissítése
function updateThumbnails() {
    thumbnails.innerHTML = '';
    images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.className = index === currentIndex ? 'active' : '';
        img.addEventListener('click', () => {
            currentIndex = index;
            updateContent();
        });
        thumbnails.appendChild(img);
    });
}

// Diavetítés előre
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateContent();
}

// Diavetítés hátra
function previousImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateContent();
}

// Diavetítés leállítása
function pauseSlideshow() {
    clearInterval(intervalId);
    isPaused = true;
}

// Diavetítés folytatása
function resumeSlideshow() {
    if (isPaused) {
        intervalId = setInterval(nextImage, 3000);
        isPaused = false;
    }
}

// Diavetítés visszaállítása
function resetSlideshow() {
    clearInterval(intervalId);
    currentIndex = 0;
    updateContent();
    resumeSlideshow();
}

// Kezdő időzítő
intervalId = setInterval(nextImage, 3000);

// Eseménykezelők
previousButton.addEventListener('click', previousImage);
nextButton.addEventListener('click', nextImage);
pauseButton.addEventListener('click', pauseSlideshow);
resumeButton.addEventListener('click', resumeSlideshow);
resetButton.addEventListener('click', resetSlideshow);
homeButton.addEventListener('click', () => {
    window.location.href = 'index.html'; // Változtasd meg az otthoni oldal URL-jét
});

// Kezdeti tartalom frissítése
updateContent();
