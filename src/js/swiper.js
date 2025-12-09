import Swiper from "swiper";
import { Autoplay, EffectFade, Grid, Mousewheel, Navigation, Pagination } from "swiper/modules";

/**
 * @param swiperInit
 */
export function swiperInit () {
	$(".swiper-column-auto").each(function (index) {
		const $this = $(this);
		// Configuration flagsvideoSetting
		const config = {
			loop: $this.hasClass("swiper-loop"),
			touchMove: $this.hasClass("allow-touchMove") || true,
			mouseWheel: $this.hasClass("allow-mouseWheel") ? { forceToAxis: true } : false,
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
					type: 'progressbar',
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
				init: function () {
				},
				slideChange: function () {
				},
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
}
