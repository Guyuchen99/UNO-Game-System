const db = require("../config/db");

const getActivePlayers = async () => {
  try {
    const [results] = await db.promise().query(`
      SELECT COUNT(*) AS active_players 
      FROM Players
    `);
    return results[0].active_players;
  } catch (error) {
    console.error("OH NO! Error fetching active players:", error.message);
    throw error;
  }
};

const getActiveEvents = async () => {
  try {
    const [results] = await db.promise().query(`
      SELECT COUNT(*) AS active_events 
      FROM Events 
      WHERE status = "Active"
    `);
    return results[0].active_events;
  } catch (error) {
    console.error("OH NO! Error fetching active events:", error.message);
    throw error;
  }
};

const getActiveMatches = async () => {
  try {
    const [results] = await db.promise().query(`
      SELECT COUNT(*) AS active_matches
      FROM Matches 
      WHERE status = "In Process"
    `);
    return results[0].active_matches;
  } catch (error) {
    console.error("OH NO! Error fetching active matches:", error.message);
    throw error;
  }
};

const getRevenue = async () => {
  try {
    const [results] = await db.promise().query(`
      SELECT SUM(iop.original_price) AS revenue 
      FROM PlayerContainItems pi
      JOIN Items i ON pi.item_id = i.item_id
      JOIN ItemOriginalPrice iop ON i.quality = iop.quality;
  `);
    return results[0].revenue;
  } catch (error) {
    console.error("OH NO! Error fetching revenue:", error.message);
    throw error;
  }
};

const getRecentPlayers = async () => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        p.player_id, 
        p.username, 
        p.total_win, 
        p.total_game_count, 
        pg.win_rate, 
        p.experience_point, 
        p.country
      FROM 
        Players p
      JOIN 
        PlayerGameStatistics pg ON p.total_win = pg.total_win AND p.total_game_count = pg.total_game_count
      ORDER BY player_id DESC LIMIT 5; 
    `);
    return results;
  } catch (error) {
    console.error("OH NO! Error fetching recent players:", error.message);
    throw error;
  }
};

exports.getNumOfActivePlayers = async () => {
  const activePlayers = await getActivePlayers();

  return { activePlayers };
};

exports.getNumOfActiveEvents = async () => {
  const activeEvents = await getActiveEvents();

  return { activeEvents };
};

exports.getNumOfActiveMatches = async () => {
  const activeMatches = await getActiveMatches();

  return { activeMatches };
};

exports.getTotalRevenue = async () => {
  const revenue = await getRevenue();
  const formattedRevenue = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(revenue);

  return { revenue: formattedRevenue };
};

exports.getPlayerData = async () => {
  const recentPlayers = await getRecentPlayers();

  return {
    recentPlayers: recentPlayers.map((element) => ({
      playerId: element.player_id,
      username: element.username,
      totalWin: element.total_win,
      totalGameCount: element.total_game_count,
      winRate: Math.round(element.win_rate * 100) + "%",
      experiencePoint: element.experience_point,
      country: element.country,
    })),
  };
};
