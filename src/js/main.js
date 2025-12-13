import AOS from "aos";
import lozad from "lozad";
import {
  setBackgroundElement,
  buttonToTop,
  menuSpy,
  stickElementToEdge,
  initAccordion,
} from "./helper";
import { header } from "./header";
import { swiperInit } from "./swiper";
$(document).ready(function () {
  setBackgroundElement();
  stickElementToEdge();
  menuSpy();
  buttonToTop();
  initAccordion();
  header.init();
  swiperInit();
});

/*==================== Aos Init ====================*/
AOS.init({
  offset: 100,
});
/*==================== Lazyload JS ====================*/
const observer = lozad(); // lazy loads elements with default selector as '.lozad'
observer.observe();

window.FE = {
  lozad: observer.observe,
};
