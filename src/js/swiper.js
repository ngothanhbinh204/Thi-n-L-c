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
} from "swiper/modules";

/**
 * @param swiperInit
 */
export function swiperInit() {
  initHistorySwiper();
  $(".swiper-column-auto").each(function (index) {
    const $this = $(this);
    // Configuration flagsvideoSetting
    const config = {
      loop: $this.hasClass("swiper-loop"),
      touchMove: $this.hasClass("allow-touchMove") || true,
      mouseWheel: $this.hasClass("allow-mouseWheel")
        ? { forceToAxis: true }
        : false,
      autoHeight: $this.hasClass("auto-height"),
      hasVideo: $this.hasClass("auto-detect-video"),
      progressbar: $this.hasClass("progressbar"),
      time: $this.attr("data-time") || 3500,
      autoplay: $this.hasClass("autoplay"),
    };

    // Add unique identifier class
    $this.addClass(`swiper-column-auto-id-${index}`);

    // Create swiper with optimized options
    new Swiper(`.swiper-column-auto-id-${index} .swiper`, {
      modules: [Navigation, Pagination, Mousewheel],
      speed: 500,
      observer: true,
      observeParents: true,
      spaceBetween: 0,
      loop: config.loop,
      ...(config.autoplay && {
        autoplay: {
          delay: config.time,
        },
      }),
      slidesPerView: "auto",
      pagination: {
        el: `.swiper-column-auto-id-${index} .swiper-pagination`,
        clickable: true,
        ...(config.progressbar && {
          type: "progressbar",
        }),
      },
      mousewheel: config.mouseWheel,
      allowTouchMove: config.touchMove,
      navigation: {
        prevEl: `.swiper-column-auto-id-${index} .btn-prev`,
        nextEl: `.swiper-column-auto-id-${index} .btn-next`,
      },
      watchSlidesProgress: true,
      autoHeight: config.autoHeight,
      on: {
        init: function () {},
        slideChange: function () {},
      },
    });
  });
  new Swiper(".section-home-banner .swiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 1000,
    loop: true,
    effect: "fade",
    autoplay: {
      delay: 3500,
    },
    modules: [Pagination, Navigation, Autoplay, EffectFade],
    pagination: {
      el: ".section-home-banner .swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        const slide = this.slides[index];
        const title = slide.getAttribute("data-title") || `Slide ${index + 1}`;
        return `<span class="${className}">${title}</span>`;
      },
    },
    navigation: {
      nextEl: ".section-home-banner .btn-next",
      prevEl: ".section-home-banner .btn-prev",
    },
  });

  // Page Banner Swiper
  new Swiper(".page-banner .banner-swiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 300,
    loop: true,
    effect: "fade",
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    modules: [Pagination, Navigation, Autoplay, EffectFade],
    pagination: {
      el: ".page-banner .banner-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".page-banner .banner-next",
      prevEl: ".page-banner .banner-prev",
    },
  });

  // Customer Slider (Home-3)
  new Swiper(".home-3 .customer-slider", {
    slidesPerView: 2,
    spaceBetween: 16,
    speed: 500,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    modules: [Pagination, Autoplay, EffectFade],
    navigation: {
      nextEl: ".home-3 .btn-next",
      prevEl: ".home-3 .btn-prev",
    },
    pagination: {
      el: ".home-3 .home-3-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 30,
      },
    },
  });

  // Services Detail Slider
  if ($(".swiper-services-detail .swiper").length > 0) {
    new Swiper(".swiper-services-detail .swiper", {
      modules: [Navigation, Autoplay],
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 8,
      loop: true,
      speed: 600,
      navigation: {
        nextEl: ".swiper-services-detail .swiper-button-deGallery-next",
        prevEl: ".swiper-services-detail .swiper-button-deGallery-prev",
      },
      breakpoints: {
        320: {
          slidesPerView: 1.2,
          spaceBetween: 8,
        },
        640: {
          slidesPerView: 1.3,
          spaceBetween: 8,
        },
        768: {
          slidesPerView: 1.4,
          spaceBetween: 8,
        },
        1024: {
          slidesPerView: 1.5,
          spaceBetween: 8,
        },
        1280: {
          slidesPerView: 1.6,
          spaceBetween: 8,
        },
        1536: {
          slidesPerView: 1.8,
          spaceBetween: 8,
        },
      },
      on: {
        init: function () {
          updateSlideOpacity(this);
        },
        slideChange: function () {
          updateSlideOpacity(this);
        },
        transitionEnd: function () {
          updateSlideOpacity(this);
        },
      },
    });

    function updateSlideOpacity(swiper) {
      swiper.slides.forEach((slide) => {
        if (slide.classList.contains("swiper-slide-active")) {
          slide.style.zIndex = "2";
        } else {
          slide.style.zIndex = "1";
        }
      });
    }
  }

  // Services Other Slider
  if ($(".swiper-services-other .swiper").length > 0) {
    new Swiper(".swiper-services-other .swiper", {
      modules: [Navigation, Autoplay, Mousewheel],
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      speed: 800,
      mousewheel: {
        forceToAxis: true,
      },
      navigation: {
        nextEl: ".swiper-services-other .swiper-button-other-next",
        prevEl: ".swiper-services-other .swiper-button-other-prev",
      },
      breakpoints: {
        576: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      },
    });
  }
}

function initHistorySwiper() {
  if (
    $(".history-timeline .swiper").length > 0 &&
    $(".history-main .swiper").length > 0
  ) {
    // 1. Timeline Swiper
    const historyTimeline = new Swiper(".history-timeline .swiper", {
      modules: [Navigation, Controller],
      slidesPerView: 3,
      spaceBetween: 20,
      centeredSlides: true,
      centeredSlidesBounds: true,
      slideToClickedSlide: true,
      watchSlidesProgress: true,
      loop: false,
      breakpoints: {
        768: {
          slidesPerView: 5,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 7,
          spaceBetween: 0,
        },
      },
      on: {
        click: function (swiper) {
          historyMain.slideTo(swiper.clickedIndex);
        },
      },
    });

    // 2. Main Content Swiper
    const historyMain = new Swiper(".history-main .swiper", {
      modules: [Navigation, Controller],
      slidesPerView: 1,
      spaceBetween: 30,
      speed: 800,
      centeredSlides: true,
      centeredSlidesBounds: false,
      watchSlidesProgress: true,
      // Navigation removed from config to handle manually
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      },
      on: {
        setTranslate: function (swiper) {
          // Manual bounds for Desktop to fix active index issue
          if (window.innerWidth >= 1024) {
            const totalWidth = swiper.virtualSize;
            const containerWidth = swiper.width;
            const maxTranslate = -(totalWidth - containerWidth);

            let visualTranslate = swiper.translate;

            // Clamp start (left)
            if (visualTranslate > 0) visualTranslate = 0;
            // Clamp end (right)
            if (visualTranslate < maxTranslate) visualTranslate = maxTranslate;

            // Apply to DOM only, keep swiper.translate logical
            swiper.wrapperEl.style.transform = `translate3d(${visualTranslate}px, 0, 0)`;
          }
        },
        slideChange: function (swiper) {
          // Sync timeline active state
          const activeIndex = swiper.activeIndex;
          historyTimeline.slideTo(activeIndex);

          // Manually update active class on timeline dots
          $(".history-timeline .swiper-slide").removeClass(
            "swiper-slide-thumb-active"
          );
          $(historyTimeline.slides[activeIndex]).addClass(
            "swiper-slide-thumb-active"
          );
        },
        init: function (swiper) {
          $(historyTimeline.slides[swiper.activeIndex]).addClass(
            "swiper-slide-thumb-active"
          );
        },
      },
    });

    // 3. Custom Navigation Logic (Manual)
    $(".history-nav .btn-next")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        if (historyMain.activeIndex === historyMain.slides.length - 1) {
          historyMain.slideTo(0);
        } else {
          historyMain.slideNext();
        }
      });

    $(".history-nav .btn-prev")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        if (historyMain.activeIndex === 0) {
          historyMain.slideTo(historyMain.slides.length - 1);
        } else {
          historyMain.slidePrev();
        }
      });
  }

  // Machine Slider
  if ($(".machine-slider .swiper").length > 0) {
    new Swiper(".machine-slider .swiper", {
      modules: [Navigation, Autoplay, EffectFade],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      navigation: {
        nextEl: ".machine-nav .btn-next",
        prevEl: ".machine-nav .btn-prev",
      },
    });
  }
}
