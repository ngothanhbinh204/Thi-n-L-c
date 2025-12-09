export const header = {
  init: () => {
    const headerEl = document.querySelector(".header");
    if (!headerEl) return;

    // Sticky Header
    const handleScroll = () => {
      if (window.scrollY > 0) {
        headerEl.classList.add("active");
      } else {
        headerEl.classList.remove("active");
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on load

    // Mobile Menu
    const hamburger = document.querySelector(".header-hambuger");
    const menu = document.querySelector(".header .menu");

    if (hamburger && menu) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        menu.classList.toggle("hidden");
        menu.classList.toggle("active");
        document.body.classList.toggle("overflow-hidden");
      });
    }
  },
};
