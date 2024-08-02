const dashboardModel = require("../models/dashboard");
const membershipsModel = require("../models/memberships");

const logError = (functionName) => `OH NO! Error with ${functionName} in Controllers:`;
const resError = (functionName) => `OH NO! Internal Server Error with ${functionName} in Controllers:`;

exports.loadMemberships = async (req, res) => {
	if (!req.loginStatus) {
		return res.redirect("/login");
	}

	const { order } = req.query;

	try {
		const recentMemberships = await membershipsModel.getAllMemberships(order);
		res.render("memberships", { recentMemberships });
	} catch (error) {
		console.error(logError("loadMemberships"), error);
		res.status(500).send(resError("loadMemberships"));
	}
};

exports.fetchMembershipData = async (req, res) => {
	const { playerID } = req.query;

	try {
		const results = await membershipsModel.getMembershipDataByPlayerID(playerID);
		res.status(200).json(results);
	} catch (error) {
		console.error(logError("fetchMembershipData"), error);
		res.status(500).send(resError("fetchMembershipData"));
	}
};

exports.checkMembershipExistence = async (req, res) => {
	const { username } = req.query;

	try {
		const playerID = await dashboardModel.getPlayerID(username);
		const membershipExistence = await membershipsModel.isPlayerMembershipRegistered(playerID);

		if (!membershipExistence) {
			return res.status(200).send(`OH YES! ${username} does not have a membership yet!`);
		}

		return res.status(400).send(`OH NO! ${username} already has a membership!`);
	} catch (error) {
		console.error(logError("checkMembershipExistence"), error);
		res.status(500).send(resError("checkMembershipExistence"));
	}
};

exports.updateMembership = async (req, res) => {
	const { playerID, expireDate, privilegeLevel } = req.body;

	try {
		const results = await membershipsModel.getMembershipDataByPlayerID(playerID);
		const updates = {};

		if (expireDate !== results.membershipExpireDate) {
			updates.expire_date = expireDate;
		}

		if (privilegeLevel !== results.membershipPrivilegeLevel) {
			updates.privilege_level = privilegeLevel;
		}

		if (Object.keys(updates).length > 0) {
			await membershipsModel.updateMembershipByPlayerID(playerID, updates);
		}

		res.redirect("/memberships");
	} catch (error) {
		console.error(logError("updateMembership"), error);
		res.status(500).send(resError("updateMembership"));
	}
};

exports.registerMembership = async (req, res) => {
	const { username, duration, privilegeLevel } = req.body;

	try {
		const playerID = await dashboardModel.getPlayerID(username);
		await membershipsModel.registerMembership(playerID, duration, privilegeLevel);

		res.redirect("/memberships");
	} catch (error) {
		console.error(logError("registerMembership"), error);
		res.status(500).send(resError("registerMembership"));
	}
};

exports.deleteMembership = async (req, res) => {
	const { item: playerID } = req.body;

	try {
		await membershipsModel.deleteMembershipByPlayerID(playerID);
		res.status(200).send("OH YES! Membership Deleted Successfully");
	} catch (error) {
		console.error(logError("deleteMembership"), error);
		res.status(500).send(resError("deleteMembership"));
	}
};
