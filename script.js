const images = [
    { src: 'images/image1.jpg', text: 'Első kép leírása.' },
    { src: 'images/image2.jpg', text: 'Második kép leírása.' },
    { src: 'images/image3.jpg', text: 'Harmadik kép leírása.' },
];
Helyi fejlesztés:
Ha a képeket egy helyi szerveren próbálod betölteni (pl. localhost), győződj meg róla, hogy a szervered megfelelően fut, és elérhetőek a fájlok.

Minta fájlszerkezet:
markdown
Copy code
project-folder/
│
├── index.html
├── script.js
└── images/
    ├── image1.jpg
    ├── image2.jpg
    └── image3.jpg
Ebben az esetben az index.html és a script.js fájlok azonos mappában vannak, és az images mappában találhatóak a képek. Az elérési út images/image1.jpg, images/image2.jpg, stb.

Ellenőrizd ezeket a pontokat, és ha így sem működik, írd meg a konkrét hibaüzenetet vagy a pontos fájlszerkezetet, hogy további segítséget tudjak nyújtani.






You said:
nincsenek képek, hanem 45 képhelyettesítőt csak mutatóba most beillesztünk
ChatGPT said:
ChatGPT
Ha jelenleg nincsenek tényleges képek, de szeretnél 45 képhelyettesítőt használni (pl. placeholder képeket), akkor beilleszthetsz egy általánosan használt placeholder szolgáltatást, például a placekitten-t, ami véletlenszerű macskaképeket ad megadott méretben.

Az alábbi kódban 45 képhelyettesítőt használunk, és minden képhez a placekitten.com szolgáltatás ad vissza egy 800x600 méretű macskaképet. Ezekhez képzelt leírásokat is adtam, hogy a szöveg felolvasása működjön.

Frissített kód a placeholder képekkel
javascript
Copy code
const images = Array.from({ length: 45 }, (_, index) => ({
    src: `https://placekitten.com/800/600?image=${index}`, // Kép helyettesítő URL
    text: `Kép ${index + 1} leírása.`, // Minden képhez tartozik egy leírás
}));

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
