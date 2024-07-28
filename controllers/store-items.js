const storeItemsModel = require("../models/store-items");

exports.loadStoreItems = async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const recentStores = await storeItemsModel.getRecentStores();
      const recentItems = await storeItemsModel.getRecentItems();

      res.render("store-items", { recentStores, recentItems });
    } catch (error) {
      console.error("OH NO! Error Loading Store Items:", error);
      res.status(500).send("OH NO! Internal Server Error with Loading Store Items");
    }
  } else {
    res.redirect("/login");
  }
};
