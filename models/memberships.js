const db = require("../config/db");
const { format } = require("date-fns");

exports.getRecentMemberships = async () => {
  try {
    const [results] = await db.promise().query(`
        SELECT 
            p.username AS username,
            mp.issue_date AS membershipIssueDate,
            mp.days_remaining AS membershipDaysRemaining,
            mpc.privilege_class AS membershipPrivilegeClass,
            mp.privilege_level AS membershipPrivilegeLevel,
            mp.status AS membershipStatus
        FROM MembershipInPlayer mp
        JOIN Players p ON mp.player_id = p.player_id
        JOIN MembershipExpireDate me ON mp.issue_date = me.issue_date AND mp.days_remaining = me.days_remaining
        JOIN MembershipPrivilegeClass mpc ON mp.privilege_level = mpc.privilege_level
        ORDER BY mp.player_id DESC LIMIT 10; 
    `);

    return results.map((element) => ({
      username: element.username,
      membershipIssueDate: format(element.membershipIssueDate, "yyyy-M-d"),
      membershipDaysRemaining: element.membershipDaysRemaining,
      membershipPrivilegeClass: element.membershipPrivilegeClass,
      membershipPrivilegeLevel: element.membershipPrivilegeLevel,
      membershipStatus: element.membershipStatus,
    }));
  } catch (error) {
    console.error("OH NO! Error fetching recent memberships:", error.message);
    throw error;
  }
};
