const confirmForms = document.querySelectorAll(".confirm-form");

if (confirmForms) {
  confirmForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const confirmed = confirm("Are you sure?");

      if (!confirmed) {
        e.preventDefault();
      }
    });
  });
}

