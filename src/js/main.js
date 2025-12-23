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
import productDetail from "./productDetail";
import customersDetail from "./customersDetail";
$(document).ready(function () {
  setBackgroundElement();
  stickElementToEdge();
  menuSpy();
  buttonToTop();
  initAccordion();
  header.init();
  productDetail();
  customersDetail();
  swiperInit();
});

/*==================== Aos Init ====================*/
AOS.init({
  offset: 50,
  once: true,
});
/*==================== Lazyload JS ====================*/
const observer = lozad(); // lazy loads elements with default selector as '.lozad'
observer.observe();

window.FE = {
  lozad: observer.observe,
};

// Product Sort & AJAX Filter
(function ($) {
  "use strict";

  // Sort functionality
  $("#product-orderby").on("change", function () {
    const orderby = $(this).val();
    const url = new URL(window.location);

    if (orderby) {
      url.searchParams.set("orderby", orderby);
    } else {
      url.searchParams.delete("orderby");
    }

    window.location = url.toString();
  });

  // Category collapse toggle
  $(".category-item .toggle-icon").on("click", function (e) {
    e.preventDefault();
    console.log("Click");

    const $parent = $(this).closest(".category-item");
    const $subMenu = $parent.find(".sub-category");

    if ($subMenu.length) {
      $subMenu.slideToggle(300);
      $(this).html(
        $(this).html() === '<i class="fa-solid fa-plus"></i>'
          ? '<i class="fa-solid fa-minus"></i>'
          : '<i class="fa-solid fa-plus"></i>'
      );
    }
  });

  // Smooth scroll on pagination
  $(".product-pagination a").on("click", function (e) {
    $("html, body").animate(
      {
        scrollTop: $(".product-header").offset().top - 100,
      },
      500
    );
  });
})(jQuery);

/**
 * CustomSelect Class - Reusable for multiple select instances
 * Usage: new CustomSelect(element, options)
 */
class CustomSelect {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      onChange: options.onChange || null,
      onOpen: options.onOpen || null,
      onClose: options.onClose || null,
      closeOnSelect: options.closeOnSelect !== false,
      searchable: options.searchable || false,
      placeholder: options.placeholder || "Select an option",
      ...options,
    };

    this.trigger = this.element.querySelector(".select-trigger");
    this.dropdown = this.element.querySelector(".select-dropdown");
    this.selectOptions = this.element.querySelectorAll(".select-option");
    this.selectedValue = this.element.querySelector(".selected-value");
    this.name = this.element.dataset.name || "";

    this.isOpen = false;
    this.selectedOption = null;
    this.focusedIndex = -1;

    this.init();
  }

  init() {
    this.bindEvents();
    this.setInitialValue();
  }

  bindEvents() {
    // Toggle dropdown on trigger click
    this.trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Select option on click
    this.selectOptions.forEach((option, index) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectOption(option, index);
      });

      // Keyboard navigation on options
      option.setAttribute("tabindex", "0");
      option.addEventListener("keydown", (e) => {
        this.handleOptionKeydown(e, option, index);
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!this.element.contains(e.target) && this.isOpen) {
        this.close();
      }
    });

    // Keyboard navigation on trigger
    this.trigger.addEventListener("keydown", (e) => {
      this.handleTriggerKeydown(e);
    });

    // Prevent scroll when navigating with keyboard
    this.dropdown.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "Space"].includes(e.key)) {
        e.preventDefault();
      }
    });
  }

  setInitialValue() {
    const activeOption = this.element.querySelector(".select-option.active");
    if (activeOption) {
      this.selectedOption = activeOption;
      this.selectedValue.textContent = activeOption.textContent.trim();
    }
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    // Close all other selects first
    CustomSelect.closeAll(this);

    this.element.classList.add("open");
    this.isOpen = true;

    // Set ARIA attributes
    this.trigger.setAttribute("aria-expanded", "true");
    this.dropdown.setAttribute("aria-hidden", "false");

    // Focus first option or selected option
    const activeOption = this.element.querySelector(".select-option.active");
    if (activeOption) {
      this.focusedIndex = Array.from(this.selectOptions).indexOf(activeOption);
      activeOption.focus();
    } else {
      this.focusedIndex = 0;
      this.selectOptions[0]?.focus();
    }

    // Callback
    if (typeof this.options.onOpen === "function") {
      this.options.onOpen(this);
    }

    // Custom event
    this.element.dispatchEvent(
      new CustomEvent("select:open", {
        detail: { select: this },
      })
    );
  }

  close() {
    this.element.classList.remove("open");
    this.isOpen = false;
    this.focusedIndex = -1;

    // Set ARIA attributes
    this.trigger.setAttribute("aria-expanded", "false");
    this.dropdown.setAttribute("aria-hidden", "true");

    // Return focus to trigger
    this.trigger.focus();

    // Callback
    if (typeof this.options.onClose === "function") {
      this.options.onClose(this);
    }

    // Custom event
    this.element.dispatchEvent(
      new CustomEvent("select:close", {
        detail: { select: this },
      })
    );
  }

  selectOption(option, index) {
    const value = option.dataset.value;
    const text = option.textContent.trim();

    // Remove active from all options
    this.selectOptions.forEach((opt) => opt.classList.remove("active"));

    // Add active to selected option
    option.classList.add("active");
    this.selectedOption = option;

    // Update displayed text
    this.selectedValue.textContent = text;

    // Close dropdown if configured
    if (this.options.closeOnSelect) {
      this.close();
    }

    // Callback
    if (typeof this.options.onChange === "function") {
      this.options.onChange(value, text, this);
    }

    // Custom event
    this.element.dispatchEvent(
      new CustomEvent("select:change", {
        detail: {
          value: value,
          text: text,
          name: this.name,
          select: this,
        },
      })
    );
  }

  handleTriggerKeydown(e) {
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.preventDefault();
        if (!this.isOpen) {
          this.open();
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!this.isOpen) {
          this.open();
        }
        break;
      case "Escape":
        e.preventDefault();
        if (this.isOpen) {
          this.close();
        }
        break;
    }
  }

  handleOptionKeydown(e, option, index) {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        this.selectOption(option, index);
        break;
      case "ArrowDown":
        e.preventDefault();
        this.focusNextOption();
        break;
      case "ArrowUp":
        e.preventDefault();
        this.focusPreviousOption();
        break;
      case "Escape":
        e.preventDefault();
        this.close();
        break;
      case "Home":
        e.preventDefault();
        this.focusedIndex = 0;
        this.selectOptions[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        this.focusedIndex = this.selectOptions.length - 1;
        this.selectOptions[this.focusedIndex]?.focus();
        break;
    }
  }

  focusNextOption() {
    this.focusedIndex = Math.min(
      this.focusedIndex + 1,
      this.selectOptions.length - 1
    );
    this.selectOptions[this.focusedIndex]?.focus();
  }

  focusPreviousOption() {
    this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
    this.selectOptions[this.focusedIndex]?.focus();
  }

  getValue() {
    return this.selectedOption ? this.selectedOption.dataset.value : null;
  }

  getText() {
    return this.selectedValue.textContent.trim();
  }

  setValue(value) {
    const option = Array.from(this.selectOptions).find(
      (opt) => opt.dataset.value === value
    );
    if (option) {
      const index = Array.from(this.selectOptions).indexOf(option);
      this.selectOption(option, index);
    }
  }

  disable() {
    this.element.classList.add("disabled");
    this.trigger.setAttribute("disabled", "true");
  }

  enable() {
    this.element.classList.remove("disabled");
    this.trigger.removeAttribute("disabled");
  }

  destroy() {
    // Remove all event listeners and clean up
    this.element.removeEventListener("click", this.toggle);
    this.element = null;
  }

  // Static method to close all selects except current
  static closeAll(exceptSelect = null) {
    document.querySelectorAll(".custom-select.open").forEach((select) => {
      if (select !== exceptSelect?.element) {
        select.classList.remove("open");
      }
    });
  }

  // Static method to initialize all selects on page
  static initAll(selector = ".custom-select", options = {}) {
    const instances = [];
    document.querySelectorAll(selector).forEach((element) => {
      instances.push(new CustomSelect(element, options));
    });
    return instances;
  }
}

// ============ AUTO INITIALIZATION ============
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all custom selects
  const selects = CustomSelect.initAll(".custom-select");

  // ============ EXAMPLE: Handle filter changes ============
  const filters = {
    orderby: "",
    perpage: "12",
    category: "",
  };

  // Listen to all select changes
  document.querySelectorAll(".custom-select").forEach((select) => {
    select.addEventListener("select:change", (e) => {
      const { name, value, text } = e.detail;

      // Update filters object
      filters[name] = value;

      console.log("Filter changed:", { name, value, text });
      console.log("Current filters:", filters);

      // Apply filters (choose one method)
      applyFilters(filters);
    });
  });

  // ============ METHOD 1: URL Parameters (Page Reload) ============
  function applyFilters(filters) {
    const url = new URL(window.location);

    // Update URL parameters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        url.searchParams.set(key, filters[key]);
      } else {
        url.searchParams.delete(key);
      }
    });

    // Reload page with new parameters
    window.location = url.toString();
  }

  // ============ METHOD 2: AJAX (No Page Reload) ============
  function applyFiltersAjax(filters) {
    const $grid = document.querySelector(".product-grid");

    fetch(wpAjax.ajaxurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        action: "filter_products",
        ...filters,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          $grid.innerHTML = data.data.html;
          // Update pagination if needed
          updatePagination(data.data.pagination);
        }
      })
      .catch((error) => {
        console.error("Filter error:", error);
      });
  }

  // ============ EXAMPLE: Get all filter values ============
  function getAllFilterValues() {
    const values = {};
    selects.forEach((select) => {
      const name = select.name;
      const value = select.getValue();
      if (name && value) {
        values[name] = value;
      }
    });
    return values;
  }

  // ============ EXAMPLE: Set filter value programmatically ============
  // selects[0].setValue('price'); // Set first select to 'price' option

  // ============ EXAMPLE: Disable/Enable select ============
  // selects[0].disable();
  // selects[0].enable();
});

// ============ EXPORT FOR MODULE USAGE ============
if (typeof module !== "undefined" && module.exports) {
  module.exports = CustomSelect;
}

(function () {
  "use strict";

  // ============ MANUFACTURER TABS ============
  const tabButtons = document.querySelectorAll(".manufacturer-tabs .tab-btn");
  const tabPanes = document.querySelectorAll(".manufacturer-tabs .tab-pane");

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
        setTimeout(() => {
          const targetPane = document.getElementById(targetTab);
          if (targetPane) {
            targetPane.classList.add("active");

            // Smooth scroll to tab content
            targetPane.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        }, 100);
      });
    });

    // Keyboard navigation
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
})();
