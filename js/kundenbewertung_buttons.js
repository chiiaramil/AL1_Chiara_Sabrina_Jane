const leftBtn = document.querySelector(".carousel_button.left");
const rightBtn = document.querySelector(".carousel_button.right");
const downBtn = document.querySelector(".carousel_button.down");

// Beispielhafte Logik – du kannst sie anpassen
leftBtn?.addEventListener("click", () => {
  alert("Leider haben wir keine vorherigen Bewertungen verfügbar.");
});

rightBtn?.addEventListener("click", () => {
  alert("Leider haben wir keine weiteren Bewertungen verfügbar.");
});

downBtn?.addEventListener("click", () => {
  alert("Leider haben wir keine weiteren Bewertungen verfügbar.");
});
