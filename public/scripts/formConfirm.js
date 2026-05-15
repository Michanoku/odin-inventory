const confirmForms = document.querySelectorAll(".confirm-form");

if (confirmForms) {
  confirmForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const password = prompt("Action requires password for confirmation:");
      if (!password) {
        e.preventDefault();
        return;
      }
      const input = form.querySelector('input[name="password"]');
      input.value = password;
    });
  });
}
