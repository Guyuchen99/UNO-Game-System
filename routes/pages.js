const express = require("express");
const authController = require("../controllers/auth");
const { getTotalPlayers, getRecentPlayers } = require("../models/dashboard");

const router = express.Router();

// Helper function to get player data
const getPlayerData = async () => {
  const totalPlayers = await getTotalPlayers();
  const recentPlayers = await getRecentPlayers();

  return {
    totalPlayers,
    recentPlayers: recentPlayers.map((player) => ({
      username: player.username,
      totalWin: player.total_win,
      totalGameCount: player.total_game_count,
      experience: player.experience_point,
      country: player.country,
    })),
  };
};

router.get("/login", authController.isLoggedIn, (req, res) => {
  if (req.loginStatus === true) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});

router.get("/", authController.isLoggedIn, async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const { totalPlayers, recentPlayers } = await getPlayerData();
      res.render("index", {
        totalPlayers,
        recentPlayers,
      });
    } catch (error) {
      console.error("Error Fetching Data:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/memberships", authController.isLoggedIn, async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const { totalPlayers, recentPlayers } = await getPlayerData();
      res.render("memberships", {
        totalPlayers,
        recentPlayers,
      });
    } catch (error) {
      console.error("Error Fetching Data:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/store-items", authController.isLoggedIn, async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const { totalPlayers, recentPlayers } = await getPlayerData();
      res.render("store-items", {
        totalPlayers,
        recentPlayers,
      });
    } catch (error) {
      console.error("Error Fetching Data:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/events", authController.isLoggedIn, async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const { totalPlayers, recentPlayers } = await getPlayerData();
      res.render("events", {
        totalPlayers,
        recentPlayers,
      });
    } catch (error) {
      console.error("Error Fetching Data:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/matches", authController.isLoggedIn, async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const { totalPlayers, recentPlayers } = await getPlayerData();
      res.render("matches", {
        totalPlayers,
        recentPlayers,
      });
    } catch (error) {
      console.error("Error Fetching Data:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
