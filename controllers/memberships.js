const { compareSync } = require("bcryptjs");
const membershipsModel = require("../models/memberships");

exports.loadMemberships = async (req, res) => {
	if (req.loginStatus === true) {
		try {
			const recentMemberships = await membershipsModel.getRecentMemberships();

			res.render("memberships", { recentMemberships });
		} catch (error) {
			console.error("OH NO! Error Loading Memberships:", error);
			res.status(500).send("OH NO! Internal Server Error with Loading Memberships");
		}
	} else {
		res.redirect("/login");
	}
};

exports.registerMembership = async (req, res) => {
	const { username, duration, level } = req.body;

	console.log("Username: ", username, "Duration: ", duration, "Level: ", level);

	try {
		if (!username || !duration || !level) {
			throw new Error("Form Incomplete... Please try again!");
		}
		await membershipsModel.registerMembership(username, duration, level);
		return res.redirect("/memberships");
	} catch (error) {
		console.error("Error registering membership:", error);
		return res.redirect("/memberships");
	}
};

exports.deleteMembership = async (req, res) => {
	const { item: playerID } = req.body;

	try {
		await membershipsModel.deleteMembershipByUsername(playerID);

		res.status(200).send(`${playerID} deleted successfully`);
	} catch (error) {
		console.error(`OH NO! Error Deleting ${playerID}:`, error);
		res.status(500).send("OH NO! Internal Server Error with deleteMembership in model");
	}
};

exports.checkMembership = async (req, res) => {
	const { username } = req.query;
	console.log("Username: ", username);
	if (membershipsModel.isUsernameRegistered(username)) {
		console.log("Username has a membership");
		res.status(409).send("Username has a membership");
	} else {
		console.log("Username has no membership");
		res.status(409).send("Username has no membership");
	}
};

exports.fetchMembershipData = async (req, res) => {
	const { playerID } = req.query;

	try {
		const membershipData = await membershipsModel.fetchMembershipByPlayerID(playerID);
		res.status(200).json(membershipData);
	} catch (error) {
		console.error("OH NO! Error Fetching Membership Data:", error);
		res.status(500).send("OH NO! Internal Server Error with Fetch Membership Data");
	}
};

exports.updateMembership = async (req, res) => {
	const { username, playerID, issueDate, daysRemaining, level, status } = req.body;
	console.log("Issude date: ", issueDate);
	if (!username || !playerID || !issueDate || !daysRemaining || !level || !status) {
		return res.status(400).send("Form Incomplete... Please try again!");
	} else {
		try {
			await membershipsModel.updateMembership(username, playerID, issueDate, daysRemaining, level, status);
			return res.redirect("/memberships");
		} catch (error) {
			console.error("OH NO! Error Updating Membership:", error);
			return res.redirect("/memberships");
		}
	}
};
