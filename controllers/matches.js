const dashboardModel = require("../models/dashboard");
const matchesModel = require("../models/matches");

const logError = (functionName) => `OH NO! Error with ${functionName} in Matches Controllers:`;
const resError = (functionName) => `OH NO! Internal Server Error with ${functionName} in Matches Controllers:`;

exports.loadMatches = async (req, res) => {
	if (!req.loginStatus) {
		return res.redirect("/login");
	}

	try {
		const recentMatches = await matchesModel.getRecentMatches();

		res.render("matches", { recentMatches });
	} catch (error) {
		console.error(logError("loadMatches"), error);
		res.status(500).send(resError("loadMatches"));
	}
};

exports.fetchMatchBasicInfo = async (req, res) => {
	const { matchID } = req.query;

	try {
		const results = await matchesModel.getMatchBasicInfo(matchID);

		res.status(200).json(results);
	} catch (error) {
		console.error(logError("fetchMatchBasicInfo"), error);
		res.status(500).send(resError("fetchMatchBasicInfo"));
	}
};

exports.fetchMatchPlayersInfo = async (req, res) => {
	const { matchID } = req.query;

	try {
		const results = await matchesModel.getMatchPlayersInfo(matchID);

		res.status(200).json(results);
	} catch (error) {
		console.error(logError("fetchMatchPlayerInfo"), error);
		res.status(500).send(resError("fetchMatchPlayerInfo"));
	}
};

exports.fetchMatchDetails = async (req, res) => {
	const { matchID } = req.query;

	try {
		const results = await matchesModel.getMatchDetails(matchID);

		res.status(200).json(results);
	} catch (error) {
		console.error(logError("fetchMatchDetails"), error);
		res.status(500).send(resError("fetchMatchDetails"));
	}
};

exports.registerMatches = async (req, res) => {
	const { username1, username2, username3, username4 } = req.body;
	const players = [];

	try {
		if (username1) {
			const playerID1 = await dashboardModel.getPlayerIDByUsername(username1);
			players.push(playerID1);
		}

		if (username2) {
			const playerID2 = await dashboardModel.getPlayerIDByUsername(username2);
			players.push(playerID2);
		}

		if (username3) {
			const playerID3 = await dashboardModel.getPlayerIDByUsername(username3);
			players.push(playerID3);
		}

		if (username4) {
			const playerID4 = await dashboardModel.getPlayerIDByUsername(username4);
			players.push(playerID4);
		}

		await matchesModel.registerMatches(players);

		res.redirect("/matches");
	} catch (error) {
		console.error(logError("registerMatches"), error);
		res.status(500).send(resError("registerMatches"));
	}
};
