const db = require("../config/db");

exports.getTotalPlayers = async () => {
  try {
    const [results] = await db.promise().query("SELECT COUNT(*) AS total_players FROM Players");
    return results[0].total_players;
  } catch (error) {
    console.error("Error fetching total players:", error.message);
    throw error;
  }
};

exports.getRecentPlayers = async () => {
  try {
    const [results] = await db.promise().query("SELECT * FROM Players ORDER BY player_id DESC LIMIT 5;");
    return results;
  } catch (error) {
    console.error("Error fetching recent players:", error.message);
    throw error;
  }
};
