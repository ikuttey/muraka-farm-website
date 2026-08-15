(function () {
  "use strict";

  const gallery = document.querySelector("[data-island-gallery]");
  const dialog = document.querySelector(".island-gallery-lightbox");

  if (!gallery) {
    return;
  }

  const track = gallery.querySelector(".island-gallery-track");
  const slides = Array.from(gallery.querySelectorAll(".island-gallery-slide"));
  const expandButtons = slides.map(slide => slide.querySelector(".island-gallery-expand"));
  const dots = Array.from(gallery.querySelectorAll(".island-gallery-dots button"));
  const status = gallery.querySelector(".island-gallery-status");
  const previousButton = gallery.querySelector(".island-gallery-arrow--previous");
  const nextButton = gallery.querySelector(".island-gallery-arrow--next");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentIndex = 0;
  let scrollFrame = 0;
  let opener = null;

  const wrapIndex = function (index) {
    return (index + slides.length) % slides.length;
  };

  const updateControls = function (index) {
    currentIndex = wrapIndex(index);
    status.textContent = `${currentIndex + 1} / ${slides.length}`;

    slides.forEach(function (slide, slideIndex) {
      const active = slideIndex === currentIndex;
      slide.setAttribute("aria-hidden", String(!active));
      expandButtons[slideIndex].tabIndex = active ? 0 : -1;
      dots[slideIndex].setAttribute("aria-current", String(active));
    });
  };

  const showSlide = function (index, smooth) {
    const nextIndex = wrapIndex(index);
    updateControls(nextIndex);
    track.scrollTo({
      left: nextIndex * track.clientWidth,
      behavior: smooth && !reduceMotion.matches ? "smooth" : "auto"
    });
  };

  previousButton.addEventListener("click", function () {
    showSlide(currentIndex - 1, true);
  });

  nextButton.addEventListener("click", function () {
    showSlide(currentIndex + 1, true);
  });

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index, true);
    });
  });

  track.addEventListener("scroll", function () {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(function () {
      const nextIndex = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
      updateControls(nextIndex);
    });
  }, { passive: true });

  gallery.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(currentIndex - 1, true);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(currentIndex + 1, true);
    }
  });

  window.addEventListener("resize", function () {
    showSlide(currentIndex, false);
  });

  if (!dialog || typeof HTMLDialogElement === "undefined") {
    expandButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const image = button.querySelector("img");
        window.open(image.currentSrc || image.src, "_blank", "noopener");
      });
    });
    return;
  }

  const lightboxImage = dialog.querySelector("img");
  const lightboxCaption = dialog.querySelector("figcaption");
  const lightboxClose = dialog.querySelector(".island-gallery-lightbox-close");
  const lightboxPrevious = dialog.querySelector(".island-gallery-lightbox-arrow--previous");
  const lightboxNext = dialog.querySelector(".island-gallery-lightbox-arrow--next");

  const updateLightbox = function (index) {
    const nextIndex = wrapIndex(index);
    const slide = slides[nextIndex];
    const image = slide.querySelector("img");
    currentIndex = nextIndex;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = slide.querySelector("figcaption").textContent.trim();
    showSlide(nextIndex, false);
    if (dialog.open) {
      opener = expandButtons[nextIndex];
    }
  };

  const closeLightbox = function () {
    if (dialog.open) {
      dialog.close();
    }
  };

  expandButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      opener = button;
      updateLightbox(index);
      dialog.showModal();
      lightboxClose.focus();
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrevious.addEventListener("click", function () {
    updateLightbox(currentIndex - 1);
  });
  lightboxNext.addEventListener("click", function () {
    updateLightbox(currentIndex + 1);
  });

  dialog.addEventListener("keydown", function (event) {
    event.stopPropagation();
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      updateLightbox(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      updateLightbox(currentIndex + 1);
    }
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      closeLightbox();
    }
  });

  dialog.addEventListener("close", function () {
    lightboxImage.removeAttribute("src");
    const focusTarget = opener;
    opener = null;
    window.setTimeout(function () {
      if (focusTarget && document.contains(focusTarget)) {
        focusTarget.focus();
      }
    }, 0);
  });

  updateControls(0);
})();
