const db = require("../config/db");

const logError = (functionName) => `OH NO! Error with ${functionName} in Store-Items Models:`;

exports.getAllStores = async () => {
	try {
		const [results] = await db.promise().query(`
			Select 
				s.store_id AS storeID, 
				s.num_of_items AS numOfItems,
				p.username AS username, 
				p.player_id AS playerID
			FROM Stores s
			JOIN Players p ON s.player_id = p.player_id
			ORDER BY s.player_id DESC
    	`);

		return results;
	} catch (error) {
		console.error(logError("getAllStores"), error);
		throw error;
	}
};

exports.getAllItems = async (order) => {
	let orderByClause;

	switch (order) {
		case "recent":
			orderByClause = "i.item_id DESC";
			break;
		case "quality":
			orderByClause = "iop.original_price DESC";
			break;
		case "currentPrice":
			orderByClause = "i.current_price DESC";
			break;
		case "discount":
			orderByClause = "id.discount DESC";
			break;
		default:
			orderByClause = "i.item_id DESC";
	}

	try {
		const [results] = await db.promise().query(`
			SELECT 
				i.item_id AS itemID,
				i.name AS itemName, 
				i.quality AS itemQuality, 
				i.current_price AS itemCurrentPrice, 
				iop.original_price AS itemOriginalPrice, 
				i.applied_promotion AS itemAppliedPromotion,
				id.discount AS itemDiscount
			FROM Items i
			JOIN ItemOriginalPrice iop ON i.quality = iop.quality
			JOIN ItemDiscount id ON i.applied_promotion = id.applied_promotion
			ORDER BY ${orderByClause} 
    	`);

		return results.map((element) => ({
			itemID: element.itemID,
			itemName: element.itemName,
			itemQuality: element.itemQuality,
			itemCurrentPrice: "$" + element.itemCurrentPrice,
			itemOriginalPrice: "$" + element.itemOriginalPrice,
			itemAppliedPromotion: element.itemAppliedPromotion,
			itemDiscount: element.itemDiscount === 0 ? "No Discount" : element.itemDiscount + "% OFF",
		}));
	} catch (error) {
		console.error(logError("getAllItems"), error);
		throw error;
	}
};

exports.getStoreItemsDetailsByStoreID = async (storeID) => {
	try {
		const myQuery = `
			SELECT 
				i.item_id AS itemID, 
				i.name AS itemName, 
				i.quality AS itemQuality, 
				i.current_price AS itemCurrentPrice, 
				i.applied_promotion AS itemAppliedPromotion, 
				iop.original_price AS itemOriginalPrice, 
				id.discount AS itemDiscount
			FROM Items i
			JOIN ItemOriginalPrice iop ON i.quality = iop.quality
			JOIN ItemDiscount id ON i.applied_promotion = id.applied_promotion
			JOIN StoreSellItems ssi ON i.item_id = ssi.item_id
			WHERE ssi.store_id = ?
			ORDER BY i.item_id
    	`;

		const [results] = await db.promise().query(myQuery, [storeID]);

		return results;
	} catch (error) {
		console.error(logError("getStoreItemsByStoreID"), error);
		throw error;
	}
};

exports.getDiscountByAppliedPromotion = async (appliedPromotion) => {
	try {
		const myQuery = `
			SELECT 
				id.discount AS itemDiscount
			FROM ItemDiscount id
			WHERE applied_promotion = ?
    	`;

		const [results] = await db.promise().query(myQuery, [appliedPromotion]);

		return results[0]?.itemDiscount;
	} catch (error) {
		console.error(logError("getDiscountByAppliedPromotion"), error);
		throw error;
	}
};

exports.getOriginalPriceByQuality = async (quality) => {
	try {
		const myQuery = `
			SELECT 
				iop.original_price AS itemOriginalPrice
			FROM ItemOriginalPrice iop
			WHERE quality = ?
    	`;

		const [results] = await db.promise().query(myQuery, [quality]);

		return results[0]?.itemOriginalPrice;
	} catch (error) {
		console.error(logError("getOriginalPriceByQuality"), error);
		throw error;
	}
};

exports.getStoreIDByPlayerID = async (playerID) => {
	try {
		const [results] = await db.promise().query("SELECT store_id FROM Stores WHERE player_id = ?", [playerID]);

		return results[0]?.store_id;
	} catch (error) {
		console.error(logError("getStoreIDByPlayerID"), error);
		throw error;
	}
};

exports.getItemDataByID = async (itemID) => {
	try {
		const myQuery = `
			SELECT 
				i.item_id AS itemID, 
				i.name AS itemName, 
				i.quality AS itemQuality, 
				i.applied_promotion AS itemAppliedPromotion
			FROM Items i
			WHERE item_id = ?
    	`;

		const [results] = await db.promise().query(myQuery, [itemID]);

		return results[0];
	} catch (error) {
		console.error(logError("getItemDataByID"), error);
		throw error;
	}
};

exports.isItemNameAvailable = async (itemName) => {
	try {
		const [results] = await db.promise().query("SELECT * FROM Items WHERE name = ?", [itemName]);

		return results.length === 0;
	} catch (error) {
		console.error(logError("isItemNameAvailable"), error);
		throw error;
	}
};

exports.isItemNotInPlayerStore = async (playerID, itemID) => {
	try {
		const myQuery = `
			SELECT * 
			FROM StoreSellItems 
  			WHERE store_id = (SELECT store_id FROM Stores WHERE player_id = ?) AND item_id = ?
		`;

		const [results] = await db.promise().query(myQuery, [playerID, itemID]);

		return results.length === 0;
	} catch (error) {
		console.error(logError("isItemNotInPlayerStore"), error);
		throw error;
	}
};

exports.insertItem = async (storeID, itemID) => {
	try {
		await db.promise().query("INSERT INTO StoreSellItems SET ?", {
			store_id: storeID,
			item_id: itemID,
		});

		updateNumOfItemsInStore();
		console.log("OH YES! Item Registered Successfully!");
	} catch (error) {
		console.error(logError("registerItem"), error);
		throw error;
	}
};

exports.updateItemByID = async (itemID, updates) => {
	try {
		const columnNames = Object.keys(updates);
		const columnValues = Object.values(updates);
		const setClause = columnNames.map((element) => `${element} = ?`).join(", ");

		if (setClause) {
			const myQuery = `UPDATE Items SET ${setClause} WHERE item_id = ?`;
			columnValues.push(itemID);

			await db.promise().query(myQuery, columnValues);
			console.log("OH YES! Item Updated Successfully!");
		}
	} catch (error) {
		console.error(logError("updateItemByID"), error);
		throw error;
	}
};

exports.registerStore = async (playerID) => {
	try {
		await db.promise().query("INSERT INTO Stores SET ?", {
			player_id: playerID,
		});
		console.log("OH YES! Store Registered Successfully!");
	} catch (error) {
		console.error(logError("registerStore"), error);
		throw error;
	}
};

exports.registerItem = async (name, quality, appliedPromotion, currentPrice) => {
	try {
		await db.promise().query("INSERT INTO Items SET ?", {
			name: name,
			quality: quality,
			applied_promotion: appliedPromotion,
			current_price: currentPrice,
		});
		console.log("OH YES! Item Registered Successfully!");
	} catch (error) {
		console.error(logError("registerItem"), error);
		throw error;
	}
};

exports.deleteItemByID = async (itemID) => {
	try {
		await db.promise().query("DELETE FROM Items WHERE item_id = ?", [itemID]);
		updateNumOfItemsInStore();

		console.log("OH YES! Item Deleted Successfully!");
	} catch (error) {
		console.error(logError("deleteItemByID"), error);
		throw error;
	}
};

exports.deleteStoreItem = async (storeID, itemID) => {
	try {
		await db.promise().query(`DELETE FROM StoreSellItems WHERE store_id = ? AND item_id = ?`, [storeID, itemID]);
		updateNumOfItemsInStore();

		console.log("OH YES! Item From Store Deleted Successfully!");
	} catch (error) {
		console.error(logError("deleteItemByID"), error);
		throw error;
	}
};

const updateNumOfItemsInStore = async () => {
	try {
		await db.promise().query("SET SQL_SAFE_UPDATES = 0");

		await db.promise().query(`
			UPDATE Stores 
			SET num_of_items = (
				SELECT COUNT(*)
				FROM StoreSellItems
				WHERE StoreSellItems.store_id = Stores.store_id
			);
		`);

		await db.promise().query("SET SQL_SAFE_UPDATES = 1");

		console.log("OH YES! Number of Items in Store Updated Successfully!");
	} catch (error) {
		console.error(logError("updateNumOfItemsInStore"), error);
		throw error;
	}
};
