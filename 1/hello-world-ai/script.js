// script.js - behavior for Hello World AI

document.addEventListener('DOMContentLoaded', function () {
  const firstInput = document.getElementById('firstName');
  const lastInput = document.getElementById('lastName');
  const submitBtn = document.getElementById('submitBtn');
  const welcomeP = document.getElementById('welcome');

  function showWelcome() {
    const first = (firstInput.value || '').trim();
    const last = (lastInput.value || '').trim();

    if (!first && !last) {
      // if both empty, focus first name
      firstInput.focus();
      return;
    }

    const fullName = [first, last].filter(Boolean).join(' ');

    welcomeP.textContent = `Welcome, ${fullName}`;
    welcomeP.hidden = false;
  }

  submitBtn.addEventListener('click', showWelcome);

  // Allow Enter to submit when focused in either input
  [firstInput, lastInput].forEach((el) => {
    el.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        showWelcome();
      }
    });
  });
});
