import Swiper from "swiper";
import { Navigation, Autoplay } from "swiper/modules";

export default function customersDetail() {
  "use strict";

  const wrapper = document.querySelector(".wrapper-content-tab");
  const btnViewMore = document.querySelector(".btn-view-more");

  if (!wrapper || !btnViewMore) return;

  const COLLAPSED_HEIGHT = "80vh"; // phải trùng với CSS

  // Set initial max-height (phòng khi reload)
  if (wrapper.classList.contains("collapsed")) {
    wrapper.style.maxHeight = COLLAPSED_HEIGHT;
  }

  btnViewMore.addEventListener("click", function () {
    const span = this.querySelector("span");
    const isCollapsed = wrapper.classList.contains("collapsed");

    if (isCollapsed) {
      wrapper.classList.remove("collapsed");
      wrapper.style.maxHeight = wrapper.scrollHeight + "px";

      this.classList.add("active");
      if (span) span.textContent = "Thu gọn";
    } else {
      wrapper.style.maxHeight = COLLAPSED_HEIGHT;
      wrapper.classList.add("collapsed");
      this.classList.remove("active");
      if (span) span.textContent = "Xem thêm";
      wrapper.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });

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
}
