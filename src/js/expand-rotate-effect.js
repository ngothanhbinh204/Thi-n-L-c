import $ from "jquery";

export default function expandRotateEffect() {
  const $cards = $(".section-expand-rotate .card-wrapper");

  if (!$cards.length) return;

  // Set initial state: first card expanded, others collapsed
  // Only if no card is already expanded
  if (!$cards.filter(".expanded").length) {
    $cards.first().addClass("expanded");
    $cards.not(":first").addClass("collapsed");
  }

  $cards.on("click", function () {
    const $this = $(this);

    if ($this.hasClass("expanded")) return;

    // Remove expanded from all, add collapsed to all
    $cards.removeClass("expanded").addClass("collapsed");

    // Add expanded to clicked, remove collapsed
    $this.removeClass("collapsed").addClass("expanded");
  });
}
