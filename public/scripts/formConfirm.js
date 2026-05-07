document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".confirm-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      const confirmed = confirm("Are you sure?");

      if (!confirmed) {
        e.preventDefault();
      }
    });
  });
});
