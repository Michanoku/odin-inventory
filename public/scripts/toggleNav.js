const navButton = document.querySelector("#navToggle");
const nav = document.querySelector("nav");

if (navButton) {
  navButton.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = nav.classList.toggle("open");

    navButton.setAttribute("aria-pressed", isOpen);
    navButton
      .querySelector("svg use")
      .setAttribute("href", `#icon-${isOpen ? "close" : "menu"}`);
  });

  document.addEventListener("click", (e) => {
    const clickedInsideNav = nav.contains(e.target);
    const clickedButton = navButton.contains(e.target);

    if (!clickedInsideNav && !clickedButton) {
      nav.classList.remove("open");

      navButton.setAttribute("aria-pressed", false);

      navButton
        .querySelector("svg use")
        .setAttribute("href", "#icon-menu");
    }
  });
}