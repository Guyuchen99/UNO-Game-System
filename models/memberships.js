const { formatInTimeZone } = require("date-fns-tz");
const db = require("../config/db");
const logError = (functionName) => `OH NO! Error with ${functionName} in Models:`;

const timeZone = "America/Vancouver";

exports.getRecentMemberships = async () => {
	try {
		const [results] = await db.promise().query(`
			SELECT 
            	p.player_id AS playerID, 
				p.username AS username,
				mp.issue_time AS membershipIssueTime,
				mp.days_remaining AS membershipDaysRemaining,
				mpc.privilege_class AS membershipPrivilegeClass,
				mp.privilege_level AS membershipPrivilegeLevel,
				mp.status AS membershipStatus
			FROM MembershipInPlayer mp
			JOIN Players p ON mp.player_id = p.player_id
			JOIN MembershipExpireDate me ON mp.issue_time = me.issue_time AND mp.days_remaining = me.days_remaining
			JOIN MembershipPrivilegeClass mpc ON mp.privilege_level = mpc.privilege_level
			ORDER BY mp.player_id DESC LIMIT 10; 
    	`);

		return results.map((element) => ({
			playeID: element.playerID, 
			username: element.username,
			membershipIssueTime: formatInTimeZone(element.membershipIssueTime, timeZone, "yyyy-MM-dd HH:mm:ss zzz"),
			membershipDaysRemaining: element.membershipDaysRemaining,
			membershipPrivilegeClass: element.membershipPrivilegeClass,
			membershipPrivilegeLevel: element.membershipPrivilegeLevel,
			membershipStatus: element.membershipStatus,
		}));
	} catch (error) {
		console.error(logError("getRecentMemberships"), error.message);
		throw error;
	}
};

exports.registerMembership = async (username, duration, privilegeLevel) => {
	try {
		currentDate = new Date();
		expireDate = new Date(currentDate);
		expireDate.setDate(expireDate.getDate() + duration);

		[results, fields] = await db.promise().query("SELECT player_id FROM Players WHERE username = ?", [username]);

		playerID = results[0].player_id;
		if (!playerID) {
			throw new Error("Player not found");
		}

		// first insert into MembershipExpireDate because of foreign key constraint
		await db
			.promise()
			.query("INSERT INTO MembershipExpireDate SET ?", { issue_time: currentDate, days_remaining: duration, expire_time: expireDate });
		if (results.affectedRows === 0) {
			throw new Error("Failed to insert into MembershipExpireDate");
		}

		// insert into MembershipInPlayer
		await db.promise().query("INSERT INTO MembershipInPlayer SET ?", {
			player_id: playerID,
			issue_time: currentDate,
			days_remaining: duration,
			privilege_level: privilegeLevel,
			status: "Active",
		});
		console.log("Membership inserted");
	} catch (error) {
		console.error("OH NO! Error during register membership:", error.message);
		throw error;
	}
};

exports.deleteMembershipByUsername = async (username) => {
	try {
		console.log("Username: ", username);

		playerID = await db.promise().query("SELECT player_id FROM Players WHERE username = ?", [username]);
		playerID = playerID[0][0].player_id;
		if (!playerID) {
			throw new Error("Player not found");
		}
		membershipID = await db.promise().query("SELECT membership_id FROM MembershipInPlayer WHERE player_id = ?", [playerID]);
		membershipID = membershipID[0][0].membership_id;
		issueTime = await db.promise().query("SELECT issue_time FROM MembershipInPlayer WHERE player_id = ?", [playerID]);
		issueTime = issueTime[0][0].issue_time;
		daysRemaining = await db.promise().query("SELECT days_remaining FROM MembershipInPlayer WHERE player_id = ?", [playerID]);
		daysRemaining = daysRemaining[0][0].days_remaining;

		await db.promise().query("DELETE FROM MembershipInPlayer WHERE player_id = ?", [playerID]);
		await db.promise().query("DELETE FROM MembershipExpireDate WHERE issue_time = ? AND days_remaining = ?", [issueTime, daysRemaining]);

		console.log("Membership deleted successfully.");
	} catch (error) {
		console.error(logError("deleteMembershipByUsername"), error.message);
		throw error;
	}
};

exports.isPlayerRegistered = async (username) => {
	try {
		const [results] = await db.promise().query("SELECT player_id FROM Players WHERE username = ?", [username]);

		return results.length === 0;
	} catch (error) {
		console.error(logError("isPlayerRegistered"), error);
		throw error;
	}
};
