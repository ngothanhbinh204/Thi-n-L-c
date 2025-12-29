export const header = {
  init: () => {
    const headerEl = document.querySelector(".header");
    if (!headerEl) return;

    const desktopMenuItems = document.querySelectorAll(
      ".header .header-wrapper .menu li.has-sub"
    );

    let lastScrollY = window.scrollY;

    let closeTimeout = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      headerEl.classList.toggle("active", currentScrollY > 0);

      if (window.innerWidth >= 1024) {
        desktopMenuItems.forEach((item) =>
          item.classList.remove("open-submenu")
        );
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    if (desktopMenuItems.length) {
      desktopMenuItems.forEach((menuItem) => {
        menuItem.addEventListener("mouseenter", () => {
          if (window.innerWidth < 1024) return;

          if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
          }

          desktopMenuItems.forEach((item) => {
            if (item !== menuItem) {
              item.classList.remove("open-submenu");
            }
          });

          menuItem.classList.add("open-submenu");
        });

        menuItem.addEventListener("mouseleave", (e) => {
          if (window.innerWidth < 1024) return;

          const relatedTarget = e.relatedTarget;

          if (relatedTarget && menuItem.contains(relatedTarget)) return;

          const isMovingToAnotherMenu = relatedTarget?.closest?.(
            ".header .header-wrapper .menu li.has-sub"
          );

          if (isMovingToAnotherMenu) return;

          closeTimeout = setTimeout(() => {
            menuItem.classList.remove("open-submenu");
            closeTimeout = null;
          }, 200);
        });
      });
    }

    document.addEventListener("click", (e) => {
      if (window.innerWidth < 1024) return;

      if (!e.target.closest(".header .menu")) {
        if (closeTimeout) {
          clearTimeout(closeTimeout);
          closeTimeout = null;
        }

        desktopMenuItems.forEach((item) =>
          item.classList.remove("open-submenu")
        );
      }
    });

    const hamburger = document.querySelector(".header-hambuger");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", () => {
        const isActive = mobileMenu.classList.toggle("active");
        hamburger.classList.toggle("active", isActive);
        document.body.classList.toggle("overflow-hidden", isActive);
      });
    }

    const mobileSubTriggers = document.querySelectorAll(
      ".mobile-menu .has-sub > div > i, .mobile-menu .has-sub-2 > div > i"
    );

    mobileSubTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();

        const parentLi = trigger.closest("li");
        const submenu = parentLi.querySelector(".submenu, .submenu-2");
        if (!submenu) return;

        const siblings = [...parentLi.parentElement.children];

        siblings.forEach((sibling) => {
          if (sibling !== parentLi && sibling.classList.contains("active")) {
            sibling.classList.remove("active");
            const siblingSub = sibling.querySelector(".submenu, .submenu-2");
            if (siblingSub) slideUp(siblingSub);
          }
        });

        parentLi.classList.toggle("active");
        parentLi.classList.contains("active")
          ? slideDown(submenu)
          : slideUp(submenu);
      });
    });

    const langTrigger = document.querySelector(".header .tools .language");

    if (langTrigger) {
      langTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        langTrigger.classList.toggle("active");
      });

      document.addEventListener("click", (e) => {
        if (!langTrigger.contains(e.target)) {
          langTrigger.classList.remove("active");
        }
      });
    }

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

      searchClose?.addEventListener("click", () => {
        searchOverlay.classList.remove("active");
        document.body.classList.remove("overflow-hidden");
      });

      searchOverlay.addEventListener("click", (e) => {
        if (e.target === searchOverlay) {
          searchOverlay.classList.remove("active");
          document.body.classList.remove("overflow-hidden");
        }
      });

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
  target.offsetHeight;
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
  target.offsetHeight;
  target.style.boxSizing = "border-box";
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
