let itemToDelete = null;

document.addEventListener("DOMContentLoaded", () => {
	const url = new URL(window.location.href);
	const pathname = url.pathname;

	initalizingForStoringFormData();

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

	// Add event listeners to sort data on click
	document.querySelector("[data-dropdown-sort]")?.addEventListener("change", async (e) => {
		window.location.href = `${window.location.pathname}?order=${e.target.value}`;
	});

	// Restore dropdown state
	const [key, value] = window.location.search.substring(1).split("=");
	if (value) {
		document.querySelector("[data-dropdown-sort]").value = value || "recent";
	}

	// Restore Store Items Details State
	if (window.location.pathname === "/store-items" && localStorage.getItem("storeItemsState")) {
		const modalState = localStorage.getItem("storeItemsState");
		showStoreItemsDetails(modalState);
		localStorage.removeItem("storeItemsState");
	}

	// Add Different Color for Status Display
	document.querySelectorAll("[data-status]")?.forEach((element) => {
		if (element.dataset.status === "Active" || element.dataset.status === "In Process") {
			element.style.color = "#008040";
		} else if (element.dataset.status === "Expired") {
			element.style.color = "#f5222d";
		} else if (element.dataset.status === "Completed") {
			element.style.color = "#f5222d";
		} else if (element.dataset.status === "Upcoming") {
			element.style.color = "#1890ff";
		}
	});
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
/* Delete Anything Modal Section Below --------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

function showDeleteItemModal(deleteItem) {
	itemToDelete = deleteItem;

	const deleteItemModal = document.querySelector("[data-delete-item-modal]");
	deleteItemModal.classList.add("openedModal");

	showModal();
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
		displayModalErrorMessage("[data-edit-player-modal]", "Username cannot be empty... Please try again!");
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

	const originalUsernameInput = document.querySelector("[data-edit-player-modal] [data-original-username]");
	const usernameInput = document.querySelector("[data-edit-player-modal] [data-username]");

	if (originalUsernameInput.value !== usernameInput.value) {
		const usernameAvailable = await isUsernameAvailable("[data-edit-player-modal]");
		if (!usernameAvailable) {
			displayModalErrorMessage("[data-edit-player-modal]", "Username is taken... Please try again!");
			return;
		}
	}

	const originalEmailInput = document.querySelector("[data-edit-player-modal] [data-original-email]");
	const emailInput = document.querySelector("[data-edit-player-modal] [data-email]");

	if (originalEmailInput.value !== emailInput.value) {
		const emailAvailable = await isEmailAvailable("[data-edit-player-modal]");
		if (!emailAvailable) {
			displayModalErrorMessage("[data-edit-player-modal]", "Email is taken... Please try again!");
			return;
		}
	}

	hideModalErrorMessage("[data-edit-player-modal]");
	e.target.submit();
});

async function showEditPlayerModal(playerID) {
	const playerIDInput = document.querySelector("[data-edit-player-modal] [data-player-id]");
	const originalUsernameInput = document.querySelector("[data-edit-player-modal] [data-original-username]");
	const usernameInput = document.querySelector("[data-edit-player-modal] [data-username]");
	const originalEmailInput = document.querySelector("[data-edit-player-modal] [data-original-email]");
	const emailInput = document.querySelector("[data-edit-player-modal] [data-email]");
	const countryInput = document.querySelector("[data-edit-player-modal] [data-country]");

	const playerData = await fetchPlayerData(playerID);
	if (playerData) {
		playerIDInput.value = playerData.playerID;
		originalUsernameInput.value = playerData.username;
		usernameInput.value = playerData.username;
		originalEmailInput.value = playerData.email;
		emailInput.value = playerData.email;
		countryInput.value = playerData.country;
	}

	const editPlayerModal = document.querySelector("[data-edit-player-modal]");
	editPlayerModal.classList.add("openedModal");

	showModal();
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
/* Edit Item Modal Section Below --------------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

document.querySelector("[data-edit-item-modal]")?.addEventListener("submit", async function (e) {
	e.preventDefault();

	if (isFieldsEmpty("[data-edit-item-modal]", ["[data-name]"])) {
		displayModalErrorMessage("[data-edit-item-modal]", "Name cannot be empty.. Please try again!");
		return;
	}

	const originalItemNameInput = document.querySelector("[data-edit-item-modal] [data-original-name]");
	const itemNameInput = document.querySelector("[data-edit-item-modal] [data-name]");

	if (originalItemNameInput.value !== itemNameInput.value) {
		const itemNameAvailable = await isItemNameAvailable("[data-edit-item-modal]");
		if (!itemNameAvailable) {
			displayModalErrorMessage("[data-edit-item-modal]", "Name is taken... Please try again!");
			return;
		}
	}

	hideModalErrorMessage("[data-edit-item-modal]");
	e.target.submit();
});

async function showEditItemModal(itemID) {
	const itemIDInput = document.querySelector("[data-edit-item-modal] [data-item-id]");
	const originalItemNameInput = document.querySelector("[data-edit-item-modal] [data-original-name]");
	const itemNameInput = document.querySelector("[data-edit-item-modal] [data-name]");
	const qualityInput = document.querySelector("[data-edit-item-modal] [data-quality]");
	const appliedPromotionInput = document.querySelector("[data-edit-item-modal] [data-applied-promotion]");

	const itemData = await fetchItemData(itemID);
	if (itemData) {
		itemIDInput.value = itemData.itemID;
		originalItemNameInput.value = itemData.itemName;
		itemNameInput.value = itemData.itemName;
		qualityInput.value = itemData.itemQuality;
		appliedPromotionInput.value = itemData.itemAppliedPromotion;
	}

	const editItemModal = document.querySelector("[data-edit-item-modal]");
	editItemModal.classList.add("openedModal");

	initalizeAppliedPromotionForItem("[data-edit-item-modal]");
	showModal();
}

function hideEditItemModal() {
	const editItemModal = document.querySelector("[data-edit-item-modal]");
	editItemModal.classList.remove("openedModal");

	hideModalErrorMessage("[data-edit-item-modal]");
	hideModal();
}

/* =================================================================================================== */
/* =================================================================================================== */
/* Edit Membership Modal Section Below ------------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

document.querySelector("[data-edit-membership-modal")?.addEventListener("submit", async function (e) {
	e.preventDefault();

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

	const membershipData = await fetchMembershipData(playerID);
	if (membershipData) {
		playerIDInput.value = membershipData.playerID;
		usernameInput.value = membershipData.username;
		issueDateInput.value = membershipData.membershipIssueDate;
		expireDateInput.value = membershipData.membershipExpireDate;
		privilegeLevelInput.value = membershipData.membershipPrivilegeLevel;
	}

	const editMembershipModal = document.querySelector("[data-edit-membership-modal]");
	editMembershipModal.classList.add("openedModal");

	initalizePrivilegeLevelForMembership("[data-edit-membership-modal]");
	showModal();
}

function hideEditMembershipModal() {
	const editMembershipModal = document.querySelector("[data-edit-membership-modal]");
	editMembershipModal.classList.remove("openedModal");

	hideModalErrorMessage("[data-edit-membership-modal]");
	hideModal();
}

/* =================================================================================================== */
/* =================================================================================================== */
/* Edit Event Modal Section Below ------------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

document.querySelector("[data-edit-event-modal")?.addEventListener("submit", async function (e) {
	e.preventDefault();

	if (isFieldsEmpty("[data-edit-event-modal]", ["[data-name]"])) {
		displayModalErrorMessage("[data-edit-event-modal]", "Name cannot be empty... Please try again!");
		return;
	}

	const originalEventNameInput = document.querySelector("[data-edit-event-modal] [data-original-name]");
	const eventNameInput = document.querySelector("[data-edit-event-modal] [data-name]");

	if (originalEventNameInput.value !== eventNameInput.value) {
		const eventNameAvailable = await isEventNameAvailable("[data-edit-event-modal]");
		if (!eventNameAvailable) {
			displayModalErrorMessage("[data-edit-event-modal]", "Name is taken... Please try again!");
			return;
		}
	}

	const startDateInput = document.querySelector("[data-edit-event-modal] [data-start-date]");
	const endDateInput = document.querySelector("[data-edit-event-modal] [data-end-date]");

	if (endDateInput.value < startDateInput.value) {
		displayModalErrorMessage("[data-edit-event-modal]", "Invalid End Date... Please try again!");
		return;
	}

	hideModalErrorMessage("[data-edit-event-modal]");
	e.target.submit();
});

async function showEditEventModal(eventID) {
	const eventIDInput = document.querySelector("[data-edit-event-modal] [data-event-id]");
	const originalEventNameInput = document.querySelector("[data-edit-event-modal] [data-original-name]");
	const eventNameInput = document.querySelector("[data-edit-event-modal] [data-name]");
	const startDateInput = document.querySelector("[data-edit-event-modal] [data-start-date]");
	const endDateInput = document.querySelector("[data-edit-event-modal] [data-end-date]");
	const participantsInput = document.querySelector("[data-edit-event-modal] [data-participants]");

	const eventData = await fetchEventData(eventID);
	if (eventData) {
		eventIDInput.value = eventData.eventID;
		originalEventNameInput.value = eventData.eventName;
		eventNameInput.value = eventData.eventName;
		startDateInput.value = eventData.eventStartDate;
		endDateInput.value = eventData.eventEndDate;
		participantsInput.value = eventData.eventNumOfParticipants;
	}

	const editEventModal = document.querySelector("[data-edit-event-modal]");
	editEventModal.classList.add("openedModal");

	showModal();
}

function hideEditEventModal() {
	const editEventModal = document.querySelector("[data-edit-event-modal]");
	editEventModal.classList.remove("openedModal");

	hideModalErrorMessage("[data-edit-event-modal]");
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
/* Create Item Modal Section Below ------------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

document.querySelector("[data-create-item-modal]")?.addEventListener("submit", async function (e) {
	e.preventDefault();

	if (isFieldsEmpty("[data-create-item-modal]", ["[data-name]"])) {
		displayModalErrorMessage("[data-create-item-modal]", "Name cannot be empty.. Please try again!");
		return;
	}

	const itemNameAvailable = await isItemNameAvailable("[data-create-item-modal]");
	if (!itemNameAvailable) {
		displayModalErrorMessage("[data-create-item-modal]", "Name is taken... Please try again!");
		return;
	}

	clearFormData();
	hideModalErrorMessage("[data-create-item-modal]");
	e.target.submit();
});

function showCreateItemModal() {
	const createItemModal = document.querySelector("[data-create-item-modal]");
	createItemModal.classList.add("openedModal");

	initalizeAppliedPromotionForItem("[data-create-item-modal]");
	showModal();
}

function hideCreateItemModal() {
	const createItemModal = document.querySelector("[data-create-item-modal]");
	createItemModal.classList.remove("openedModal");

	hideModalErrorMessage("[data-create-item-modal]");
	hideModal();
}

/* =================================================================================================== */
/* =================================================================================================== */
/* Create Membership Modal Section Below ------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

document.querySelector("[data-create-membership-modal]")?.addEventListener("submit", async function (e) {
	e.preventDefault();

	if (isFieldsEmpty("[data-create-membership-modal]", ["[data-username]", "[data-duration]"])) {
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

	initalizePrivilegeLevelForMembership("[data-create-membership-modal]");
	showModal();
}

function hideCreateMembershipModal() {
	const createMembershipModal = document.querySelector("[data-create-membership-modal]");
	createMembershipModal.classList.remove("openedModal");

	hideModalErrorMessage("[data-create-membership-modal]");
	hideModal();
}

/* =================================================================================================== */
/* =================================================================================================== */
/* Create Event Modal Section Below ------------------------------------------------------------------ */
/* =================================================================================================== */
/* =================================================================================================== */

document.querySelector("[data-create-event-modal]")?.addEventListener("submit", async function (e) {
	e.preventDefault();

	if (isFieldsEmpty("[data-create-event-modal]", ["[data-name]"])) {
		displayModalErrorMessage("[data-create-event-modal]", "Name cannot be empty... Please try again!");
		return;
	}

	if (isFieldsEmpty("[data-create-event-modal]", ["[data-start-date]"])) {
		displayModalErrorMessage("[data-create-event-modal]", "Start Date cannot be empty... Please try again!");
		return;
	}

	if (isFieldsEmpty("[data-create-event-modal]", ["[data-end-date]"])) {
		displayModalErrorMessage("[data-create-event-modal]", "End Date cannot be empty... Please try again!");
		return;
	}

	const eventNameAvailable = await isEventNameAvailable("[data-create-event-modal]");
	if (!eventNameAvailable) {
		displayModalErrorMessage("[data-create-event-modal]", "Name is taken... Please try again!");
		return;
	}

	const startDateInput = document.querySelector("[data-create-event-modal] [data-start-date]");
	const endDateInput = document.querySelector("[data-create-event-modal] [data-end-date]");

	if (endDateInput.value < startDateInput.value) {
		displayModalErrorMessage("[data-create-event-modal]", "Invalid End Date... Please try again!");
		return;
	}

	clearFormData();
	hideModalErrorMessage("[data-create-event-modal]");
	e.target.submit();
});

function showCreateEventModal() {
	const createEventModal = document.querySelector("[data-create-event-modal]");
	createEventModal.classList.add("openedModal");

	showModal();
}

function hideCreateEventModal() {
	const createEventModal = document.querySelector("[data-create-event-modal]");
	createEventModal.classList.remove("openedModal");

	hideModalErrorMessage("[data-create-event-modal]");
	hideModal();
}

/* =================================================================================================== */
/* =================================================================================================== */
/* Create Match Modal Section Below ------------------------------------------------------------------ */
/* =================================================================================================== */
/* =================================================================================================== */

document.querySelector("[data-create-match-modal]")?.addEventListener("submit", async function (e) {
	e.preventDefault();

	const usernames = Array.from(document.querySelectorAll("[data-create-match-modal] [data-username]")).map((element) => element.value);

	const invalidUsernames = await validateUsernames(usernames);

	if (invalidUsernames.length > 0) {
		const isUsernameEmpty = invalidUsernames.some((element) => element === "");

		if (isUsernameEmpty) {
			displayModalErrorMessage("[data-create-match-modal]", "Username cannot be empty... Please try again!");
			return;
		}

		displayModalErrorMessage("[data-create-match-modal]", `The following usernames don't exist: ${invalidUsernames.join(", ")}`);
		return;
	}

	clearFormData();
	hideModalErrorMessage("[data-create-membership-modal]");
	e.target.submit();
});

function showCreateMatchModal() {
	const createMatchModal = document.querySelector("[data-create-match-modal]");
	createMatchModal.classList.add("openedModal");

	initializeDefaultTemplatesForMatch();

	const numOfPlayerDropdown = document.querySelector("[data-create-match-modal] [data-number-of-players]");
	numOfPlayerDropdown.addEventListener("change", handlePlayerCountChangeForMatch);

	initalizingForStoringFormData();
	showModal();
}

function hideCreateMatchModal() {
	const createMatchModal = document.querySelector("[data-create-match-modal]");
	createMatchModal.classList.remove("openedModal");

	hideModalErrorMessage("[data-create-match-modal]");
	hideModal();
}

/* =================================================================================================== */
/* =================================================================================================== */
/* Insert Item Modal Section Below ------------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

document.querySelector("[data-insert-item-modal]")?.addEventListener("submit", async function (e) {
	e.preventDefault();

	if (isFieldsEmpty("[data-insert-item-modal]", ["[data-username]"])) {
		displayModalErrorMessage("[data-insert-item-modal]", "Username cannot be empty... Please try again!");
		return;
	}

	const playerID = await fetchPlayerID("[data-insert-item-modal]");

	if (!playerID) {
		displayModalErrorMessage("[data-insert-item-modal]", "Username doesn't exist... Please try again!");
		return;
	}

	const itemToInsert = document.querySelector("[data-insert-item-modal] [data-item-id]").value;

	if (!(await isItemNotInPlayerStore(itemToInsert, playerID))) {
		displayModalErrorMessage("[data-insert-item-modal]", "Item already in the store... Please try again!");
		return;
	}

	clearFormData();
	hideModalErrorMessage("[data-insert-item-modal]");
	e.target.submit();
});

function showInsertItemModal(itemID) {
	const itemToInsert = document.querySelector("[data-insert-item-modal] [data-item-id]");
	itemToInsert.value = itemID;

	const insertItemModal = document.querySelector("[data-insert-item-modal]");
	insertItemModal.classList.add("openedModal");

	showModal();
}

function hideInsertItemModal() {
	const insertItemModal = document.querySelector("[data-insert-item-modal]");
	insertItemModal.classList.remove("openedModal");

	hideModalErrorMessage("[data-insert-item-modal]");
	hideModal();
}

/* =================================================================================================== */
/* =================================================================================================== */
/* View Store Item Section Below --------------------------------------------------------------------- */
/* =================================================================================================== */
/* =================================================================================================== */

async function showStoreItemsDetails(storeID) {
	const storeItemsDetailsHeader = document.querySelector("[data-store-items-details-header] h2");
	storeItemsDetailsHeader.innerHTML = `Available Items in Store ${storeID}`;

	const storeItemsDetailsTable = document.querySelector("[data-store-item-details-table]");
	const storeItemsDetailsData = await fetchStoreItemDetails(storeID);

	if (storeItemsDetailsData.length > 0) {
		storeItemsDetailsTable.innerHTML = ` 
			<table class="table">
				<thead>
					<tr>
						<th>Item ID</th>
						<th>Name</th>
						<th>Quality</th>
						<th>Current Price</th>
						<th>Original Price</th>
						<th>Applied Promotion</th>
						<th>Discount</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody data-store-items-details-table-body>

				</tbody>
			</table>
		`;

		const storeItemsDetailsTableBody = document.querySelector("[data-store-items-details-table-body]");

		storeItemsDetailsData.forEach((element) => {
			storeItemsDetailsTableBody.innerHTML += `
				<tr>
					<td>${element.itemID}</td>
					<td>${element.itemName}</td>
					<td>${element.itemQuality}</td>
					<td>\$${element.itemCurrentPrice}</td>
					<td>\$${element.itemOriginalPrice}</td>
					<td>${element.itemAppliedPromotion}</td>
					<td>${element.itemDiscount === 0 ? "No Discount" : element.itemDiscount + "% OFF"}</td>
					<td>
						<i class="bx bx-trash delete" aria-label="Delete" onclick="removeItemFromStore(${element.itemID}, ${storeID})"></i>
					</td>
				</tr>
			`;
		});
	} else {
		storeItemsDetailsTable.innerHTML = `<p>There are no items left in the store.</p>`;
	}

	const storeItemsDetails = document.querySelector("[data-store-items-details]");
	storeItemsDetails?.classList.add("openedModal");

	showModal();
}

function hideStoreItemsDetails() {
	const storeItemsDetails = document.querySelector("[data-store-items-details]");
	storeItemsDetails?.classList.remove("openedModal");

	resetStoreItemsDetails();
	hideModal();
}

async function removeItemFromStore(itemID, storeID) {
	const response = await fetch("/store-items/delete-store-item", {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ storeID: storeID, itemID: itemID }),
	});

	if (response.ok) {
		const storeItemsDetailsData = await fetchStoreItemDetails(storeID);
		if (storeItemsDetailsData.length > 0) {
			localStorage.setItem("storeItemsState", storeID);
		}
		window.location.reload();
	} else {
		console.error(`Failed to delete item ${itemID} in store`);
	}
}

/* =================================================================================================== */
/* =================================================================================================== */
/* View Match Details Section Below ------------------------------------------------------------------ */
/* =================================================================================================== */
/* =================================================================================================== */

async function showMatchDetailsModal(matchID) {
	const matchIDText = document.querySelector("[data-match-id]");
	const matchStartTimeText = document.querySelector("[data-match-start-time]");
	const matchEndTimeText = document.querySelector("[data-match-end-time]");
	const matchWinnerText = document.querySelector("[data-match-winner]");

	const matchBasicInfo = await fetchMatchBasicInfo(matchID);
	if (matchBasicInfo) {
		matchIDText.innerHTML = "Match ID: " + matchID;
		matchStartTimeText.innerHTML = "Start Time: " + matchBasicInfo.matchStartTime;
		matchEndTimeText.innerHTML = "End Time: " + matchBasicInfo.matchEndTime;
		matchWinnerText.innerHTML = "Winner: " + matchBasicInfo.matchWinner;
	}

	const matchPlayersList = document.querySelector("[data-match-players-list]");
	const matchPlayersInfo = await fetchMatchPlayersInfo(matchID);
	if (matchPlayersInfo) {
		matchPlayersInfo.forEach((element) => {
			const player = document.createElement("li");
			player.innerHTML = element.username + " (" + element.country.toUpperCase() + ")";
			matchPlayersList.appendChild(player);
		});
	}

	const matchDetailsTableBody = document.querySelector("[data-match-details-table-body]");
	matchDetailsTableBody.innerHTML = "";

	// Add System Start Row
	const startRow = document.createElement("tr");

	const startTimeCell = document.createElement("td");
	startTimeCell.textContent = matchBasicInfo.matchStartTime;
	startRow.appendChild(startTimeCell);

	const startSystemCell = document.createElement("td");
	startSystemCell.textContent = "System";
	startRow.appendChild(startSystemCell);

	const startGameCell = document.createElement("td");
	startGameCell.textContent = "Game Start";
	startRow.appendChild(startGameCell);

	const startAdditionalInfoCell = document.createElement("td");
	startRow.appendChild(startAdditionalInfoCell);

	const startCardsInHandCell = document.createElement("td");
	startRow.appendChild(startCardsInHandCell);

	const startCardsInDeckCell = document.createElement("td");
	startCardsInDeckCell.textContent = "Full";
	startRow.appendChild(startCardsInDeckCell);

	const startDirectionCell = document.createElement("td");
	startDirectionCell.textContent = "Clockwise";
	startRow.appendChild(startDirectionCell);

	const startNextTurnCell = document.createElement("td");
	startNextTurnCell.textContent = matchPlayersInfo[0].username;
	startRow.appendChild(startNextTurnCell);
	matchDetailsTableBody.appendChild(startRow);

	const matchDetails = await fetchMatchDetails(matchID);

	if (matchDetails) {
		// Add Match Details Rows
		matchDetails.forEach((element) => {
			const row = document.createElement("tr");

			const timeCell = document.createElement("td");
			timeCell.textContent = element.timestamp;
			row.appendChild(timeCell);

			const playerCell = document.createElement("td");
			playerCell.textContent = element.username;
			row.appendChild(playerCell);

			const actionCell = document.createElement("td");
			actionCell.textContent = element.action;
			row.appendChild(actionCell);

			const additionalInfoCell = document.createElement("td");
			additionalInfoCell.innerHTML = element.additionalInfo;
			row.appendChild(additionalInfoCell);

			const cardsInHandCell = document.createElement("td");
			cardsInHandCell.textContent = element.cardInHand;
			row.appendChild(cardsInHandCell);

			const cardsInDeckCell = document.createElement("td");
			cardsInDeckCell.textContent = element.cardInDeck;
			row.appendChild(cardsInDeckCell);

			const directionCell = document.createElement("td");
			directionCell.textContent = element.currentDirection;
			row.appendChild(directionCell);

			const nextTurnCell = document.createElement("td");
			nextTurnCell.textContent = element.nextTurn;
			row.appendChild(nextTurnCell);

			matchDetailsTableBody.appendChild(row);
		});

		// Add System End Row
		const endRow = document.createElement("tr");

		const endTimeCell = document.createElement("td");
		endTimeCell.textContent = matchBasicInfo.matchEndTime;
		endRow.appendChild(endTimeCell);

		const endPlayerCell = document.createElement("td");
		endPlayerCell.textContent = "System";
		endRow.appendChild(endPlayerCell);

		const endActionCell = document.createElement("td");
		endActionCell.textContent = "Game End";
		endRow.appendChild(endActionCell);

		const endAdditionalInfoCell = document.createElement("td");
		endRow.appendChild(endAdditionalInfoCell);

		const endCardsInHandCell = document.createElement("td");
		endRow.appendChild(endCardsInHandCell);

		const endCardsInDeckCell = document.createElement("td");
		endCardsInDeckCell.textContent = matchDetails[matchDetails.length - 1].cardInDeck;
		endRow.appendChild(endCardsInDeckCell);

		const endDirectionCell = document.createElement("td");
		endDirectionCell.textContent = matchDetails[matchDetails.length - 1].currentDirection;
		endRow.appendChild(endDirectionCell);

		const endNextTurnCell = document.createElement("td");
		endRow.appendChild(endNextTurnCell);

		matchDetailsTableBody.appendChild(endRow);
	}

	const matchDetailsModal = document.querySelector("[data-match-detials]");
	matchDetailsModal.classList.add("openedModal");
}

function hideMatchDetailsModal() {
	const matchDetailsModal = document.querySelector("[data-match-detials]");
	matchDetailsModal.classList.remove("openedModal");

	resetMatchDetails();
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
}

function initalizingForStoringFormData() {
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
}

function displayModalErrorMessage(modalType, message) {
	const modalErrorMessage = document.querySelector(`${modalType} [data-modal-error-message]`);
	if (modalErrorMessage) {
		modalErrorMessage.innerHTML = `&#9888; ${message}`;
		modalErrorMessage.style.display = "flex";
	}
}

function hideModalErrorMessage(modalType) {
	const modalErrorMessage = document.querySelector(`${modalType} [data-modal-error-message]`);
	if (modalErrorMessage) {
		modalErrorMessage.innerHTML = "";
		modalErrorMessage.style.display = "none";
	}
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

function resetStoreItemsDetails() {
	const storeItemsDetailsTable = document.querySelector("[data-store-item-details-table]");
	storeItemsDetailsTable.innerHTML = "";
}

function clearFormData() {
	localStorage.removeItem("formData");
}

function isDurationValid(modalType) {
	const membershipDuration = document.querySelector(`${modalType} [data-duration]`).value;
	currentDate = new Date();
	expireDate = new Date(new Date().getTime() + membershipDuration * 24 * 60 * 60 * 1000);
	return isNaN(expireDate);
}

async function initalizePrivilegeLevelForMembership(modalType) {
	const privilegeLevelInput = document.querySelector(`${modalType} [data-privilege-level]`);
	const privilegeClassInput = document.querySelector(`${modalType} [data-privilege-class]`);

	const privilegeClass = await fetchPrivilegeClass(privilegeLevelInput.value);
	privilegeClassInput.innerHTML = privilegeClass;

	privilegeLevelInput.addEventListener("change", async () => {
		const privilegeClass = await fetchPrivilegeClass(privilegeLevelInput.value);

		privilegeClassInput.innerHTML = privilegeClass;
	});
}

async function initalizeAppliedPromotionForItem(modalType) {
	const appliedPromotionInput = document.querySelector(`${modalType} [data-applied-promotion]`);
	const discountInput = document.querySelector(`${modalType} [data-discount]`);

	const discount = await fetchItemDiscount(appliedPromotionInput.value);
	if (discount === 0) {
		discountInput.innerHTML = "";
	} else {
		discountInput.innerHTML = `${discount}% OFF`;
	}

	appliedPromotionInput.addEventListener("change", async () => {
		const discount = await fetchItemDiscount(appliedPromotionInput.value);
		if (discount === 0) {
			discountInput.innerHTML = "";
		} else {
			discountInput.innerHTML = `${discount}% OFF`;
		}
	});
}

function resetMatchDetails() {
	const matchPlayersList = document.querySelector("[data-match-players-list]");
	matchPlayersList.innerHTML = "";
}

function initializeDefaultTemplatesForMatch() {
	const numOfPlayerDropdown = document.querySelector("[data-create-match-modal] [data-number-of-players]");
	handlePlayerCountChangeForMatch({ target: numOfPlayerDropdown });
}

function handlePlayerCountChangeForMatch(e) {
	const modalBody = document.querySelector("[data-create-match-modal] .modal-body");
	const template = document.getElementById("modal-fields-template");

	hideModalErrorMessage("[data-create-match-modal]");

	document.querySelectorAll("[data-template-generated]").forEach((element) => {
		element.remove();
	});

	for (let i = 1; i <= e.target.value; i++) {
		const modalFields = template.content.cloneNode(true);

		const modalLabel = modalFields.querySelector("label");
		modalLabel.innerText = `Username of Player ${i}:`;
		modalLabel.setAttribute("for", `usernameCreate${i}`);

		const modalInput = modalFields.querySelector("input");
		modalInput.id = `usernameCreate${i}`;
		modalInput.name = `username${i}`;

		modalBody.append(modalFields);
	}
}

// Helper Function to Fetch PlayerID in Any Modal
async function fetchPlayerID(modalType) {
	const username = document.querySelector(`${modalType} [data-username]`).value;
	const response = await fetch(`/dashboard/fetch-playerID?username=${username}`);
	if (response.ok) {
		return response.json();
	}
	return null;
}

// Helper Function to Fetch Store Item Details
async function fetchStoreItemDetails(storeID) {
	const response = await fetch(`/store-items/fetch-store-items-details?storeID=${storeID}`);
	if (response.ok) {
		return response.json();
	}
	return null;
}

// Helper Function to Fetch Discount Data in Store-Items
async function fetchItemDiscount(appliedPromotion) {
	const response = await fetch(`/store-items/fetch-discount?appliedPromotion=${appliedPromotion}`);
	if (response.ok) {
		return response.json();
	}
	return null;
}

// Helper Function to Fetch Privilege Class in Store-Items
async function fetchPrivilegeClass(privilegeLevel) {
	const response = await fetch(`/memberships/fetch-privilege-class?privilegeLevel=${privilegeLevel}`);
	if (response.ok) {
		return response.json();
	}
	return null;
}

// Helper Function to Fetch Match Details in Matches
async function fetchMatchDetails(matchID) {
	const response = await fetch(`/matches/fetch-match-details?matchID=${matchID}`);
	if (response.ok) {
		return response.json();
	} else {
		return null;
	}
}

// Helper Function to Fetch Basic Match Information in Matches
async function fetchMatchBasicInfo(matchID) {
	const response = await fetch(`/matches/fetch-match-basic-info?matchID=${matchID}`);
	if (response.ok) {
		return response.json();
	} else {
		return null;
	}
}

// Helper Function to Fetch Player Information in Matches
async function fetchMatchPlayersInfo(matchID) {
	const response = await fetch(`/matches/fetch-match-players-info?matchID=${matchID}`);
	if (response.ok) {
		return response.json();
	} else {
		return null;
	}
}

// Helper Fuction to Fetch Player Data to Display in Edit Player Modal
async function fetchPlayerData(playerID) {
	const response = await fetch(`/dashboard/edit-modal/fetch-data?playerID=${playerID}`);
	if (response.ok) {
		return response.json();
	}
	return null;
}

// Helper Function to Fetch Item Data to Display in Edit Items Modal
async function fetchItemData(itemID) {
	const response = await fetch(`/store-items/edit-modal/fetch-data?itemID=${itemID}`);
	if (response.ok) {
		return response.json();
	}
	return null;
}

// Helper Function to Fetch Membership Data to Display in Edit Membership Modal
async function fetchMembershipData(playerID) {
	const response = await fetch(`/memberships/edit-modal/fetch-data?playerID=${playerID}`);
	if (response.ok) {
		return response.json();
	}
	return null;
}

// Helper Function to Fetch Event Data to Display in Edit Event Modal
async function fetchEventData(eventID) {
	const response = await fetch(`/events/edit-modal/fetch-data?eventID=${eventID}`);
	if (response.ok) {
		return response.json();
	}
	return null;
}

// Helper Function to Check Username Availability in Dashboard
async function isUsernameAvailable(modalType) {
	const username = document.querySelector(`${modalType} [data-username]`).value;
	const response = await fetch(`/dashboard/check-input?username=${username}`);
	return response.ok;
}

// Helper Function to Check Username Availability in Dashboard
async function isEmailAvailable(modalType) {
	const email = document.querySelector(`${modalType} [data-email]`).value;
	const response = await fetch(`/dashboard/check-input?email=${email}`);
	return response.ok;
}

// Helper Function to Check Item Name Availability in Store-Items
async function isItemNameAvailable(modalType) {
	const itemName = document.querySelector(`${modalType} [data-name]`).value;
	const response = await fetch(`/store-items/check-input?itemName=${itemName}`);
	return response.ok;
}

// Helper Function to Check Whether the Item can be Inserted in Insert Item Modal
async function isItemNotInPlayerStore(itemID, playerID) {
	const response = await fetch(`/store-items/check-input?itemID=${itemID}&playerID=${playerID}`);
	return response.ok;
}

// Helper Function to Check Whether the Membership can be Created in Create Membership Modal
async function isUserWithoutMembership(modalType) {
	const username = document.querySelector(`${modalType} [data-username]`).value;
	const response = await fetch(`/memberships/create-modal/check-membership?username=${username}`);
	return response.ok;
}

// Helper Function to Check Event Name Availability in Events
async function isEventNameAvailable(modalType) {
	const eventName = document.querySelector(`${modalType} [data-name]`).value;
	const response = await fetch(`/events/check-input?eventName=${eventName}`);
	return response.ok;
}

// Helper Function to Validate Multiple Usernames in Matches
async function validateUsernames(usernames) {
	const invalidUsernames = [];

	await Promise.all(
		usernames.map(async (username) => {
			const response = await fetch(`/dashboard/fetch-playerID?username=${username}`);
			if (!response.ok) {
				invalidUsernames.push(username);
			}
		})
	);

	return invalidUsernames;
}
