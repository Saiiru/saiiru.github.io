(() => {
  "use strict";
  const buttons = Array.from(document.querySelectorAll("[data-filter]"));
  const projects = Array.from(document.querySelectorAll("[data-categories]"));
  const update = (filter) => {
    buttons.forEach(button => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    projects.forEach(card => {
      const categories = (card.dataset.categories || "").split(" ");
      card.hidden = filter !== "all" && !categories.includes(filter);
    });
  };
  buttons.forEach(button => button.addEventListener("click", () => update(button.dataset.filter)));
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();