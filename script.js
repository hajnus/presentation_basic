document.addEventListener("DOMContentLoaded", function () {
    console.log("A script.js fájl sikeresen betöltődött.");

    const images = Array.from({length: 45}, () => 'https://via.placeholder.com/1600x900'); // Egy alapértelmezett kép
    const texts = Array.from({length: 45}, (_, i) => `Szöveg a ${i+1}. képhez.`); // Add texts

    let currentIndex = 0;
    let isPaused = false;
    let timer;

    const imageElement = document.getElementById("currentImage");
    const textElement = document.getElementById("currentText");
    const previousButton = document.getElementById("previousImage");
    const nextButton = document.getElementById("nextImage");
    const pauseButton = document.getElementById("pause");
    const resumeButton = document.getElementById("resume");
    const resetButton = document.getElementById("reset");
    const homeButton = document.getElementById("home");

    function showImageAndText(index) {
        if (index < 0 || index >= images.length) return;

        imageElement.src = images[index];
        textElement.textContent = texts[index];

        const utterance = new SpeechSynthesisUtterance(texts[index]);
        speechSynthesis.speak(utterance);

        utterance.onend = () => {
            if (!isPaused) {
                nextImage();
            }
        };
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImageAndText(currentIndex);
    }

    function previousImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImageAndText(currentIndex);
    }

    function pauseSlideshow() {
        isPaused = true;
        clearTimeout(timer);
        // Update button states
        pauseButton.classList.add("disabled");
        resumeButton.classList.remove("disabled");
    }

    function resumeSlideshow() {
        isPaused = false;
        nextImage(); // Continue with the next image
        // Update button states
        pauseButton.classList.remove("disabled");
        resumeButton.classList.add("disabled");
    }

    function resetSlideshow() {
        currentIndex = 0;
        showImageAndText(currentIndex);
        isPaused = false;
        pauseButton.classList.remove("disabled");
        resumeButton.classList.add("disabled");
    }

    function goHome() {
        window.location.href = "index.html"; // Or whatever your home page is
    }

    previousButton.addEventListener("click", previousImage);
    nextButton.addEventListener("click", nextImage);
    pauseButton.addEventListener("click", pauseSlideshow);
    resumeButton.addEventListener("click", resumeSlideshow);
    resetButton.addEventListener("click", resetSlideshow);
    homeButton.addEventListener("click", goHome);

    // Initialize with the first image and text
    showImageAndText(currentIndex);
});
