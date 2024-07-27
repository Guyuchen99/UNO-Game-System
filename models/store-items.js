const db = require("../config/db");

const getRecentStores = async () => {
  try {
    const [results] = await db.promise().query(`
        Select 
            p.player_id, 
            p.username, 
            s.store_id, 
            s.num_of_items
        FROM Stores s
        JOIN Players p ON s.player_id = p.player_id
        ORDER BY player_id DESC LIMIT 3; 
    `);
    return results;
  } catch (error) {
    console.error("OH NO! Error fetching recent stores:", error.message);
    throw error;
  }
};

const getRecentItems = async () => {
  try {
    const [results] = await db.promise().query(`
        SELECT 
            i.name,
            i.quality,
            i.current_price,
            iop.original_price,
            i.applied_promotion,
            id.discount
        FROM 
            Items i
        JOIN ItemOriginalPrice iop ON i.quality = iop.quality
        JOIN ItemDiscount id ON i.applied_promotion = id.applied_promotion
        ORDER BY item_id DESC LIMIT 4; 
      `);
    return results;
  } catch (error) {
    console.error("OH NO! Error fetching recent items:", error.message);
    throw error;
  }
};

exports.getStoreData = async () => {
  const recentStores = await getRecentStores();

  return {
    recentStores: recentStores.map((element) => ({
      storeId: element.store_id,
      numOfItems: element.num_of_items,
      playerId: element.player_id,
      username: element.username,
    })),
  };
};

exports.getItemData = async () => {
  const recentItems = await getRecentItems();

  return {
    recentItems: recentItems.map((element) => ({
      itemName: element.name,
      itemQuality: element.quality,
      itemCurrentPrice: "$" + element.current_price,
      itemOriginalPrice: "$" + element.original_price,
      itemAppliedPromotion: element.applied_promotion,
      itemDiscount: element.discount + "% OFF",
    })),
  };
};
