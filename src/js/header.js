export const header = {
  init: () => {
    const headerEl = document.querySelector(".header");
    if (!headerEl) return;
    const desktopMenuItems = document.querySelectorAll(
      ".header .header-wrapper .menu li.has-sub"
    );
    let lastScrollY = window.scrollY;

    // Sticky Header
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Sticky header
      if (currentScrollY > 0) {
        headerEl.classList.add("active");
      } else {
        headerEl.classList.remove("active");
      }

      // 👉 Scroll UP → close desktop submenu
      if (currentScrollY > lastScrollY && window.innerWidth >= 1024) {
        desktopMenuItems.forEach((item) =>
          item.classList.remove("open-submenu")
        );
      }

      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    // Mobile Menu Toggle
    const hamburger = document.querySelector(".header-hambuger");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", () => {
        if (mobileMenu.classList.contains("active")) {
          // Close
          hamburger.classList.remove("active");
          mobileMenu.classList.remove("active");
          document.body.classList.remove("overflow-hidden");
        } else {
          // Open
          hamburger.classList.add("active");
          mobileMenu.classList.add("active");
          document.body.classList.add("overflow-hidden");
        }
      });
    }

    // Close all submenus when mouse leaves the header
    headerEl.addEventListener("mouseleave", (e) => {
      if (window.innerWidth >= 1024) {
        // Check if the mouse moved to an element that is still inside the header
        if (e.relatedTarget && headerEl.contains(e.relatedTarget)) {
          return;
        }
        desktopMenuItems.forEach((item) =>
          item.classList.remove("open-submenu")
        );
      }
    });

    desktopMenuItems.forEach((item) => {
      const link = item.querySelector("a");

      // Hover Event
      item.addEventListener("mouseenter", () => {
        if (window.innerWidth >= 1024) {
          // Close others
          desktopMenuItems.forEach((other) => {
            if (other !== item) other.classList.remove("open-submenu");
          });
          item.classList.add("open-submenu");
        }
      });
    });

    // Mobile Submenu Logic (Accordion)
    const mobileSubTriggers = document.querySelectorAll(
      ".mobile-menu .has-sub > div > i, .mobile-menu .has-sub-2 > div > i"
    );

    mobileSubTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const parentLi = trigger.closest("li");
        const submenu = parentLi.querySelector(".submenu, .submenu-2");

        if (submenu) {
          parentLi.classList.toggle("active");
          slideToggle(submenu);
        }
      });
    });

    // Click Outside (Desktop)
    document.addEventListener("click", (e) => {
      if (window.innerWidth < 1024) return;
      if (!e.target.closest(".header .menu")) {
        desktopMenuItems.forEach((item) =>
          item.classList.remove("open-submenu")
        );
      }
    });

    // Language Dropdown
    const langTrigger = document.querySelector(".header .tools .language");

    if (langTrigger) {
      langTrigger.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent immediate closing
        langTrigger.classList.toggle("active");
      });

      document.addEventListener("click", (e) => {
        if (!langTrigger.contains(e.target)) {
          langTrigger.classList.remove("active");
        }
      });
    }

    // Search Toggle
    const searchTrigger = document.querySelector(".header .tools .search");
    const searchOverlay = document.querySelector(".header-search-form");
    const searchClose = document.querySelector(
      ".header-search-form .close-search"
    );

    if (searchTrigger && searchOverlay) {
      searchTrigger.addEventListener("click", () => {
        searchOverlay.classList.add("active");
        document.body.classList.add("overflow-hidden");
      });

      if (searchClose) {
        searchClose.addEventListener("click", () => {
          searchOverlay.classList.remove("active");
          document.body.classList.remove("overflow-hidden");
        });
      }

      // Close when clicking outside the form
      searchOverlay.addEventListener("click", (e) => {
        if (e.target === searchOverlay) {
          searchOverlay.classList.remove("active");
          document.body.classList.remove("overflow-hidden");
        }
      });

      // Close on Escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
          searchOverlay.classList.remove("active");
          document.body.classList.remove("overflow-hidden");
        }
      });
    }
  },
};

// Helper for smooth slide animation
const slideToggle = (target, duration = 300) => {
  if (window.getComputedStyle(target).display === "none") {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
};

const slideUp = (target, duration = 300) => {
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.boxSizing = "border-box";
  target.style.height = target.offsetHeight + "px";
  target.offsetHeight; // force repaint
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout(() => {
    target.style.display = "none";
    target.style.removeProperty("height");
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
  }, duration);
};

const slideDown = (target, duration = 300) => {
  target.style.removeProperty("display");
  let display = window.getComputedStyle(target).display;
  if (display === "none") display = "block";
  target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight; // force repaint
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.height = height + "px";
  target.style.removeProperty("padding-top");
  target.style.removeProperty("padding-bottom");
  target.style.removeProperty("margin-top");
  target.style.removeProperty("margin-bottom");
  window.setTimeout(() => {
    target.style.removeProperty("height");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
  }, duration);
};
