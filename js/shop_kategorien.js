document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".kategorien_toggle");
  const sideNav = document.querySelector(".side_nav");
  const closeBtn = document.querySelector(".kategorien_close");

  // Kategorien-Toggle anzeigen, wenn gescrollt wurde
  window.addEventListener("scroll", () => {
    if (window.scrollY > 250 && !sideNav.classList.contains("open")) {
      toggleBtn.classList.add("visible");
    } else {
      toggleBtn.classList.remove("visible");
    }
  });

  // Sidebar öffnen
  toggleBtn?.addEventListener("click", () => {
    sideNav?.classList.add("open");
    toggleBtn.classList.remove("visible"); // Toggle verschwinden lassen
  });

  // Sidebar schliessen
  closeBtn?.addEventListener("click", () => {
    sideNav?.classList.remove("open");
    if (window.scrollY > 300) toggleBtn.classList.add("visible");
  });
});
