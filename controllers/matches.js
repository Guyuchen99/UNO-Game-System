const matchesModel = require("../models/matches");

const logError = (functionName) => `OH NO! Error with ${functionName} in Controllers:`;
const resError = (functionName) => `OH NO! Internal Server Error with ${functionName} in Controllers:`;

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

exports.registerMatches = async (req, res) => {
	const { username1, username2, username3, username4 } = req.body;

	try {
		if (username1) {
			const playerID1 = await dashboardModel.getPlayerID(username1);
		}

		if (username2) {
			const playerID2 = await dashboardModel.getPlayerID(username2);
		}

		if (username3) {
			const playerID3 = await dashboardModel.getPlayerID(username3);
		}

		if (username4) {
			const playerID4 = await dashboardModel.getPlayerID(username4);
		}

		await membershipsModel.registerMembership(playerID, duration, privilegeLevel);

		res.redirect("/memberships");
	} catch (error) {
		console.error(logError("registerMembership"), error);
		res.status(500).send(resError("registerMembership"));
	}
};
