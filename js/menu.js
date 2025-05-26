document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".menu_toggle");
  const navLinks = document.querySelector(".nav_link");
  const closeBtn = document.querySelector(".menu_close");

  toggleBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  closeBtn.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});
