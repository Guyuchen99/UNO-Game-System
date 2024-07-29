const dashboardModel = require("../models/dashboard");

exports.loadDashboard = async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const activePlayers = await dashboardModel.getNumOfActivePlayers();
      const activeEvents = await dashboardModel.getNumOfActiveEvents();
      const activeMatches = await dashboardModel.getNumOfActiveMatches();
      const revenue = await dashboardModel.getRevenue();
      const recentPlayers = await dashboardModel.getRecentPlayers();

      res.render("dashboard", {
        activePlayers,
        activeEvents,
        activeMatches,
        revenue,
        recentPlayers,
        messages: req.flash(),
      });
    } catch (error) {
      console.error("OH NO! Error Loading Dashboard:", error);
      res.status(500).send("OH NO! Internal Server Error with Loading Dashboard");
    }
  } else {
    res.redirect("/login");
  }
};

exports.registerPlayer = async (req, res) => {
  const { username, password, email, country } = req.body;

  try {
    if (!username || !password || !email || !country) {
      throw new Error("Form Incomplete... Please try again!");
    }
    await dashboardModel.registerPlayer(username, password, email, country);
    return res.redirect("/dashboard?status=success");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/dashboard");
  }
};

exports.deletePlayer = async (req, res) => {
  const { username } = req.body;

  try {
    await dashboardModel.deletePlayerByUsername(username);

    res.status(200).send(`${username} deleted successfully`);
  } catch (error) {
    console.error(`OH NO! Error Deleting ${username}:`, error);
    res.status(500).send("OH NO! Internal Server Error with Delete Player");
  }
};
