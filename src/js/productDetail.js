import Swiper from "swiper";
import {
  Autoplay,
  EffectFade,
  Grid,
  Mousewheel,
  Navigation,
  Pagination,
  Thumbs,
  Controller,
  FreeMode,
} from "swiper/modules";

export default function productDetail() {
  "use strict";

  // ============ PRODUCT GALLERY SWIPER ============
  if (
    $(".swiper-product-gallery").length > 0 &&
    $(".thumbs-slider").length > 0
  ) {
    // Thumbs Swiper
    const thumbsSwiper = new Swiper(".thumbs-slider", {
      modules: [FreeMode, Navigation, Thumbs],
      spaceBetween: 8,
      breakpoints: {
        0: {
          direction: "horizontal",
          slidesPerView: 5,
        },
        768: {
          direction: "vertical",
          slidesPerView: 4,
        },
      },
      freeMode: true,
      watchSlidesProgress: true,
    });

    // Main Gallery Swiper
    const mainGallery = new Swiper(".swiper-product-gallery", {
      modules: [Navigation, Thumbs, EffectFade],
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 600,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      thumbs: {
        swiper: thumbsSwiper,
      },
      navigation: {
        nextEl: ".thumb-next",
        prevEl: ".thumb-prev",
      },
    });
  }

  // ============ ✅ COMPLETELY FIXED TAB CONTENT MANAGER ============
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
     * ✅ Kiểm tra xem nội dung có cần nút "Xem thêm" không
     */
    checkVisibility() {
      if (!this.contentWrapper) return;

      // ✅ FIX: Lưu trạng thái hiện tại
      const currentState = this.isExpanded;

      // Tạm thời expand để đo chiều cao - xóa cả hai class
      this.contentWrapper.style.maxHeight = "none";
      this.contentWrapper.classList.remove("collapsed", "expanded");

      // Force reflow
      void this.contentWrapper.offsetHeight;

      // Đo chiều cao thực
      const actualHeight = this.contentWrapper.scrollHeight;

      if (actualHeight > this.collapsedHeight) {
        // Content dài → hiện nút "Xem thêm"
        this.showViewMoreButton();

        // ✅ FIX: Khôi phục lại state ban đầu
        if (!currentState) {
          // Nếu đang collapsed → set lại collapsed
          this.setCollapsedState(false); // false = no animation
        } else {
          // Nếu đang expanded → giữ nguyên expanded
          this.setExpandedState(false); // false = no animation
        }
      } else {
        // Content ngắn → ẩn nút và để expanded
        this.hideViewMoreButton();
        this.setExpandedState(false); // false = no animation
        this.isExpanded = true;
      }
    }

    /**
     * ✅ Toggle giữa expand và collapse
     */
    toggle() {
      if (this.isAnimating) {
        return;
      }

      if (this.isExpanded) {
        this.collapse();
      } else {
        this.expand();
      }
    }

    /**
     * ✅ FIXED: Expand content với animation mượt
     */
    expand() {
      if (this.isExpanded || this.isAnimating) return;

      this.isAnimating = true;

      // Bước 1: Set height hiện tại
      const currentHeight = this.contentWrapper.offsetHeight;
      this.contentWrapper.style.maxHeight = currentHeight + "px";

      this.contentWrapper.classList.remove("collapsed");
      this.contentWrapper.classList.add("expanded");

      // Bước 3: Tính toán target height
      requestAnimationFrame(() => {
        const targetHeight = this.contentWrapper.scrollHeight;

        // Bước 4: Animate đến target height
        this.contentWrapper.style.maxHeight = targetHeight + "px";

        // Bước 5: Sau khi transition xong, set về none
        setTimeout(() => {
          if (this.isExpanded) {
            // Double check state hasn't changed
            this.contentWrapper.style.maxHeight = "none";
          }
          this.isAnimating = false;
        }, 500); // Match với transition duration
      });

      this.isExpanded = true;
      this.updateButton(true); // true = expanded
    }

    /**
     * ✅ FIXED: Collapse content với scroll smooth
     */
    collapse() {
      if (!this.isExpanded || this.isAnimating) return;

      this.isAnimating = true;

      // Bước 1: Set exact height trước
      const currentHeight = this.contentWrapper.scrollHeight;
      this.contentWrapper.style.maxHeight = currentHeight + "px";

      // Force reflow
      void this.contentWrapper.offsetHeight;

      // Bước 2: Animate về collapsed height
      requestAnimationFrame(() => {
        this.contentWrapper.style.maxHeight = this.collapsedHeight + "px";

        this.contentWrapper.classList.remove("expanded");
        this.contentWrapper.classList.add("collapsed");
        // Bước 3: Sau khi animation xong
        setTimeout(() => {
          this.isAnimating = false;
        }, 500);
      });

      this.isExpanded = false;
      this.updateButton(false); // false = collapsed

      // Scroll to top
      this.scrollToContent();
    }

    /**
     * ✅ Set collapsed state không animation (dùng cho init)
     */
    setCollapsedState(animate = false) {
      this.contentWrapper.style.maxHeight = this.collapsedHeight + "px";
      this.contentWrapper.classList.remove("expanded");
      this.contentWrapper.classList.add("collapsed");
      this.isExpanded = false;
      this.updateButton(false);
    }

    /**
     * ✅ Set expanded state không animation (dùng cho init)
     */
    setExpandedState(animate = false) {
      this.contentWrapper.style.maxHeight = "none";
      this.contentWrapper.classList.remove("collapsed");
      this.contentWrapper.classList.add("expanded");
      this.isExpanded = true;
      this.updateButton(true);
    }

    /**
     * ✅ Update button UI
     */
    updateButton(isExpanded) {
      const span = this.viewMoreBtn.querySelector("span");
      const icon = this.viewMoreBtn.querySelector("i");

      if (isExpanded) {
        if (span) span.textContent = "Thu gọn";
        if (icon) icon.style.transform = "rotate(180deg)";
        this.viewMoreBtn.setAttribute("aria-expanded", "true");
        this.viewMoreBtn.setAttribute("aria-label", "Thu gọn nội dung");
      } else {
        if (span) span.textContent = "Xem thêm";
        if (icon) icon.style.transform = "rotate(0deg)";
        this.viewMoreBtn.setAttribute("aria-expanded", "false");
        this.viewMoreBtn.setAttribute("aria-label", "Xem thêm nội dung");
      }
    }

    /**
     * ✅ Scroll smooth đến đầu content
     */
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

    /**
     * ✅ Hiện nút "Xem thêm"
     */
    showViewMoreButton() {
      this.viewMoreContainer.classList.remove("hiddend");
      this.viewMoreContainer.classList.add("show");
    }

    /**
     * ✅ Ẩn nút "Xem thêm"
     */
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

        // Remove active from all buttons
        tabButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active to clicked button
        this.classList.add("active");

        // Hide all tab panes
        tabPanes.forEach((pane) => {
          pane.classList.remove("active");
        });

        // Show target tab pane
        const targetPane = document.getElementById(targetTab);
        if (targetPane) {
          targetPane.classList.add("active");

          // Re-check visibility khi switch tab
          const manager = tabManagers.get(targetTab);
          if (manager) {
            setTimeout(() => {
              manager.checkVisibility();
            }, 50);
          }
        }
      });
    });

    // Keyboard navigation for tabs
    tabButtons.forEach((button, index) => {
      button.addEventListener("keydown", function (e) {
        let newIndex;

        if (e.key === "ArrowRight") {
          e.preventDefault();
          newIndex = (index + 1) % tabButtons.length;
          tabButtons[newIndex].click();
          tabButtons[newIndex].focus();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
          tabButtons[newIndex].click();
          tabButtons[newIndex].focus();
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

  // ============ RELATED PRODUCTS SLIDER ============
  if ($(".swiper-related-products").length > 0) {
    new Swiper(".swiper-related-products", {
      modules: [Navigation, Autoplay],
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      speed: 600,
      navigation: {
        nextEl: ".wrapper-related-products .btn-relative-next",
        prevEl: ".wrapper-related-products .btn-relative-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
        1280: {
          slidesPerView: 4,
        },
      },
    });
  }
}
