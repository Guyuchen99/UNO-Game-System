const express = require("express");
const authController = require("../controllers/auth");
const dashboardController = require("../controllers/dashboard");
const eventsController = require("../controllers/events");
const matchesController = require("../controllers/matches");
const membershipsController = require("../controllers/memberships");
const storeItemsController = require("../controllers/store-items");

const router = express.Router();

router.get("/", authController.isLoggedIn, (req, res) => {
  if (req.loginStatus === true) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

router.get("/login", authController.isLoggedIn, (req, res) => {
  if (req.loginStatus === true) {
    res.redirect("/dashboard");
  } else {
    res.render("login");
  }
});

router.get("/dashboard", authController.isLoggedIn, dashboardController.loadDashboard);
router.post("/dashboard", dashboardController.registerPlayer);
router.delete("/dashboard", dashboardController.deletePlayer); 
router.get("/dashboard/player-data", dashboardController.loadEditModal); 

router.get("/store-items", authController.isLoggedIn, storeItemsController.loadStoreItems);

router.get("/memberships", authController.isLoggedIn, membershipsController.loadMemberships);

router.get("/events", authController.isLoggedIn, eventsController.loadEvents);

router.get("/matches", authController.isLoggedIn, matchesController.loadMatches);

module.exports = router;
