// Fetch random dog images and update the slides
async function fetchDogImages() {
  try {
    const responses = await Promise.all([
      fetch("https://dog.ceo/api/breeds/image/random"),
      fetch("https://dog.ceo/api/breeds/image/random"),
      fetch("https://dog.ceo/api/breeds/image/random"),
    ]);

    const images = await Promise.all(responses.map(res => res.json()));

    const [currentImage, nextImage, prevImage] = images;

    updateSlideBackground(".slide.current", currentImage.message);
    updateSlideBackground(".slide.next", nextImage.message);
    updateSlideBackground(".slide.previous", prevImage.message);

    if (carousel) {
      carousel.style.backgroundImage = `url('${currentImage.message}')`;
    } else {
      console.error('Element with class "carousel" not found');
    }
  } catch (error) {
    console.error("Error fetching dog images:", error);
  }
}

// Update background image of specified slide
function updateSlideBackground(selector, imageUrl) {
  const slide = document.querySelector(selector);
  if (slide) {
    slide.style.backgroundImage = `url('${imageUrl}')`;
  } else {
    console.error(`Slide with selector "${selector}" not found`);
  }
}

fetchDogImages();

const slides = document.querySelectorAll(".slide");
const carousel = document.querySelector(".carousel");
const controls = document.querySelectorAll(".control");
let currentIndex = 0;

controls.forEach((control, index) => {
  control.addEventListener("click", () => {
    index === 0 ? navigatePrev() : navigateNext();
  });
});

const navigatePrev = () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlideClasses();
};

const navigateNext = () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlideClasses();
};

const updateSlideClasses = () => {
  slides.forEach((slide, index) => {
    slide.classList.remove("current", "previous", "next");

    const existingBoxLeft = slide.querySelector(".left-hover");
    if (existingBoxLeft) {
      existingBoxLeft.remove();
    }
    const existingBoxRight = slide.querySelector(".right-hover");
    if (existingBoxRight) {
      existingBoxRight.remove();
    }

    slide.style.transform = "";

    if (index === currentIndex) {
      slide.classList.add("current");

      const boxLeft = document.createElement("div");
      boxLeft.className = "left-hover";
      const boxRight = document.createElement("div");
      boxRight.className = "right-hover";
      slide.appendChild(boxLeft);
      slide.appendChild(boxRight);

      boxLeft.addEventListener("mouseenter", () => {
        slide.style.transform = "translate(-50%, -50%) rotateY(-20deg)";
      });
      boxLeft.addEventListener("mouseleave", () => {
        slide.style.transform = "";
      });

      boxRight.addEventListener("mouseenter", () => {
        slide.style.transform = "translate(-50%, -50%) rotateY(20deg)";
      });
      boxRight.addEventListener("mouseleave", () => {
        slide.style.transform = "";
      });
    } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
      slide.classList.add("previous");
    } else if (index === (currentIndex + 1) % slides.length) {
      slide.classList.add("next");
    }
  });

  const activeSlide = document.querySelector(".slide.current");
  if (activeSlide) {
    const imageUrl = window.getComputedStyle(activeSlide).backgroundImage;
    if (carousel) {
      carousel.style.backgroundImage = imageUrl;
    } else {
      console.error('Element with class "carousel" not found');
    }
  } else {
    console.error('Slide with class "current" not found');
  }
};

updateSlideClasses();
