const db = require("../config/db");
const { formatInTimeZone } = require("date-fns-tz");

const timeZone = "America/Vancouver";

const logError = (functionName) => `OH NO! Error with ${functionName} in Matches Models:`;

exports.getRecentMatches = async () => {
	try {
		const [results] = await db.promise().query(`
			SELECT 
				match_id AS matchID, 
				start_time AS matchStartTime, 
				end_time AS matchEndTime, 
				winner AS matchWinner, 
				status AS matchStatus
			FROM Matches 
			ORDER BY match_id DESC 
        `);

		return results.map((element) => ({
			matchID: element.matchID,
			matchStartTime: formatInTimeZone(element.matchStartTime, timeZone, "yyyy-MM-dd HH:mm:ss zzz"),
			matchEndTime: element.matchEndTime ? formatInTimeZone(element.matchEndTime, timeZone, "yyyy-MM-dd HH:mm:ss zzz") : "TBD",
			matchWinner: element.matchWinner || "TDB",
			matchStatus: element.matchStatus,
		}));
	} catch (error) {
		console.error(logError("getRecentMatches"), error);
		throw error;
	}
};

exports.registerMatches = async (players) => {
	try {
		const [results] = await db.promise().query("INSERT INTO Matches (end_time, winner) VALUES (NULL, NULL)");

		const matchID = results.insertId;

		players.forEach(async (element) => {
			await db.promise().query("INSERT INTO PlayerInvolveMatches SET ?", {
				match_id: matchID,
				player_id: element,
			});
		});

		console.log("OH YES! Match Registered Successfully!");
	} catch (error) {
		console.error(logError("registerMatches"), error);
		throw error;
	}
};

exports.getMatchBasicInfo = async (matchID) => {
	try {
		const myQuery = `
			SELECT 
				start_time AS matchStartTime, 
				end_time AS matchEndTime, 
				winner AS matchWinner
			FROM Matches
			WHERE match_id = ? 
		`;

		const [results] = await db.promise().query(myQuery, [matchID]);

		return results.map((element) => ({
			matchStartTime: formatInTimeZone(element.matchStartTime, timeZone, "yyyy-MM-dd HH:mm:ss zzz"),
			matchEndTime: element.matchEndTime ? formatInTimeZone(element.matchEndTime, timeZone, "yyyy-MM-dd HH:mm:ss zzz") : "TBD",
			matchWinner: element.matchWinner || "TDB",
		}))[0];
	} catch (error) {
		console.error(logError("getMatchBasicInfo"), error);
		throw error;
	}
};

exports.getMatchPlayersInfo = async (matchID) => {
	try {
		const myQuery = `
			SELECT 
				p.username AS username,
				p.country AS country
			FROM Players p
			JOIN PlayerInvolveMatches pim ON p.player_id = pim.player_id
			WHERE pim.match_id = ?; 
		`;

		const [results] = await db.promise().query(myQuery, [matchID]);

		return results;
	} catch (error) {
		console.error(logError("getMatchPlayersInfo"), error);
		throw error;
	}
};

exports.getMatchDetails = async (matchID) => {
	try {
		const turns = await getTurnDetails(matchID);
		const playActions = await getPlayActionDetails(matchID);
		const drawActions = await getDrawActionsDetails(matchID);
		const turnLostActions = await getTurnLostActionsDetails(matchID);
		const handAndDeckInfo = await getHandAndDeckDetails(matchID);
		const matchPlayers = await getMatchPlayersDetails(matchID);

		const actions = [...playActions, ...drawActions, ...turnLostActions];
		actions.sort((a, b) => a.turnID - b.turnID);

		const cardCounts = {};
		let cardInDeck = handAndDeckInfo[0].cardInDeck - matchPlayers.length * 7;

		handAndDeckInfo.forEach((element) => {
			cardCounts[element.playerID] = {
				cardInHand: element.cardInHand,
			};
		});

		const getNextPlayer = (currentIndex) => {
			return matchPlayers[currentIndex % matchPlayers.length].username;
		};

		const results = turns.map((turn, index) => {
			const action = actions.find((element) => element.turnID === turn.turnID) || {};
			let handInPlayerAndDeck = cardCounts[turn.playerID];

			if (action.action === "Play") {
				handInPlayerAndDeck.cardInHand -= 1;
			} else if (action.action === "Draw") {
				handInPlayerAndDeck.cardInHand += parseInt(action.additionalInfo.split(" ")[0]);
				cardInDeck -= parseInt(action.additionalInfo.split(" ")[0]);
			}

			cardCounts[turn.playerID] = handInPlayerAndDeck;

			return {
				timestamp: formatInTimeZone(turn.timestamp, timeZone, "yyyy-MM-dd HH:mm:ss zzz"),
				username: turn.username,
				action: action.action,
				additionalInfo: action.additionalInfo || "",
				cardInHand: handInPlayerAndDeck.cardInHand,
				cardInDeck: cardInDeck,
				currentDirection: turn.currentDirection,
				nextTurn: getNextPlayer(index),
			};
		});

		return results;
	} catch (error) {
		console.error(logError("getMatchDetails"), error);
		throw error;
	}
};

const getTurnDetails = async (matchID) => {
	try {
		const myQuery = `
            SELECT 
                t.turn_id AS turnID,
                t.time_stamp AS timestamp,
                t.player_id as playerID, 
                p.username AS username,
                t.turn_order AS currentDirection
            FROM TurnBelongsToPlayerAndMatch t
            JOIN Players p ON t.player_id = p.player_id
            WHERE t.match_id = ?
            ORDER BY t.turn_id
        `;

		const [results] = await db.promise().query(myQuery, [matchID]);

		return results;
	} catch (error) {
		console.error(logError("getTurnDetails"), error);
		throw error;
	}
};

const getPlayActionDetails = async (matchID) => {
	try {
		const myQuery = `
            SELECT 
                pa.turn_id AS turnID,
                'Play' AS action,
                cbd.name AS additionalInfo
            FROM PlayAction pa
            JOIN CardBelongsToDeck cbd ON pa.card_id = cbd.card_id AND pa.deck_id = cbd.deck_id
            WHERE pa.match_id = ?;
        `;

		const [results] = await db.promise().query(myQuery, [matchID]);

		return results;
	} catch (error) {
		console.error(logError("getPlayActionDetails"), error);
		throw error;
	}
};

const getDrawActionsDetails = async (matchID) => {
	try {
		const myQuery = `
            SELECT 
                da.turn_id AS turnID,
                'Draw' AS action,
                CONCAT(da.draw_amount, ' Cards Drawn') AS additionalInfo
            FROM DrawAction da
            WHERE da.match_id = ?; 
        `;

		const [results] = await db.promise().query(myQuery, [matchID]);

		return results;
	} catch (error) {
		console.error(logError("getDrawActionsDetails"), error);
		throw error;
	}
};

const getTurnLostActionsDetails = async (matchID) => {
	try {
		const myQuery = `
            SELECT 
                tla.turn_id AS turnID,
                'Turn Lost' AS action
            FROM TurnLostAction tla
            WHERE tla.match_id = ?; 
        `;

		const [results] = await db.promise().query(myQuery, [matchID]);

		return results;
	} catch (error) {
		console.error(logError("getTurnLostActionsDetails"), error);
		throw error;
	}
};

const getHandAndDeckDetails = async (matchID) => {
	try {
		const myQuery = `
            SELECT 
                h.player_id AS playerID,
                h.card_amount AS cardInHand,
                d.card_amount AS cardInDeck
            FROM HandBelongsToPlayerAndMatch h
            JOIN MatchHasDeck md ON h.match_id = md.match_id
            JOIN Decks d ON md.deck_id = d.deck_id
            WHERE h.match_id = ?;
        `;

		const [results] = await db.promise().query(myQuery, [matchID]);

		return results;
	} catch (error) {
		console.error(logError("getHandAndDeckDetails"), error);
		throw error;
	}
};

const getMatchPlayersDetails = async (matchID) => {
	try {
		const myQuery = `
            SELECT 
                p.username AS username
            FROM Players p
            JOIN PlayerInvolveMatches pim ON p.player_id = pim.player_id
            WHERE pim.match_id = ?; 
		`;

		const [results] = await db.promise().query(myQuery, [matchID]);

		return results;
	} catch (error) {
		console.error(logError("getMatchPlayersDetails"), error);
		throw error;
	}
};
