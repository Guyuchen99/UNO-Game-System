const matchesModel = require("../models/matches");

exports.loadMatches = async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const recentMatches = await matchesModel.getRecentMatches();

      res.render("matches", { recentMatches });
    } catch (error) {
      console.error("OH NO! Error Loading Matches:", error);
      res.status(500).send("OH NO! Internal Server Error with Loading Matches");
    }
  } else {
    res.redirect("/login");
  }
};
