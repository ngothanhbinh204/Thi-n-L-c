import Swiper from "swiper";
import { Navigation, Autoplay } from "swiper/modules";

export default function customersDetail() {
  "use strict";

  // Related Customers Slider
  const relatedSwiper = new Swiper(".swiper-related-customers", {
    modules: [Navigation, Autoplay],
    slidesPerView: 1,
    spaceBetween: 16,
    loop: true,
    speed: 800,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".section-related-customers .btn-next",
      prevEl: ".section-related-customers .btn-prev",
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 16,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
  });

  // ============ TAB CONTENT MANAGER ============
  class TabContentManager {
    constructor(tabPane) {
      this.tabPane = tabPane;
      this.contentWrapper = tabPane.querySelector(".wrapper-content-tab");
      this.viewMoreBtn = tabPane.querySelector(".btn-view-more");
      this.viewMoreContainer = tabPane.querySelector(".view-more-container");
      this.isInitialized = false;
      this.isExpanded = false;
      this.isAnimating = false;

      if (
        !this.contentWrapper ||
        !this.viewMoreBtn ||
        !this.viewMoreContainer
      ) {
        return;
      }

      // Lấy collapsed height từ data attribute (default 500px)
      this.collapsedHeight = parseInt(
        this.contentWrapper.dataset.collapsedHeight || "500",
        10
      );

      this.init();
    }

    init() {
      // Bind event listener
      this.viewMoreBtn.addEventListener("click", () => this.toggle());

      // Check initial visibility
      this.checkVisibility();
      this.isInitialized = true;
    }

    /**
     * Kiểm tra xem nội dung có cần nút "Xem thêm" không
     */
    checkVisibility() {
      if (!this.contentWrapper) return;

      const currentState = this.isExpanded;

      // Tạm thời expand để đo chiều cao
      this.contentWrapper.style.maxHeight = "none";
      this.contentWrapper.classList.remove("collapsed", "expanded");

      // Force reflow
      void this.contentWrapper.offsetHeight;

      // Đo chiều cao thực
      const actualHeight = this.contentWrapper.scrollHeight;

      if (actualHeight > this.collapsedHeight) {
        // Content dài → hiện nút "Xem thêm"
        this.showViewMoreButton();

        if (!currentState) {
          this.setCollapsedState(false);
        } else {
          this.setExpandedState(false);
        }
      } else {
        // Content ngắn → ẩn nút và để expanded
        this.hideViewMoreButton();
        this.setExpandedState(false);
        this.isExpanded = true;
      }
    }

    /**
     * Toggle giữa expand và collapse
     */
    toggle() {
      if (this.isAnimating) return;

      if (this.isExpanded) {
        this.collapse();
      } else {
        this.expand();
      }
    }

    /**
     * Expand content với animation mượt
     */
    expand() {
      if (this.isExpanded || this.isAnimating) return;

      this.isAnimating = true;

      const currentHeight = this.contentWrapper.offsetHeight;
      this.contentWrapper.style.maxHeight = currentHeight + "px";

      this.contentWrapper.classList.remove("collapsed");
      this.contentWrapper.classList.add("expanded");

      requestAnimationFrame(() => {
        const targetHeight = this.contentWrapper.scrollHeight;
        this.contentWrapper.style.maxHeight = targetHeight + "px";

        setTimeout(() => {
          if (this.isExpanded) {
            this.contentWrapper.style.maxHeight = "none";
          }
          this.isAnimating = false;
        }, 500);
      });

      this.isExpanded = true;
      this.updateButton(true);
    }

    /**
     * Collapse content với scroll smooth
     */
    collapse() {
      if (!this.isExpanded || this.isAnimating) return;

      this.isAnimating = true;

      const currentHeight = this.contentWrapper.scrollHeight;
      this.contentWrapper.style.maxHeight = currentHeight + "px";

      void this.contentWrapper.offsetHeight;

      requestAnimationFrame(() => {
        this.contentWrapper.style.maxHeight = this.collapsedHeight + "px";

        this.contentWrapper.classList.remove("expanded");
        this.contentWrapper.classList.add("collapsed");
        setTimeout(() => {
          this.isAnimating = false;
        }, 500);
      });

      this.isExpanded = false;
      this.updateButton(false);

      this.scrollToContent();
    }

    setCollapsedState(animate = false) {
      this.contentWrapper.style.maxHeight = this.collapsedHeight + "px";
      this.contentWrapper.classList.remove("expanded");
      this.contentWrapper.classList.add("collapsed");
      this.isExpanded = false;
      this.updateButton(false);
    }

    setExpandedState(animate = false) {
      this.contentWrapper.style.maxHeight = "none";
      this.contentWrapper.classList.remove("collapsed");
      this.contentWrapper.classList.add("expanded");
      this.isExpanded = true;
      this.updateButton(true);
    }

    updateButton(isExpanded) {
      const span = this.viewMoreBtn.querySelector("span");
      const icon = this.viewMoreBtn.querySelector("i");

      if (isExpanded) {
        if (span) span.textContent = "Thu gọn";
        if (icon) icon.style.transform = "rotate(180deg)";
        this.viewMoreBtn.setAttribute("aria-expanded", "true");
      } else {
        if (span) span.textContent = "Xem thêm";
        if (icon) icon.style.transform = "rotate(0deg)";
        this.viewMoreBtn.setAttribute("aria-expanded", "false");
      }
    }

    scrollToContent() {
      const offsetTop =
        this.contentWrapper.getBoundingClientRect().top +
        window.pageYOffset -
        100;

      $("html, body").animate(
        {
          scrollTop: offsetTop,
        },
        400,
        "swing"
      );
    }

    showViewMoreButton() {
      this.viewMoreContainer.classList.remove("hiddend");
      this.viewMoreContainer.classList.add("show");
    }

    hideViewMoreButton() {
      this.viewMoreContainer.classList.add("hiddend");
      this.viewMoreContainer.classList.remove("show");
    }
  }

  // ============ INITIALIZE TAB MANAGERS ============
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const tabManagers = new Map();

  tabPanes.forEach((tabPane) => {
    const manager = new TabContentManager(tabPane);
    if (manager.isInitialized) {
      tabManagers.set(tabPane.id, manager);
    }
  });

  // ============ TAB SWITCHING LOGIC ============
  if (tabButtons.length > 0 && tabPanes.length > 0) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const targetTab = this.dataset.tab;

        tabButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        tabPanes.forEach((pane) => {
          pane.classList.remove("active");
        });

        const targetPane = document.getElementById(targetTab);
        if (targetPane) {
          targetPane.classList.add("active");

          const manager = tabManagers.get(targetTab);
          if (manager) {
            setTimeout(() => {
              manager.checkVisibility();
            }, 50);
          }
        }
      });
    });
  }

  // ============ WINDOW RESIZE HANDLER ============
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const activeTab = document.querySelector(".tab-pane.active");
      if (activeTab) {
        const manager = tabManagers.get(activeTab.id);
        if (manager) {
          manager.checkVisibility();
        }
      }
    }, 250);
  });

  // ============ FONT LOADING HANDLER ============
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      tabManagers.forEach((manager) => {
        manager.checkVisibility();
      });
    });
  }
}
