const dashboardModel = require("../models/dashboard");

const logError = (functionName) => `OH NO! Error with ${functionName} in Controllers:`;
const resError = (functionName) => `OH NO! Internal Server Error with ${functionName} in Controllers:`;

exports.loadDashboard = async (req, res) => {
  if (!req.loginStatus) {
    return res.redirect("/login");
  }

  try {
    const [activePlayers, activeEvents, activeMatches, revenue, recentPlayers] = await Promise.all([
      dashboardModel.getNumOfActivePlayers(),
      dashboardModel.getNumOfActiveEvents(),
      dashboardModel.getNumOfActiveMatches(),
      dashboardModel.getRevenue(),
      dashboardModel.getRecentPlayers(),
    ]);

    res.render("dashboard", {
      activePlayers,
      activeEvents,
      activeMatches,
      revenue,
      recentPlayers,
    });
  } catch (error) {
    console.error(logError("loadDashboard"), error);
    res.status(500).send(resError("loadDashboard"));
  }
};

exports.deletePlayer = async (req, res) => {
  const { item: username } = req.body;

  try {
    await dashboardModel.deletePlayerByUsername(username);

    res.status(200).send(`OH YES! ${username} Deleted Successfully!`);
  } catch (error) {
    console.error(logError("deletePlayer"), error);
    res.status(500).send(resError("deletePlayer"));
  }
};

exports.loadEditModal = async (req, res) => {
  const { playerID } = req.query;

  try {
    const results = await dashboardModel.getPlayerDataByID(playerID);

    res.status(200).json(results);
  } catch (error) {
    console.error(logError("loadEditModal"), error);
    res.status(500).send(resError("loadEditModal"));
  }
};

exports.updatePlayer = async (req, res) => {
  const { playerID, username, email, newPassword, confirmPassword, country } = req.body;

  try {
    const results = await dashboardModel.getPlayerDataByID(playerID);
    const updates = {};

    if (username !== results.username) {
      updates.username = username;
    }

    if (email !== results.email) {
      updates.email = email;
    }

    if (country !== results.country) {
      updates.country = country;
    }

    if (newPassword) {
      updates.password = newPassword;
    }

    if (updates.username || updates.email) {
      await dashboardModel.updatePlayerUsernameAndEmail(updates.username || results.username, updates.email || results.email, results.username);
      delete updates.username;
      delete updates.email;
    }

    if (Object.keys(updates).length > 0) {
      await dashboardModel.updatePlayerByID(playerID, updates);
    }

    res.redirect("/dashboard");
  } catch (error) {
    console.error(logError("updatePlayer"), error);
    res.status(500).send(resError("updatePlayer"));
  }
};

exports.loadCreateModal = async (req, res) => {
  const { username, email } = req.query;

  try {
    const usernameAvailable = await dashboardModel.isUsernameAvailable(username);
    const emailAvailable = await dashboardModel.isEmailAvailable(email);

    if (!usernameAvailable) {
      return res.status(409).send(`OH NO! ${username} already taken!`);
    }

    if (!emailAvailable) {
      return res.status(409).send(`OH NO! ${email} already taken!`);
    }

    return res.status(200).send("OH YES! Username and Email Available");
  } catch (error) {
    console.error(logError("loadCreateModal"), error);
    res.status(500).send(resError("loadCreateModal"));
  }
};

exports.registerPlayer = async (req, res) => {
  const { username, password, confirmPassword, email, country } = req.body;

  try {
    await dashboardModel.registerPlayer(username, password, email, country);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(logError("registerPlayer"), error);
    res.status(500).send(resError("registerPlayer"));
  }
};
