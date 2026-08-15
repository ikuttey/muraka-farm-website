(function () {
  "use strict";

  const images = Array.from(document.querySelectorAll("main img"));

  if (!images.length || typeof HTMLDialogElement === "undefined") {
    return;
  }

  const dialog = document.createElement("dialog");
  dialog.className = "content-image-lightbox";
  dialog.setAttribute("aria-label", "Expanded photograph");
  dialog.innerHTML = `
    <button class="content-image-lightbox__close" type="button" aria-label="Close expanded photograph">&times;</button>
    <figure>
      <img alt="">
      <figcaption></figcaption>
    </figure>
  `;
  document.body.appendChild(dialog);

  const expandedImage = dialog.querySelector("img");
  const expandedCaption = dialog.querySelector("figcaption");
  const closeButton = dialog.querySelector(".content-image-lightbox__close");
  let opener = null;

  const closeDialog = function () {
    if (dialog.open) {
      dialog.close();
    }
  };

  const openImage = function (image, button) {
    const figureCaption = image.closest("figure")?.querySelector("figcaption")?.textContent.trim();
    const caption = figureCaption || image.alt || "Muraka Farm photograph";

    opener = button;
    expandedImage.src = image.currentSrc || image.src;
    expandedImage.alt = image.alt || caption;
    expandedCaption.textContent = caption;
    dialog.showModal();
    closeButton.focus();
  };

  images.forEach(function (image) {
    if (image.closest("a, button")) {
      return;
    }

    const button = document.createElement("button");
    button.className = "content-image-expand";
    button.type = "button";
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-label", `View ${image.alt || "photograph"} at full size`);

    image.parentNode.insertBefore(button, image);
    button.appendChild(image);
    button.addEventListener("click", function () {
      openImage(image, button);
    });
  });

  closeButton.addEventListener("click", closeDialog);

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  dialog.addEventListener("close", function () {
    expandedImage.removeAttribute("src");
    if (opener && document.contains(opener)) {
      opener.focus();
    }
    opener = null;
  });
})();
