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
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false,
    // },
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
}

function initHistorySwiper() {
  if (
    $(".history-timeline .swiper").length > 0 &&
    $(".history-main .swiper").length > 0
  ) {
    const historyTimeline = new Swiper(".history-timeline .swiper", {
      modules: [Navigation, Controller],
      slidesPerView: 3,
      spaceBetween: 20,
      centeredSlides: true,
      slideToClickedSlide: true,
      loop: false,
      breakpoints: {
        768: {
          slidesPerView: 5,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 7,
          spaceBetween: 60,
        },
      },
    });

    const historyMain = new Swiper(".history-main .swiper", {
      modules: [Navigation, Thumbs, Controller],
      slidesPerView: 1,
      spaceBetween: 30,
      centeredSlides: true,
      loop: false,
      navigation: {
        nextEl: ".history-nav .btn-next",
        prevEl: ".history-nav .btn-prev",
      },
      thumbs: {
        swiper: historyTimeline,
      },
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
    });
  }

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
      //   autoplay: {
      //     delay: 5000,
      //     disableOnInteraction: false,
      //   },
      navigation: {
        nextEl: ".machine-nav .btn-next",
        prevEl: ".machine-nav .btn-prev",
      },
    });
  }
}
