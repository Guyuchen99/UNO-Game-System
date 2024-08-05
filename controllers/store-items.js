const dashboardModel = require("../models/dashboard");
const storeItemsModel = require("../models/store-items");

const logError = (functionName) => `OH NO! Error with ${functionName} in Store-Items Controllers:`;
const resError = (functionName) => `OH NO! Internal Server Error with ${functionName} in Store-Items Controllers:`;

exports.loadStoreItems = async (req, res) => {
	if (!req.loginStatus === true) {
		return res.redirect("/login");
	}

	const { order } = req.query;

	try {
		const recentStores = await storeItemsModel.getAllStores();
		const recentItems = await storeItemsModel.getAllItems(order);

		res.render("store-items", { recentStores, recentItems });
	} catch (error) {
		console.error(logError("loadStoreItems"), error);
		res.status(500).send(resError("loadStoreItems"));
	}
};

exports.fetchStoreItemsDetail = async (req, res) => {
	const { storeID } = req.query;

	try {
		const results = await storeItemsModel.getStoreItemsDetailsByStoreID(storeID);

		res.status(200).json(results);
	} catch (error) {
		console.error(logError("fetchStoreItemsDetail"), error);
		res.status(500).send(resError("fetchStoreItemsDetail"));
	}
};

exports.fetchDiscount = async (req, res) => {
	const { appliedPromotion } = req.query;

	try {
		const results = await storeItemsModel.getDiscountByAppliedPromotion(appliedPromotion);

		if (results == null) {
			return res.status(404).send(`OH NO! Discount for ${appliedPromotion} does not exist!`);
		}

		return res.status(200).json(results);
	} catch (error) {
		console.error(logError("fetchDiscount"), error);
		res.status(500).send(resError("fetchDiscount"));
	}
};

exports.fetchItemData = async (req, res) => {
	const { itemID } = req.query;

	try {
		const results = await storeItemsModel.getItemDataByID(itemID);

		res.status(200).json(results);
	} catch (error) {
		console.error(logError("fetchItemData"), error);
		res.status(500).send(resError("fetchItemData"));
	}
};

exports.checkFormInput = async (req, res) => {
	const { itemName, itemID, playerID } = req.query;

	try {
		const itemNameAvailable = await storeItemsModel.isItemNameAvailable(itemName);

		if (!itemNameAvailable) {
			return res.status(409).send("OH NO! Item Name already taken!");
		}

		const itemNotInPlayerStore = await storeItemsModel.isItemNotInPlayerStore(playerID, itemID);

		if (!itemNotInPlayerStore) {
			return res.status(409).send(`OH NO! Item already in the store!`);
		}

		return res.status(200).send("OH YES! No Errors in Form Input!");
	} catch (error) {
		console.error(logError("checkFormInput"), error);
		res.status(500).send(resError("checkFormInput"));
	}
};

exports.insertItem = async (req, res) => {
	const { itemID, username } = req.body;

	try {
		const playerID = await dashboardModel.getPlayerIDByUsername(username);
		const storeID = await storeItemsModel.getStoreIDByPlayerID(playerID);

		await storeItemsModel.insertItem(storeID, itemID);
		res.status(200).redirect("/store-items");
	} catch (error) {
		console.error(logError("insertItem"), error);
		res.status(500).send(resError("insertItem"));
	}
};

exports.updateItem = async (req, res) => {
	const { itemID, name, quality, appliedPromotion } = req.body;

	try {
		const results = await storeItemsModel.getItemDataByID(itemID);
		const updates = {};

		if (name !== results.itemName) {
			updates.name = name;
		}

		if (quality !== results.itemQuality) {
			updates.quality = quality;
		}

		if (appliedPromotion !== results.itemAppliedPromotion) {
			updates.applied_promotion = appliedPromotion;
		}

		if (updates.quality || updates.applied_promotion) {
			const originalPrice = await storeItemsModel.getOriginalPriceByQuality(quality);
			const discount = await storeItemsModel.getDiscountByAppliedPromotion(appliedPromotion);

			updates.current_price = originalPrice * (1 - discount / 100);
		}

		if (Object.keys(updates).length > 0) {
			await storeItemsModel.updateItemByID(itemID, updates);
		}

		res.status(200).redirect("/store-items");
	} catch (error) {
		console.error(logError("updateItem"), error);
		res.status(500).send(resError("updateItem"));
	}
};

exports.registerItem = async (req, res) => {
	const { name, quality, appliedPromotion } = req.body;

	try {
		const originalPrice = await storeItemsModel.getOriginalPriceByQuality(quality);
		const discount = await storeItemsModel.getDiscountByAppliedPromotion(appliedPromotion);
		const currentPrice = originalPrice * (1 - discount / 100);

		await storeItemsModel.registerItem(name, quality, appliedPromotion, currentPrice);
		res.status(200).redirect("/store-items");
	} catch (error) {
		console.error(logError("registerItem"), error);
		res.status(500).send(resError("registerItem"));
	}
};

exports.deleteItem = async (req, res) => {
	const { item: itemID } = req.body;

	try {
		await storeItemsModel.deleteItemByID(itemID);

		res.status(200).send("OH YES! Item Deleted Successfully");
	} catch (error) {
		console.error(logError("deleteItem"), error);
		res.status(500).send(resError("deleteItem"));
	}
};

exports.deleteStoreItem = async (req, res) => {
	const { storeID, itemID } = req.body;

	try {
		await storeItemsModel.deleteStoreItem(storeID, itemID);

		res.status(200).send(`OH YES! Item Deleted Successfully From Store`);
	} catch (error) {
		console.error(logError("deleteStoreItem"), error);
		res.status(500).send(resError("deleteStoreItem"));
	}
};
