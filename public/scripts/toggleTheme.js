const toggleButton = document.querySelector("#themeToggle");

if (toggleButton) {
    toggleButton.addEventListener("click", async () => {
        const res = await fetch("/theme/toggle", {
        method: "POST",
        });

        const data = await res.json();

        // update UI instantly
        document.documentElement.dataset.theme = data.theme;
        toggleButton.querySelector("svg use").setAttribute("href", `#icon-${data.theme}`);
    });
}
