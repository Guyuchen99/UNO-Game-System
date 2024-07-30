let itemToDelete = null;

document.addEventListener("DOMContentLoaded", () => {
  const url = new URL(window.location.href);
  const pathname = url.pathname;

  // Restore form data
  const formData = JSON.parse(localStorage.getItem("formData")) || {};
  Object.keys(formData).forEach((element) => {
    const input = document.getElementById(element);
    if (input) {
      input.value = formData[element];
    }
  });

  // Add event listeners to save form data on change
  document.querySelectorAll("[data-save-input]")?.forEach((element) => {
    element.addEventListener("input", (e) => {
      formData[e.target.id] = e.target.value;
      localStorage.setItem("formData", JSON.stringify(formData));
    });
  });

  // Add event listeners to delete data on click
  document.querySelector("[data-conform-delete]")?.addEventListener("click", async () => {
    if (itemToDelete) {
      const response = await fetch(`${pathname}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: itemToDelete }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error(`Failed to delete ${itemToDelete}`);
      }
    }
  });
});

/* =================================================================================================== */
/* =================================================================================================== */
/* Delete Item Modal Section Below ------------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

function showDeleteItemModal(deleteItem) {
  itemToDelete = deleteItem;

  const deleteItemModal = document.querySelector("[data-delete-item-modal]");
  deleteItemModal.classList.add("openedModal");

  showModal();
  localStorage.setItem("modalState", "deleteItemModalOpened");
}

function hideDeleteItemModal() {
  const deleteItemModal = document.querySelector("[data-delete-item-modal]");
  deleteItemModal.classList.remove("openedModal");

  hideModal();
}

/* =================================================================================================== */
/* =================================================================================================== */
/* Edit Player Modal Section Below ------------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

document.querySelector("[data-edit-player-modal]")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (isPasswordFieldsNotMatch("[data-edit-player-modal]")) {
    displayModalErrorMessage("[data-edit-player-modal]", "Passwords do not match... Please try again!");
    return;
  }

  hideModalErrorMessage("[data-edit-player-modal]");

  e.target.submit();
});

async function showEditPlayerModal(playerID) {
  const playerIDInput = document.querySelector("[data-player-id]");
  const usernameInput = document.querySelector("[data-username-edit]");
  const emailInput = document.querySelector("[data-email-edit]");
  const countryInput = document.querySelector("[data-country-edit]");

  const playerData = await fetchPlayerData(playerID);
  if (playerData) {
    playerIDInput.value = playerData.playerID;
    usernameInput.value = playerData.username;
    emailInput.value = playerData.email;
    countryInput.value = playerData.country;
  }

  const editPlayerModal = document.querySelector("[data-edit-player-modal]");
  editPlayerModal.classList.add("openedModal");

  showModal();
  localStorage.setItem("modalState", "editPlayerModalOpened");
}

function hideEditPlayerModal() {
  const editPlayerModal = document.querySelector("[data-edit-player-modal]");
  editPlayerModal.classList.remove("openedModal");

  clearPasswordFields("[data-edit-player-modal]");
  hideModalErrorMessage("[data-edit-player-modal]");
  hideModal();
}

/* =================================================================================================== */
/* =================================================================================================== */
/* Create Player Modal Section Below ----------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

document.querySelector("[data-create-player-modal]")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (isFieldsEmpty("[data-create-player-modal]", ["[data-username]", "[data-email]", "[data-password]", "[data-confirm-password]"])) {
    displayModalErrorMessage("[data-create-player-modal]", "Form Incomplete... Please try again!");
    return;
  }

  if (isPasswordFieldsNotMatch("[data-create-player-modal]")) {
    displayModalErrorMessage("[data-create-player-modal]", "Passwords do not match... Please try again!");
    return;
  }

  const usernameAvailable = await isUsernameAvailable("[data-create-player-modal]");
  if (!usernameAvailable) {
    displayModalErrorMessage("[data-create-player-modal]", "Username is taken... Please try again!");
    return;
  }

  const emailAvailable = await isEmailAvailable("[data-create-player-modal]");
  if (!emailAvailable) {
    displayModalErrorMessage("[data-create-player-modal]", "Email is taken... Please try again!");
    return;
  }

  clearFormData();
  hideModalErrorMessage("[data-create-player-modal]");
  e.target.submit();
});

function showCreatePlayerModal() {
  const createPlayerModal = document.querySelector("[data-create-player-modal]");
  createPlayerModal.classList.add("openedModal");

  showModal();
  localStorage.setItem("modalState", "createPlayerModalOpened");
}

function hideCreatePlayerModal() {
  const createPlayerModal = document.querySelector("[data-create-player-modal]");
  createPlayerModal.classList.remove("openedModal");

  clearPasswordFields("[data-create-player-modal]");
  hideModalErrorMessage("[data-create-player-modal]");
  hideModal();
}

/* =================================================================================================== */
/* =================================================================================================== */
/* Helper Functions Below ---------------------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

function showModal() {
  const mainHeader = document.querySelector("[data-main-header]");
  const mainHeaderTitle = document.querySelector("[data-main-header-title]");
  const mainBody = document.querySelector("[data-main-body]");

  document.body.classList.add("openedModal");
  mainHeader?.classList.add("openedModal");
  mainHeaderTitle?.classList.add("openedModal");
  mainBody?.classList.add("openedModal");

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
  mainHeader?.classList.remove("openedModal");
  mainHeaderTitle?.classList.remove("openedModal");
  mainBody?.classList.remove("openedModal");

  const others = document.querySelectorAll("[data-pointer-not-allowed]");
  others.forEach((element) => {
    element.classList.remove("openedModal");
  });

  localStorage.setItem("modalState", "closed");
}

function displayModalErrorMessage(modalType, message) {
  const modalErrorMessage = document.querySelector(`${modalType} [data-modal-error-message]`);
  modalErrorMessage.innerHTML = `&#9888; ${message}`;
  modalErrorMessage.style.display = "flex";
}

function hideModalErrorMessage(modalType) {
  const modalErrorMessage = document.querySelector(`${modalType} [data-modal-error-message]`);
  modalErrorMessage.innerHTML = "";
  modalErrorMessage.style.display = "none";
}

function isFieldsEmpty(modalType, fieldsArray) {
  return fieldsArray.some((element) => document.querySelector(`${modalType} ${element}`).value === "");
}

function isPasswordFieldsNotMatch(modalType) {
  const password = document.querySelector(`${modalType} [data-password]`).value;
  const confirmPassword = document.querySelector(`${modalType} [data-confirm-password]`).value;
  return password !== confirmPassword;
}

function clearPasswordFields(modalType) {
  const password = document.querySelector(`${modalType} [data-password]`);
  const confirmPassword = document.querySelector(`${modalType} [data-confirm-password]`);

  if (password.value) {
    password.value = "";
  }

  if (confirmPassword.value) {
    confirmPassword.value = "";
  }
}

function clearFormData() {
  localStorage.removeItem("formData");
}

// Helper Function to Fetch Player Data to Display in Edit Player Modal
async function fetchPlayerData(playerID) {
  const response = await fetch(`/dashboard/edit-modal/fetch-data?playerID=${playerID}`);
  if (response.ok) {
    return response.json();
  }
  return null;
}

// Helper Function to Check Username Availability in Create Player Modal
async function isUsernameAvailable(modalType) {
  const username = document.querySelector(`${modalType} [data-username]`).value;
  const response = await fetch(`/dashboard/create-modal/check-input?username=${username}`);
  return response.ok;
}

// Helper Function to Check Username Availability in Create Player Modal
async function isEmailAvailable(modalType) {
  const email = document.querySelector(`${modalType} [data-email]`).value;
  const response = await fetch(`/dashboard/create-modal/check-input?email=${email}`);
  return response.ok;
}
