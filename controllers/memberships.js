const membershipsModel = require("../models/memberships");

exports.loadMemberships = async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const recentMemberships = await membershipsModel.getRecentMemberships();

      res.render("memberships", { recentMemberships });
    } catch (error) {
      console.error("OH NO! Error Loading Memberships:", error);
      res.status(500).send("OH NO! Internal Server Error with Loading Memberships");
    }
  } else {
    res.redirect("/login");
  }
};
