let usernameToDelete = null;

document.addEventListener("DOMContentLoaded", () => {
  // Check if the form was successfully submitted
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("status") === "success") {
    clearFormData();
    hideModal();
  }

  // Restore createItemModal state
  const modalState = localStorage.getItem("modalState");
  if (modalState === "createItemModalOpened") {
    showCreateItemModal();
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
  inputs.forEach((element) => {
    element.addEventListener("input", (e) => {
      const formData = JSON.parse(localStorage.getItem("formData")) || {};
      formData[e.target.id] = e.target.value;
      localStorage.setItem("formData", JSON.stringify(formData));
    });
  });

  // Add event listeners to delete data on click
  const deleteConfirmButton = document.querySelector("[data-conform-delete]");
  deleteConfirmButton.addEventListener("click", async () => {
    if (usernameToDelete) {
      const response = await fetch("/dashboard", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameToDelete }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to delete the player.");
      }
    }
  });
});

function clearFormData() {
  localStorage.removeItem("formData");
}

function showDeleteItemModal(username) {
  usernameToDelete = username;

  const deleteItemModal = document.querySelector("[data-delete-modal]");
  deleteItemModal.classList.add("openedModal");

  showModal();
  localStorage.setItem("modalState", "deleteItemModalOpened");
}

function hideDeleteItemModal() {
  const deleteItemModal = document.querySelector("[data-delete-modal]");
  deleteItemModal.classList.remove("openedModal");

  hideModal();
}

function showCreateItemModal() {
  const createItemModal = document.querySelector("[data-create-player-form]");
  createItemModal.classList.add("openedModal");

  const modalErrorMessage = document.querySelector("[data-modal-error-message");
  modalErrorMessage?.classList.add("openedModal");

  showModal();
  localStorage.setItem("modalState", "createItemModalOpened");
}

function hideCreateItemModal() {
  const createItemModal = document.querySelector("[data-create-player-form]");
  createItemModal.classList.remove("openedModal");

  const modalErrorMessage = document.querySelector("[data-modal-error-message");
  modalErrorMessage?.classList.remove("openedModal");

  hideModal();
}

function showModal() {
  const mainHeader = document.querySelector("[data-main-header]");
  const mainHeaderTitle = document.querySelector("[data-main-header-title]");
  const mainBody = document.querySelector("[data-main-body]");

  document.body.classList.add("openedModal");
  mainHeader.classList.add("openedModal");
  mainHeaderTitle.classList.add("openedModal");
  mainBody.classList.add("openedModal");

  const others = document.querySelectorAll("[data-pointer-not-allowed]");
  others.forEach((element) => {
    element.classList.add("openedModal");
  });
}

function hideModal() {
  const mainHeader = document.querySelector("[data-main-header]");
  const mainHeaderTitle = document.querySelector("[data-main-header-title]");
  const mainBody = document.querySelector("[data-main-body]");

  document.body.classList.remove("openedModal");
  mainHeader.classList.remove("openedModal");
  mainHeaderTitle.classList.remove("openedModal");
  mainBody.classList.remove("openedModal");

  const others = document.querySelectorAll("[data-pointer-not-allowed]");
  others.forEach((element) => {
    element.classList.remove("openedModal");
  });

  localStorage.setItem("modalState", "closed");
}
