const express = require("express");
const authController = require("../controllers/auth");
const { getTotalPlayers, getRecentPlayers } = require("../models/dashboard");

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
      const totalPlayers = await getTotalPlayers();
      const recentPlayers = await getRecentPlayers();

      const {
        id: id1,
        username: username1,
        total_win: totalWin1,
        total_game_count: totalGameCount1,
        experience_point: experience1,
        country: country1,
      } = recentPlayers[0];

      const {
        id: id2,
        username: username2,
        total_win: totalWin2,
        total_game_count: totalGameCount2,
        experience_point: experience2,
        country: country2,
      } = recentPlayers[1];

      const {
        id: id3,
        username: username3,
        total_win: totalWin3,
        total_game_count: totalGameCount3,
        experience_point: experience3,
        country: country3,
      } = recentPlayers[2];

      const {
        id: id4,
        username: username4,
        total_win: totalWin4,
        total_game_count: totalGameCount4,
        experience_point: experience4,
        country: country4,
      } = recentPlayers[3];

      const {
        id: id5,
        username: username5,
        total_win: totalWin5,
        total_game_count: totalGameCount5,
        experience_point: experience5,
        country: country5,
      } = recentPlayers[4];

      res.render("index", {
        totalPlayers,
        username1,
        totalWin1,
        totalGameCount1,
        experience1,
        country1,

        username2,
        totalWin2,
        totalGameCount2,
        experience2,
        country2,

        username3,
        totalWin3,
        totalGameCount3,
        experience3,
        country3,

        username4,
        totalWin4,
        totalGameCount4,
        experience4,
        country4,

        username5,
        totalWin5,
        totalGameCount5,
        experience5,
        country5,
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
      const totalPlayers = await getTotalPlayers();
      const recentPlayers = await getRecentPlayers();

      const {
        id: id1,
        username: username1,
        total_win: totalWin1,
        total_game_count: totalGameCount1,
        experience_point: experience1,
        country: country1,
      } = recentPlayers[0];

      const {
        id: id2,
        username: username2,
        total_win: totalWin2,
        total_game_count: totalGameCount2,
        experience_point: experience2,
        country: country2,
      } = recentPlayers[1];

      const {
        id: id3,
        username: username3,
        total_win: totalWin3,
        total_game_count: totalGameCount3,
        experience_point: experience3,
        country: country3,
      } = recentPlayers[2];

      const {
        id: id4,
        username: username4,
        total_win: totalWin4,
        total_game_count: totalGameCount4,
        experience_point: experience4,
        country: country4,
      } = recentPlayers[3];

      const {
        id: id5,
        username: username5,
        total_win: totalWin5,
        total_game_count: totalGameCount5,
        experience_point: experience5,
        country: country5,
      } = recentPlayers[4];

      res.render("memberships", {
        totalPlayers,
        username1,
        totalWin1,
        totalGameCount1,
        experience1,
        country1,

        username2,
        totalWin2,
        totalGameCount2,
        experience2,
        country2,

        username3,
        totalWin3,
        totalGameCount3,
        experience3,
        country3,

        username4,
        totalWin4,
        totalGameCount4,
        experience4,
        country4,

        username5,
        totalWin5,
        totalGameCount5,
        experience5,
        country5,
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
      const totalPlayers = await getTotalPlayers();
      const recentPlayers = await getRecentPlayers();

      const {
        id: id1,
        username: username1,
        total_win: totalWin1,
        total_game_count: totalGameCount1,
        experience_point: experience1,
        country: country1,
      } = recentPlayers[0];

      const {
        id: id2,
        username: username2,
        total_win: totalWin2,
        total_game_count: totalGameCount2,
        experience_point: experience2,
        country: country2,
      } = recentPlayers[1];

      const {
        id: id3,
        username: username3,
        total_win: totalWin3,
        total_game_count: totalGameCount3,
        experience_point: experience3,
        country: country3,
      } = recentPlayers[2];

      const {
        id: id4,
        username: username4,
        total_win: totalWin4,
        total_game_count: totalGameCount4,
        experience_point: experience4,
        country: country4,
      } = recentPlayers[3];

      const {
        id: id5,
        username: username5,
        total_win: totalWin5,
        total_game_count: totalGameCount5,
        experience_point: experience5,
        country: country5,
      } = recentPlayers[4];

      res.render("store-items", {
        totalPlayers,
        username1,
        totalWin1,
        totalGameCount1,
        experience1,
        country1,

        username2,
        totalWin2,
        totalGameCount2,
        experience2,
        country2,

        username3,
        totalWin3,
        totalGameCount3,
        experience3,
        country3,

        username4,
        totalWin4,
        totalGameCount4,
        experience4,
        country4,

        username5,
        totalWin5,
        totalGameCount5,
        experience5,
        country5,
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
      const totalPlayers = await getTotalPlayers();
      const recentPlayers = await getRecentPlayers();

      const {
        id: id1,
        username: username1,
        total_win: totalWin1,
        total_game_count: totalGameCount1,
        experience_point: experience1,
        country: country1,
      } = recentPlayers[0];

      const {
        id: id2,
        username: username2,
        total_win: totalWin2,
        total_game_count: totalGameCount2,
        experience_point: experience2,
        country: country2,
      } = recentPlayers[1];

      const {
        id: id3,
        username: username3,
        total_win: totalWin3,
        total_game_count: totalGameCount3,
        experience_point: experience3,
        country: country3,
      } = recentPlayers[2];

      const {
        id: id4,
        username: username4,
        total_win: totalWin4,
        total_game_count: totalGameCount4,
        experience_point: experience4,
        country: country4,
      } = recentPlayers[3];

      const {
        id: id5,
        username: username5,
        total_win: totalWin5,
        total_game_count: totalGameCount5,
        experience_point: experience5,
        country: country5,
      } = recentPlayers[4];

      res.render("events", {
        totalPlayers,
        username1,
        totalWin1,
        totalGameCount1,
        experience1,
        country1,

        username2,
        totalWin2,
        totalGameCount2,
        experience2,
        country2,

        username3,
        totalWin3,
        totalGameCount3,
        experience3,
        country3,

        username4,
        totalWin4,
        totalGameCount4,
        experience4,
        country4,

        username5,
        totalWin5,
        totalGameCount5,
        experience5,
        country5,
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
      const totalPlayers = await getTotalPlayers();
      const recentPlayers = await getRecentPlayers();

      const {
        id: id1,
        username: username1,
        total_win: totalWin1,
        total_game_count: totalGameCount1,
        experience_point: experience1,
        country: country1,
      } = recentPlayers[0];

      const {
        id: id2,
        username: username2,
        total_win: totalWin2,
        total_game_count: totalGameCount2,
        experience_point: experience2,
        country: country2,
      } = recentPlayers[1];

      const {
        id: id3,
        username: username3,
        total_win: totalWin3,
        total_game_count: totalGameCount3,
        experience_point: experience3,
        country: country3,
      } = recentPlayers[2];

      const {
        id: id4,
        username: username4,
        total_win: totalWin4,
        total_game_count: totalGameCount4,
        experience_point: experience4,
        country: country4,
      } = recentPlayers[3];

      const {
        id: id5,
        username: username5,
        total_win: totalWin5,
        total_game_count: totalGameCount5,
        experience_point: experience5,
        country: country5,
      } = recentPlayers[4];

      res.render("matches", {
        totalPlayers,
        username1,
        totalWin1,
        totalGameCount1,
        experience1,
        country1,

        username2,
        totalWin2,
        totalGameCount2,
        experience2,
        country2,

        username3,
        totalWin3,
        totalGameCount3,
        experience3,
        country3,

        username4,
        totalWin4,
        totalGameCount4,
        experience4,
        country4,

        username5,
        totalWin5,
        totalGameCount5,
        experience5,
        country5,
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
