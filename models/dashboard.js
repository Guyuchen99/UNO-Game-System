const db = require("../config/db");

exports.getTotalPlayers = async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS total_players FROM Players", (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results[0].total_players);
    });
  });
};

exports.getRecentPlayers = async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM Players ORDER BY player_id DESC LIMIT 5;", (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};
