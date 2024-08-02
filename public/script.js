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

	// Make the Element Read Only
	document.querySelectorAll("[data-read-only]")?.forEach((element) => {
		element.style.cursor = "not-allowed";
	});

	// Add event listeners to sort data on click
	document.querySelector("[data-dropdown]")?.addEventListener("change", async (e) => {
		window.location.href = `${window.location.pathname}?order=${e.target.value}`;
	});

	// Restore dropdown state
	const [key, value] = window.location.search.substring(1).split("=");
	document.querySelector("[data-dropdown]").value = value || "recent";
});

/* =================================================================================================== */
/* =================================================================================================== */
/* Autocomplete Search Bar Section Below ------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

const possibleSearchesTemplate = [
	"Which players have participated in all the events?",
	"Which events have more than {number} participants?",
	"How many participants from each country are there in each event?",
];

const searchBar = document.querySelector("[data-search-bar]");
const searchBarInput = document.querySelector("[data-search-bar-input]");
const searchableList = document.querySelector("[data-searchable-list]");
const searchResult = document.querySelector("[data-search-result]");

searchBar.addEventListener("submit", async (e) => {
	e.preventDefault();
	const searchQuery = searchBarInput.value.toLowerCase();
	const numberMatch = searchQuery.match(/\b\d+\b/);
	const number = numberMatch ? parseInt(numberMatch[0]) : 10;
	const queryType = getQueryType(searchQuery);

	const response = await fetch(`/search-results?queryType=${queryType}&number=${number}`);
	const searchResultData = await response.text();
	searchResult.innerHTML = searchResultData;
	searchResult.classList.add("openedModal");
	showModal();
});

function getQueryType(searchQuery) {
	if (searchQuery.includes("which events have more than")) {
		return "event-participants-count-by-number";
	} else if (searchQuery.includes("how many participants from each country")) {
		return "event-participants-count-by-country";
	} else if (searchQuery.includes("which players have participated in all the events")) {
		return "player-participates-all-events";
	} else {
		return searchQuery;
	}
}

searchBarInput.addEventListener("keyup", () => {
	const searchQuery = searchBarInput.value.toLowerCase();
	const numberMatch = searchQuery.match(/\b\d+\b/);
	const number = numberMatch ? parseInt(numberMatch[0]) : 10;
	const possibleSearches = possibleSearchesTemplate.map((query) => query.replace("{number}", number));
	const sortedSearches = possibleSearches.sort();

	clearSearchResults();
	updateSearchResults(sortedSearches, searchQuery);
});

function updateSearchResults(sortedSearches, searchQuery) {
	sortedSearches.forEach((element) => {
		if (element.toLowerCase().includes(searchQuery) && searchQuery) {
			searchBarInput.classList.add("border-show");

			const searchableListItem = document.createElement("li");
			searchableListItem.classList.add("searchable-list-item");
			searchableListItem.setAttribute("onclick", `displaySearch('${element}')`);
			searchableListItem.innerHTML = element.replace(new RegExp(searchQuery, "gi"), (match) => `<b>${match}</b>`);

			searchableListItem.addEventListener("click", () => {
				searchBar.dispatchEvent(new Event("submit"));
				clearSearchResults();
			});

			searchableList.classList.add("border-show");
			searchableList.appendChild(searchableListItem);
		}
	});
}

function displaySearch(value) {
	searchBarInput.value = value;
}

function clearSearchResults() {
	searchBarInput.classList.remove("border-show");
	searchableList.classList.remove("border-show");
	searchableList.innerHTML = "";
}

function hideSearchResult() {
	searchResult.classList.remove("openedModal");
	searchBarInput.value = "";

	clearSearchResults();
	hideModal();
}

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

	if (isFieldsEmpty("[data-edit-player-modal]", ["[data-username]"])) {
		displayModalErrorMessage("[data-edit-player-modal]", "Username cannot be empty.. Please try again!");
		return;
	}

	if (isFieldsEmpty("[data-edit-player-modal]", ["[data-email]"])) {
		displayModalErrorMessage("[data-edit-player-modal]", "Email cannot be empty... Please try again!");
		return;
	}

	if (isPasswordFieldsNotMatch("[data-edit-player-modal]")) {
		displayModalErrorMessage("[data-edit-player-modal]", "Passwords do not match... Please try again!");
		return;
	}

	hideModalErrorMessage("[data-edit-player-modal]");
	e.target.submit();
});

async function showEditPlayerModal(playerID) {
	const playerIDInput = document.querySelector("[data-edit-player-modal] [data-player-id]");
	const usernameInput = document.querySelector("[data-edit-player-modal] [data-username]");
	const emailInput = document.querySelector("[data-edit-player-modal] [data-email]");
	const countryInput = document.querySelector("[data-edit-player-modal] [data-country]");

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
/* Edit Membership Modal Section Below ------------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

document.querySelector("[data-edit-membership-modal")?.addEventListener("submit", async function (e) {
	e.preventDefault();

	if (isFieldsEmpty("[data-edit-membership-modal]", ["[data-username]"])) {
		displayModalErrorMessage("[data-edit-membership-modal]", "Username cannot be empty.. Please try again!");
		return;
	}

	const issueDateInput = document.querySelector("[data-edit-membership-modal] [data-issue-date]");
	const expireDateInput = document.querySelector("[data-edit-membership-modal] [data-expire-date]");

	if (expireDateInput.value < issueDateInput.value) {
		displayModalErrorMessage("[data-edit-membership-modal]", "Invalid Expire Date... Please try again!");
		return;
	}

	hideModalErrorMessage("[data-edit-membership-modal]");
	e.target.submit();
});

async function showEditMembershipModal(playerID) {
	const playerIDInput = document.querySelector("[data-edit-membership-modal] [data-player-id]");
	const usernameInput = document.querySelector("[data-edit-membership-modal] [data-username]");
	const issueDateInput = document.querySelector("[data-edit-membership-modal] [data-issue-date]");
	const expireDateInput = document.querySelector("[data-edit-membership-modal] [data-expire-date]");
	const privilegeLevelInput = document.querySelector("[data-edit-membership-modal] [data-privilege-level]");
	const privilegeClassInput = document.querySelector("[data-edit-membership-modal] [data-privilege-class]");

	const membershipData = await fetchMembershipData(playerID);
	if (membershipData) {
		playerIDInput.value = membershipData.playerID;
		usernameInput.value = membershipData.username;
		issueDateInput.value = membershipData.membershipIssueDate;
		expireDateInput.value = membershipData.membershipExpireDate;
		privilegeLevelInput.value = membershipData.membershipPrivilegeLevel;
		privilegeClassInput.innerHTML = membershipData.membershipPrivilegeClass;
	}

	const editMembershipModal = document.querySelector("[data-edit-membership-modal]");
	editMembershipModal.classList.add("openedModal");

	showModal();
	localStorage.setItem("modalState", "editMembershipModalOpened");
}

function hideEditMembershipModal() {
	const editMembershipModal = document.querySelector("[data-edit-membership-modal]");
	editMembershipModal.classList.remove("openedModal");

	hideModalErrorMessage("[data-edit-membership-modal]");
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
/* Create Membership Modal Section Below ------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

document.querySelector("[data-create-membership-modal]")?.addEventListener("submit", async function (e) {
	e.preventDefault();

	if (isFieldsEmpty("[data-create-membership-modal]", ["[data-username]", "[data-membership-duration]"])) {
		displayModalErrorMessage("[data-create-membership-modal]", "Form Incomplete... Please try again!");
		return;
	}

	if (!(await fetchPlayerID("[data-create-membership-modal]"))) {
		displayModalErrorMessage("[data-create-membership-modal]", "Username doesn't exist... Please try again!");
		return;
	}

	if (!(await isUserWithoutMembership("[data-create-membership-modal]"))) {
		displayModalErrorMessage("[data-create-membership-modal]", "Membership already exists... Please edit instead!");
		return;
	}

	if (isDurationValid("[data-create-membership-modal]")) {
		displayModalErrorMessage("[data-create-membership-modal]", "Invalid Duration... Please try again!");
		return;
	}

	clearFormData();
	hideModalErrorMessage("[data-create-membership-modal]");
	e.target.submit();
});

function showCreateMembershipModal() {
	const createMembershipModal = document.querySelector("[data-create-membership-modal]");
	createMembershipModal.classList.add("openedModal");

	showModal();
	localStorage.setItem("modalState", "createMembershipModalOpened");
}

function hideCreateMembershipModal() {
	const createMembershipModal = document.querySelector("[data-create-membership-modal]");
	createMembershipModal.classList.remove("openedModal");

	hideModalErrorMessage("[data-create-membership-modal]");
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

function isDurationValid(modalType) {
	const membershipDuration = document.querySelector(`${modalType} [data-membership-duration]`).value;
	currentDate = new Date();
	expireDate = new Date(new Date().getTime() + membershipDuration * 24 * 60 * 60 * 1000);
	return isNaN(expireDate);
}

function updatePrivilegeClass(modalType) {
	const privilegeLevel = document.querySelector(`${modalType} [data-privilege-level]`);
	const privilegeClass = document.querySelector(`${modalType} [data-privilege-class]`);

	let currentClass;

	switch (privilegeLevel.value) {
		case "1":
			currentClass = "Bronze";
			break;
		case "2":
			currentClass = "Silver";
			break;
		case "3":
			currentClass = "Gold";
			break;
		case "4":
			currentClass = "Platinum";
			break;
		case "5":
			currentClass = "Diamond";
			break;
	}

	privilegeClass.innerHTML = currentClass;
}

// Helper Function to Fetch Player Data in any modal
async function fetchPlayerID(modalType) {
	const username = document.querySelector(`${modalType} [data-username]`).value;
	const response = await fetch(`/dashboard/fetch-playerID?username=${username}`);
	if (response.ok) {
		return response.json();
	}
	return null;
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

// Helper Function to Fetch Membership Data to Display in Edit Membership Modal
async function fetchMembershipData(playerID) {
	const response = await fetch(`/memberships/edit-modal/fetch-data?playerID=${playerID}`);
	if (response.ok) {
		return response.json();
	}
	return null;
}

// Helper Function to Check Whether the Membership can be Created in Create Membership Modal
async function isUserWithoutMembership(modalType) {
	const username = document.querySelector(`${modalType} [data-username]`).value;
	const response = await fetch(`/memberships/create-modal/check-membership?username=${username}`);
	return response.ok;
}

/* =================================================================================================== */
/* =================================================================================================== */
/* Perrry Below ---------------------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */
