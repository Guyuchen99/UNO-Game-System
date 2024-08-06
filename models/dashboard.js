const bcrypt = require("bcryptjs");
const db = require("../config/db");

const logError = (functionName) => `OH NO! Error with ${functionName} in Dashboard Models:`;

exports.getNumOfActivePlayers = async () => {
	try {
		const [results] = await db.promise().query(`
			SELECT COUNT(*) AS activePlayers 
			FROM Players
		`);

		return results[0].activePlayers;
	} catch (error) {
		console.error(logError("getNumOfActivePlayers"), error);
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
		console.error(logError("getNumOfActiveEvents"), error);
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
		console.error(logError("getNumOfActiveMatches"), error);
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

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(results[0].revenue);
	} catch (error) {
		console.error(logError("getRevenue"), error);
		throw error;
	}
};

exports.getAllPlayers = async (order) => {
	let orderByClause;

	switch (order) {
		case "recent":
			orderByClause = "player_id DESC";
			break;
		case "totalWins":
			orderByClause = "total_win DESC";
			break;
		case "totalGameCount":
			orderByClause = "total_game_count DESC";
			break;
		case "winRate":
			orderByClause = "win_rate DESC";
			break;
		case "experiencePoint":
			orderByClause = "experience_point DESC";
			break;
		case "country":
			orderByClause = "country";
			break;
		default:
			orderByClause = "player_id DESC";
	}

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
			ORDER BY ${orderByClause}; 
    	`);

		return results;
	} catch (error) {
		console.error(logError("getAllPlayers"), error);
		throw error;
	}
};

exports.getPlayerIDByUsername = async (username) => {
	try {
		const [results] = await db.promise().query("SELECT player_id FROM Players WHERE username = ?", [username]);

		return results[0]?.player_id;
	} catch (error) {
		console.error(logError("getPlayerIDByUsername"), error);
		throw error;
	}
};

exports.getPlayerDataByID = async (playerID) => {
	try {
		const myQuery = `
			SELECT 
				p.player_id AS playerID, 
				p.username AS username, 
				p.country AS country, 
				pue.email AS email
			FROM Players p
			JOIN PlayerUsernameAndEmail pue ON p.username = pue.username
			WHERE p.player_id = ? 
    	`;
		const [results] = await db.promise().query(myQuery, [playerID]);

		return results[0];
	} catch (error) {
		console.error(logError("getPlayerDataByID"), error);
		throw error;
	}
};

exports.isUsernameAvailable = async (username) => {
	try {
		const [results] = await db.promise().query("SELECT * FROM PlayerUsernameAndEmail WHERE username = ?", [username]);

		return results.length === 0;
	} catch (error) {
		console.error(logError("isUsernameAvailable"), error);
		throw error;
	}
};

exports.isEmailAvailable = async (email) => {
	try {
		const [results] = await db.promise().query("SELECT * FROM PlayerUsernameAndEmail WHERE email = ?", [email]);

		return results.length === 0;
	} catch (error) {
		console.error(logError("isEmailAvailable"), error);
		throw error;
	}
};

exports.updatePlayerUsernameAndEmail = async (newUsername, newEmail, oldUsername) => {
	try {
		const myQuery = `
			UPDATE PlayerUsernameAndEmail 
			SET username = ?, email = ? 
			WHERE username = ?
    	`;

		await db.promise().query(myQuery, [newUsername, newEmail, oldUsername]);
		console.log("OH YES! PlayerUsernameAndEmail Updated Successfully!");
	} catch (error) {
		console.error(logError("updatePlayerUsernameAndEmail"), error);
		throw error;
	}
};

exports.updatePlayerByID = async (playerID, updates) => {
	try {
		const columnNames = Object.keys(updates);
		const columnValues = Object.values(updates);
		const setClause = columnNames.map((element) => `${element} = ?`).join(", ");

		if (setClause) {
			const myQuery = `UPDATE Players SET ${setClause} WHERE player_id = ?`;
			columnValues.push(playerID);

			await db.promise().query(myQuery, columnValues);
			console.log("OH YES! Player Updated Successfully!");
		}
	} catch (error) {
		console.error(logError("updatePlayerByID"), error);
		throw error;
	}
};

exports.registerPlayer = async (username, password, email, country) => {
	try {
		await insertPlayerUsernameAndEmail(username, email);

		const hashedPassword = await bcrypt.hash(password, 10);

		await db.promise().query("INSERT INTO Players SET ?", {
			username: username,
			password: hashedPassword,
			country: country,
		});
		console.log("OH YES! Player Registered Successfully!");
	} catch (error) {
		console.error(logError("registerPlayer"), error);
		throw error;
	}
};

const insertPlayerUsernameAndEmail = async (username, email) => {
	try {
		await db.promise().query("INSERT INTO PlayerUsernameAndEmail SET ?", {
			username: username,
			email: email,
		});
		console.log("OH YES! Insered into insertPlayerUsernameAndEmail Successfully!");
	} catch (error) {
		console.error(logError("insertPlayerUsernameAndEmail"), error);
		throw error;
	}
};

exports.deletePlayerByUsername = async (username) => {
	try {
		await db.promise().query("DELETE FROM PlayerUsernameAndEmail WHERE ?", {
			username: username,
		});
		console.log("OH YES! Player Deleted Successfully!");
	} catch (error) {
		console.error(logError("deletePlayerByUsername"), error);
		throw error;
	}
};
