let usernameToDelete = null;
let usernameToEdit = null;

document.addEventListener("DOMContentLoaded", () => {
  // Check if the form was successfully submitted
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("status") === "success") {
    clearFormData();
    hideModal();
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 300);
  }

  // Restore createItemModal state
  const modalState = localStorage.getItem("modalState");
  if (modalState === "createPlayerModalOpened") {
    showCreatePlayerModal();
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
  const inputs = document.querySelectorAll("[data-save-input]");
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

/* Delete Item Modal Section Below ------------------------------------------------------------------- */

// Show the Delete Item Modal
function showDeleteItemModal(username) {
  usernameToDelete = username;

  const deleteItemModal = document.querySelector("[data-delete-item-modal]");
  deleteItemModal.classList.add("openedModal");

  showModal();
  localStorage.setItem("modalState", "deleteItemModalOpened");
}

// Hide the Delete Item Modal
function hideDeleteItemModal() {
  const deleteItemModal = document.querySelector("[data-delete-item-modal]");
  deleteItemModal.classList.remove("openedModal");

  hideModal();
}

/* Edit Player Modal Section Below ------------------------------------------------------------------- */

// Show the Edit Player Modal
async function showEditPlayerModal(username) {
  const usernameInput = document.querySelector("[data-username-edit]");
  const emailInput = document.querySelector("[data-email-edit]");
  const countryInput = document.querySelector("[data-country-edit]");

  const playerData = await fetchPlayerData(username);
  if (playerData) {
    usernameInput.value = playerData.username;
    emailInput.value = playerData.email;
    countryInput.value = playerData.country;
  }

  const editPlayerModal = document.querySelector("[data-edit-player-modal]");
  editPlayerModal.classList.add("openedModal");

  showModal();
  localStorage.setItem("modalState", "editPlayerModalOpened");
}

// Hide the Edit Player Modal
function hideEditPlayerModal() {
  const editPlayerModal = document.querySelector("[data-edit-player-modal]");
  editPlayerModal.classList.remove("openedModal");

  hideModal();
}

/* Create Player Modal Section Below ------------------------------------------------------------------- */

// Show the Create Player Modal
function showCreatePlayerModal() {
  const createPlayerModal = document.querySelector("[data-create-player-modal]");
  createPlayerModal.classList.add("openedModal");

  const modalErrorMessage = document.querySelector("[data-modal-error-message");
  modalErrorMessage?.classList.add("openedModal");

  showModal();
  localStorage.setItem("modalState", "createPlayerModalOpened");
}

// Hide the Create Player Modal
function hideCreatePlayerModal() {
  const createPlayerModal = document.querySelector("[data-create-player-modal]");
  createPlayerModal.classList.remove("openedModal");

  const modalErrorMessage = document.querySelector("[data-modal-error-message");
  modalErrorMessage?.classList.remove("openedModal");

  hideModal();
}

/* Helper Functions Below ------------------------------------------------------------------- */

// Helper Function to Show the Modal
function showModal() {
  const mainHeader = document.querySelector("[data-main-header]");
  const mainHeaderTitle = document.querySelector("[data-main-header-title]");
  const mainBody = document.querySelector("[data-main-body]");

  document.body?.classList.add("openedModal");
  mainHeader?.classList.add("openedModal");
  mainHeaderTitle?.classList.add("openedModal");
  mainBody?.classList.add("openedModal");

  const others = document.querySelectorAll("[data-pointer-not-allowed]");
  others.forEach((element) => {
    element.classList.add("openedModal");
  });
}

// Helper Function to Hide the Modal
function hideModal() {
  const mainHeader = document.querySelector("[data-main-header]");
  const mainHeaderTitle = document.querySelector("[data-main-header-title]");
  const mainBody = document.querySelector("[data-main-body]");

  document.body?.classList.remove("openedModal");
  mainHeader?.classList.remove("openedModal");
  mainHeaderTitle?.classList.remove("openedModal");
  mainBody?.classList.remove("openedModal");

  const others = document.querySelectorAll("[data-pointer-not-allowed]");
  others.forEach((element) => {
    element.classList.remove("openedModal");
  });

  localStorage.setItem("modalState", "closed");
}

// Helper Function to Clear the Form Data
function clearFormData() {
  localStorage.removeItem("formData");
}

// Helper Function to Fetch Player Data to Display in Edit Player Modal
async function fetchPlayerData(username) {
  try {
    const response = await fetch(`/dashboard/player-data?username=${username}`);
    if (response.ok) {
      const playerData = await response.json();
      return playerData;
    } else {
      console.error("Failed to fetch player data.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching player data:", error);
    return null;
  }
}
