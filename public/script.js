document.addEventListener("DOMContentLoaded", () => {
  // Check if the form was successfully submitted
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("status") === "success") {
    clearFormData();
    hideModal();
  }

  // Restore modal state
  const modalState = localStorage.getItem("modalState");
  if (modalState === "opened") {
    showModal();
  } else {
    hideModal();
  }

  // Restore form data
  const formData = JSON.parse(localStorage.getItem("formData")) || {};
  Object.keys(formData).forEach((key) => {
    const input = document.getElementById(key);
    if (input) {
      input.value = formData[key];
    }
  });

  // Add event listeners to save form data on change
  const inputs = document.querySelectorAll("[data-input]");
  console.log(inputs);

  inputs.forEach((element) => {
    element.addEventListener("input", (e) => {
      const formData = JSON.parse(localStorage.getItem("formData")) || {};
      formData[e.target.id] = e.target.value;
      localStorage.setItem("formData", JSON.stringify(formData));
    });
  });
});

function clearFormData() {
  localStorage.removeItem("formData");
}

function addPlayer() {
  showModal();
}

function cancelForm() {
  if (document.body.classList.contains("openedModal")) {
    hideModal();
  }
}

function showModal() {
  const mainHeader = document.querySelector("[data-main-header]");
  const mainHeaderTitle = document.querySelector("[data-main-header-title]");
  const mainBody = document.querySelector("[data-main-body]");
  const createPlayerForm = document.querySelector("[data-create-player-form]");
  document.body.classList.add("openedModal");
  mainHeader.classList.add("openedModal");
  mainHeaderTitle.classList.add("openedModal");
  mainBody.classList.add("openedModal");
  createPlayerForm.classList.add("openedModal");

  const modalErrorMessage = document.querySelector("[data-modal-error-message");
  modalErrorMessage?.classList.add("openedModal");

  const others = document.querySelectorAll("[data-pointer-not-allowed]");
  others.forEach((element) => {
    element.classList.add("openedModal");
  });

  localStorage.setItem("modalState", "opened");
}

function hideModal() {
  const mainHeader = document.querySelector("[data-main-header]");
  const mainHeaderTitle = document.querySelector("[data-main-header-title]");
  const mainBody = document.querySelector("[data-main-body]");
  const createPlayerForm = document.querySelector("[data-create-player-form]");

  document.body.classList.remove("openedModal");
  mainHeader.classList.remove("openedModal");
  mainHeaderTitle.classList.remove("openedModal");
  mainBody.classList.remove("openedModal");
  createPlayerForm.classList.remove("openedModal");

  const modalErrorMessage = document.querySelector("[data-modal-error-message");
  modalErrorMessage?.classList.remove("openedModal");

  const others = document.querySelectorAll("[data-pointer-not-allowed]");
  others.forEach((element) => {
    element.classList.remove("openedModal");
  });

  localStorage.setItem("modalState", "closed");
}
