const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.getNumOfActivePlayers = async () => {
  try {
    const [results] = await db.promise().query(`
      SELECT COUNT(*) AS activePlayers 
      FROM Players
    `);

    return results[0].activePlayers;
  } catch (error) {
    console.error("OH NO! Error fetching active players:", error);
    throw error;
  }
};

exports.getNumOfActiveEvents = async () => {
  try {
    const [results] = await db.promise().query(`
      SELECT COUNT(*) AS activeEvents
      FROM Events
      WHERE status = "Active"
    `);

    return results[0].activeEvents;
  } catch (error) {
    console.error("OH NO! Error fetching active events:", error);
    throw error;
  }
};

exports.getNumOfActiveMatches = async () => {
  try {
    const [results] = await db.promise().query(`
      SELECT COUNT(*) AS activeMatches
      FROM Matches
      WHERE status = "In Process"
    `);

    return results[0].activeMatches;
  } catch (error) {
    console.error("OH NO! Error fetching active matches:", error);
    throw error;
  }
};

exports.getRevenue = async () => {
  try {
    const [results] = await db.promise().query(`
      SELECT SUM(iop.original_price) AS revenue
      FROM PlayerContainItems pi
      JOIN Items i ON pi.item_id = i.item_id
      JOIN ItemOriginalPrice iop ON i.quality = iop.quality;
  `);

    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(results[0].revenue);
  } catch (error) {
    console.error("OH NO! Error fetching revenue:", error);
    throw error;
  }
};

exports.getRecentPlayers = async () => {
  try {
    const [results] = await db.promise().query(`
      SELECT
        player_id AS playerID,
        username AS username, 
        total_win AS totalWin,
        total_game_count AS totalGameCount,
        win_rate AS winRate,
        experience_point AS experiencePoint,
        country AS country
      FROM Players
      ORDER BY player_id DESC LIMIT 5;
    `);

    return results;
  } catch (error) {
    console.error("OH NO! Error fetching recent players:", error);
    throw error;
  }
};

exports.registerPlayer = async (username, password, email, country) => {
  try {
    await insertPlayerUsernameAndEmail(username, email);

    let hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query("INSERT INTO Players SET ?", { username: username, password: hashedPassword, country: country });
    console.log("Player registered successfully.");
  } catch (error) {
    console.error("OH NO! Error during register player:", error);
    throw error;
  }
};

const insertPlayerUsernameAndEmail = async (username, email) => {
  try {
    if (!(await checkUsernameAvailability(username))) {
      console.log("Username already taken... Please try again!");
      throw new Error("Username already taken");
    }

    if (!(await checkEmailAvailability(email))) {
      console.log("Email already taken... Please try again!");
      throw new Error("Email already taken");
    }

    await db.promise().query("INSERT INTO PlayerUsernameAndEmail SET ?", { username: username, email: email });
    console.log("Inserted into PlayerUsernameAndEmail successfully.");
  } catch (error) {
    console.error("OH NO! Error inserting into PlayerUsernameAndEmail:", error);
    throw error;
  }
};

const checkUsernameAvailability = async (username) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM PlayerUsernameAndEmail WHERE username = ?", [username]);
    const isUsernameAvailable = results.length === 0;

    return isUsernameAvailable;
  } catch (error) {
    console.error("OH NO! Error fetching playerUsernameAndEmail: ", error);
    throw error;
  }
};

const checkEmailAvailability = async (email) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM PlayerUsernameAndEmail WHERE email = ?", [email]);
    const isEmailAvailable = results.length === 0;

    return isEmailAvailable;
  } catch (error) {
    console.error("OH NO! Error fetching playerUsernameAndEmail: ", error);
    throw error;
  }
};
