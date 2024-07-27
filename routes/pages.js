const express = require("express");
const authController = require("../controllers/auth");
const { getPlayerData, getNumOfActivePlayers, getNumOfActiveEvents, getNumOfActiveMatches, getTotalRevenue } = require("../models/dashboard");
const { getStoreData, getItemData } = require("../models/store-items");
const { getMembershipData } = require("../models/membership");
const { getEventData } = require("../models/events");
const { getMatchData } = require("../models/matches");

const router = express.Router();

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
      const { activePlayers } = await getNumOfActivePlayers();
      const { activeEvents } = await getNumOfActiveEvents();
      const { activeMatches } = await getNumOfActiveMatches();
      const { revenue } = await getTotalRevenue();
      const { recentPlayers } = await getPlayerData();

      res.render("index", {
        activePlayers,
        activeEvents,
        activeMatches,
        revenue,
        recentPlayers,
      });
    } catch (error) {
      console.error("OH NO! Error Fetching Data:", error);
      res.status(500).send("OH NO! Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/store-items", authController.isLoggedIn, async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const { recentStores } = await getStoreData();
      const { recentItems } = await getItemData();

      res.render("store-items", { recentStores, recentItems });
    } catch (error) {
      console.error("OH NO! Error Fetching Data:", error);
      res.status(500).send("OH NO! Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/memberships", authController.isLoggedIn, async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const { recentMemberships } = await getMembershipData();

      res.render("memberships", { recentMemberships });
    } catch (error) {
      console.error("OH NO! Error Fetching Data:", error);
      res.status(500).send("OH NO! Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/events", authController.isLoggedIn, async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const { recentEvents } = await getEventData();

      res.render("events", { recentEvents });
    } catch (error) {
      console.error("OH NO! Error Fetching Data:", error);
      res.status(500).send("OH NO! Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/matches", authController.isLoggedIn, async (req, res) => {
  if (req.loginStatus === true) {
    try {
      const { recentMatches } = await getMatchData();

      res.render("matches", { recentMatches });
    } catch (error) {
      console.error("OH NO! Error Fetching Data:", error);
      res.status(500).send("OH NO! Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
