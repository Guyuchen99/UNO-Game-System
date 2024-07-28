const eventsModel = require("../models/events");

exports.loadEvents = async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const recentEvents = await eventsModel.getRecentEvents();

      res.render("events", { recentEvents });
    } catch (error) {
      console.error("OH NO! Error Loading Events:", error);
      res.status(500).send("OH NO! Internal Server Error with Loading Events");
    }
  } else {
    res.redirect("/login");
  }
};
