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

  // ============ PRODUCT TABS ============
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  if (tabButtons.length > 0 && tabPanes.length > 0) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const targetTab = this.dataset.tab;

        // Remove active from all buttons
        tabButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active to clicked button
        this.classList.add("active");

        // Hide all tab panes with fade out
        tabPanes.forEach((pane) => {
          pane.classList.remove("active");
        });

        // Show target tab pane with fade in
        setTimeout(() => {
          const targetPane = document.getElementById(targetTab);
          if (targetPane) {
            targetPane.classList.add("active");
          }
        }, 100);
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

  // ============ RELATED PRODUCTS SLIDER ============
  if ($(".swiper-related-products").length > 0) {
    new Swiper(".swiper-related-products", {
      modules: [Navigation, Autoplay],
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      speed: 600,
      //   autoplay: {
      //     delay: 4000,
      //     disableOnInteraction: false,
      //   },
      navigation: {
        nextEl: ".wrapper-related-products .btn-relative-next",
        prevEl: ".wrapper-related-products .btn-relative-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          //   spaceBetween: 12,
        },
        768: {
          slidesPerView: 3,
          //   spaceBetween: 16,
        },
        1024: {
          slidesPerView: 4,
          //   spaceBetween: 16,
        },
        1280: {
          slidesPerView: 4,
          //   spaceBetween: 24,
        },
      },
    });
  }
}
