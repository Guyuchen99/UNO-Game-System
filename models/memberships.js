const db = require("../config/db");
const { toZonedTime, formatInTimeZone } = require("date-fns-tz");
const { differenceInDays } = require("date-fns");

const vancouverTimeZone = "America/Vancouver";

const logError = (functionName) => `OH NO! Error with ${functionName} in Memberships Models:`;

exports.getAllMemberships = async (order) => {
	let orderByClause;

	switch (order) {
		case "recent":
			orderByClause = "m.issue_date DESC";
			break;
		case "daysRemaining":
			orderByClause = "membershipDaysRemaining DESC, m.status, m.issue_date DESC";
			break;
		case "privilegeLevel":
			orderByClause = "mpc.privilege_level DESC, m.issue_date DESC, m.status";
			break;
		case "status":
			orderByClause = "m.status, m.issue_date DESC, mpc.privilege_level DESC";
			break;
		default:
			orderByClause = "m.issue_date DESC";
	}

	try {
		await updateMembershipStatus();

		const [results] = await db.promise().query(`
			SELECT 
				p.username AS username,
				p.player_id AS playerID,
				m.issue_date AS membershipIssueDate,
				m.expire_date AS membershipExpireDate,
				mpc.privilege_class AS membershipPrivilegeClass,
				m.privilege_level AS membershipPrivilegeLevel,
				m.status AS membershipStatus,
				CASE 
					WHEN m.status = 'active' THEN DATEDIFF(m.expire_date, m.issue_date)
					ELSE 0
				END AS membershipDaysRemaining
			FROM Memberships m
			JOIN Players p ON m.player_id = p.player_id
			JOIN MembershipPrivilegeClass mpc ON m.privilege_level = mpc.privilege_level
			ORDER BY ${orderByClause}; 
    	`);

		return results.map((element) => ({
			username: element.username,
			playerID: element.playerID,
			membershipIssueDate: formatInTimeZone(element.membershipIssueDate, vancouverTimeZone, "yyyy-MM-dd"),
			membershipExpireDate: formatInTimeZone(element.membershipExpireDate, vancouverTimeZone, "yyyy-MM-dd"),
			membershipDaysRemaining: element.membershipDaysRemaining,
			membershipPrivilegeClass: element.membershipPrivilegeClass,
			membershipPrivilegeLevel: element.membershipPrivilegeLevel,
			membershipStatus: element.membershipStatus,
		}));
	} catch (error) {
		console.error(logError("getAllMemberships"), error.message);
		throw error;
	}
};

exports.getPrivilegeClassByPrivilegeLevel = async (privilegeClass) => {
	try {
		const myQuery = `
			SELECT 
				mpc.privilege_class AS privilegeClass
			FROM MembershipPrivilegeClass mpc
			WHERE privilege_level = ?
    	`;

		const [results] = await db.promise().query(myQuery, [privilegeClass]);

		return results[0]?.privilegeClass;
	} catch (error) {
		console.error(logError("getPrivilegeClassByPrivilegeLevel"), error);
		throw error;
	}
};

exports.getMembershipDataByPlayerID = async (playerID) => {
	try {
		const myQuery = `
			SELECT 
				p.player_id AS playerID,
				p.username AS username,
				m.issue_date AS membershipIssueDate,
				m.expire_date AS membershipExpireDate,
				mpc.privilege_class AS membershipPrivilegeClass,
				m.privilege_level AS membershipPrivilegeLevel,
				m.status AS membershipStatus
			FROM Memberships m
			JOIN Players p ON m.player_id = p.player_id
			JOIN MembershipPrivilegeClass mpc ON m.privilege_level = mpc.privilege_level
			WHERE m.player_id = ?;
		`;

		const [results] = await db.promise().query(myQuery, [playerID]);
		results[0].membershipIssueDate = formatInTimeZone(results[0].membershipIssueDate, vancouverTimeZone, "yyyy-MM-dd");
		results[0].membershipExpireDate = formatInTimeZone(results[0].membershipExpireDate, vancouverTimeZone, "yyyy-MM-dd");

		return results[0];
	} catch (error) {
		console.error(logError("getMembershipDataByPlayerID"), error);
		throw error;
	}
};

exports.isPlayerMembershipRegistered = async (playerID) => {
	try {
		const [results] = await db.promise().query("SELECT membership_id FROM Memberships WHERE player_id = ?", [playerID]);

		return results.length > 0;
	} catch (error) {
		console.error(logError("isPlayerMembershipRegistered"), error);
		throw error;
	}
};

exports.updateMembershipByPlayerID = async (playerID, updates) => {
	try {
		const newUpdates = updates;

		if (updates.expire_date) {
			const issueDateUTC = new Date();
			const expireDateUTC = toZonedTime(`${updates.expire_date}T00:00:00`, vancouverTimeZone);

			const status = issueDateUTC < expireDateUTC ? "Active" : "Expired";
			newUpdates.status = status;

			const issueDateVancouver = formatInTimeZone(issueDateUTC, vancouverTimeZone, "yyyy-MM-dd");
			newUpdates.issue_date = issueDateVancouver;

			const expireDateVancouver = formatInTimeZone(expireDateUTC, vancouverTimeZone, "yyyy-MM-dd");
			newUpdates.expire_date = expireDateVancouver;
		}

		const columnNames = Object.keys(newUpdates);
		const columnValues = Object.values(newUpdates);

		const setClause = columnNames.map((element) => `${element} = ?`).join(", ");

		if (setClause) {
			const myQuery = `UPDATE Memberships SET ${setClause} WHERE player_id = ?`;
			columnValues.push(playerID);

			await db.promise().query(myQuery, columnValues);
			console.log("OH YES! Membership Updated Successfully!");
		}
	} catch (error) {
		console.error(logError("updateMembershipByPlayerID"), error);
		throw error;
	}
};

exports.registerMembershipByPlayerID = async (playerID, duration, privilegeLevel) => {
	try {
		const currentDate = new Date();
		const expireDate = new Date(new Date().getTime() + duration * 24 * 60 * 60 * 1000);

		await db.promise().query("INSERT INTO Memberships SET ?", {
			player_id: playerID,
			issue_date: currentDate,
			expire_date: expireDate,
			privilege_level: privilegeLevel,
			status: "Active",
		});

		console.log("OH YES! Membership Registered Successfully!");
	} catch (error) {
		console.error(logError("registerMembershipByPlayerID"), error);
		throw error;
	}
};

exports.deleteMembershipByPlayerID = async (playerID) => {
	try {
		await db.promise().query("DELETE FROM Memberships WHERE player_id = ?", [playerID]);

		console.log("OH YES! Membership Deleted Successfully!");
	} catch (error) {
		console.error(logError("deleteMembershipByPlayerID"), error);
		throw error;
	}
};

async function updateMembershipStatus() {
	try {
		const [results] = await db.promise().query("SELECT * FROM Memberships");

		results.forEach(async (element) => {
			const issueDateUTC = new Date();
			const expireDateUTC = element.expire_date;
			const status = issueDateUTC < expireDateUTC ? "Active" : "Expired";

			await db.promise().query("UPDATE Memberships SET status = ? WHERE player_id = ?", [status, element.player_id]);
		});
	} catch (error) {
		console.error(logError("updateMembershipStatus"), error);
		throw error;
	}
}

function getDaysRemaining(issueDate, expireDate) {
	const daysRemaining = differenceInDays(expireDate, issueDate);

	if (expireDate < new Date()) {
		return 0;
	}

	if (daysRemaining > 0) {
		return daysRemaining;
	}

	return 0;
}
