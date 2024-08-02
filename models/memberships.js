const db = require("../config/db");
const { formatInTimeZone } = require("date-fns-tz");
const { differenceInDays } = require("date-fns");

const vancouverTimeZone = "America/Vancouver";

const logError = (functionName) => `OH NO! Error with ${functionName} in Models:`;

exports.getAllMemberships = async (order) => {
	let orderByClause;

	switch (order) {
		case "recent":
			orderByClause = "mp.issue_time DESC";
			break;
		case "daysRemaining":
			orderByClause = "mp.expire_time DESC";
			break;
		case "privilegeLevel":
			orderByClause = "mpc.privilege_level DESC";
			break;
		case "status":
			orderByClause = "mp.status";
			break;
		default:
			orderByClause = "mp.issue_time DESC";
	}

	try {
		await updateMembershipStatus();

		const [results] = await db.promise().query(`
			SELECT 
				p.username AS username,
				p.player_id AS playerID,
				mp.issue_time AS membershipIssueTime,
				mp.expire_time AS membershipExpireTime,
				mpc.privilege_class AS membershipPrivilegeClass,
				mp.privilege_level AS membershipPrivilegeLevel,
				mp.status AS membershipStatus
			FROM MembershipInPlayer mp
			JOIN Players p ON mp.player_id = p.player_id
			JOIN MembershipPrivilegeClass mpc ON mp.privilege_level = mpc.privilege_level
			ORDER BY ${orderByClause}; 
    	`);

		return results.map((element) => ({
			username: element.username,
			playerID: element.playerID,
			membershipIssueTime: formatInTimeZone(element.membershipIssueTime, vancouverTimeZone, "yyyy-MM-dd"),
			membershipExpireTime: formatInTimeZone(element.membershipExpireTime, vancouverTimeZone, "yyyy-MM-dd"),
			membershipDaysRemaining: getDaysRemaining(new Date(element.membershipIssueTime), new Date(element.membershipExpireTime)),
			membershipPrivilegeClass: element.membershipPrivilegeClass,
			membershipPrivilegeLevel: element.membershipPrivilegeLevel,
			membershipStatus: element.membershipStatus,
		}));
	} catch (error) {
		console.error(logError("getRecentMemberships"), error.message);
		throw error;
	}
};

exports.getMembershipDataByPlayerID = async (playerID) => {
	try {
		const myQuery = `
			SELECT 
				p.player_id AS playerID,
				p.username AS username,
				mp.issue_time AS membershipIssueTime,
				mp.expire_time AS membershipExpireTime,
				mpc.privilege_class AS membershipPrivilegeClass,
				mp.privilege_level AS membershipPrivilegeLevel,
				mp.status AS membershipStatus
			FROM MembershipInPlayer mp
			JOIN Players p ON mp.player_id = p.player_id
			JOIN MembershipPrivilegeClass mpc ON mp.privilege_level = mpc.privilege_level
			WHERE mp.player_id = ?;
		`;

		const [results] = await db.promise().query(myQuery, [playerID]);
		results[0].membershipDaysRemaining = getDaysRemaining(new Date(), new Date(results[0].membershipExpireTime));

		return results[0];
	} catch (error) {
		console.error(logError("getMembershipDataByPlayerID"), error);
		throw error;
	}
};

exports.isPlayerMembershipRegistered = async (playerID) => {
	try {
		const [results] = await db.promise().query("SELECT membership_id FROM MembershipInPlayer WHERE player_id = ?", [playerID]);

		return results.length > 0;
	} catch (error) {
		console.error(logError("isUsernameRegistered"), error);
		throw error;
	}
};

exports.updateMembershipByPlayerID = async (playerID, updates) => {
	try {
		const columnNames = Object.keys(updates);
		const columnValues = Object.values(updates);

		if (updates.expire_time) {
			let issueTimeUTC = new Date();

			let expireTimeUTC = new Date(`${updates.expire_time}T00:00:00-07:00`);

			const status = issueTimeUTC < expireTimeUTC ? "Active" : "Expired";
			columnNames.push("status");
			columnValues.push(status);

			issueDateVancouver = formatInTimeZone(issueTimeUTC, vancouverTimeZone, "yyyy-MM-dd");
			columnNames.push("issue_time");
			columnValues.push(issueDateVancouver);

			expireDateVancouver = formatInTimeZone(expireTimeUTC, vancouverTimeZone, "yyyy-MM-dd");
			columnNames.push("expire_time");
			columnValues.push(expireDateVancouver);
		}

		const setClause = columnNames.map((element) => `${element} = ?`).join(", ");

		if (setClause) {
			const myQuery = `UPDATE MembershipInPlayer SET ${setClause} WHERE player_id = ?`;
			columnValues.push(playerID);

			await db.promise().query(myQuery, columnValues);
			console.log("OH YES! Membership Updated Successfully!");
		}
	} catch (error) {
		console.error(logError("updateMembershipByPlayerID"), error);
		throw error;
	}
};

exports.registerMembership = async (playerID, duration, privilegeLevel) => {
	try {
		const currentDate = new Date();
		const expireDate = new Date(new Date().getTime() + duration * 24 * 60 * 60 * 1000);

		await db.promise().query("INSERT INTO MembershipInPlayer SET ?", {
			player_id: playerID,
			issue_time: currentDate,
			expire_time: expireDate,
			privilege_level: privilegeLevel,
			status: "Active",
		});

		console.log("OH YES! Membership Registered Successfully!");
	} catch (error) {
		console.error(logError("registerMembership"), error);
		throw error;
	}
};

exports.deleteMembershipByPlayerID = async (playerID) => {
	try {
		await db.promise().query("DELETE FROM MembershipInPlayer WHERE player_id = ?", [playerID]);

		console.log("OH YES! Membership Deleted Successfully!");
	} catch (error) {
		console.error(logError("deleteMembershipByPlayerID"), error);
		throw error;
	}
};

async function updateMembershipStatus() {
	try {
		const [results] = await db.promise().query("SELECT * FROM MembershipInPlayer");

		results.forEach(async (element) => {
			const issueTimeUTC = new Date();
			const expireTimeUTC = element.expire_time;
			const status = issueTimeUTC < expireTimeUTC ? "Active" : "Expired";

			await db.promise().query("UPDATE MembershipInPlayer SET status = ? WHERE player_id = ?", [status, element.player_id]);
		});
	} catch (error) {
		console.error(logError("updateMembershipStatus"), error.message);
		throw error;
	}
}

function getDaysRemaining(issueDate, expireDate) {
	const daysRemaining = differenceInDays(expireDate, issueDate);

	if (daysRemaining > 0) {
		return daysRemaining;
	}

	return 0;
}
