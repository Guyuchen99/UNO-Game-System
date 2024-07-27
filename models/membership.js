const db = require("../config/db");
const { format } = require("date-fns");

const getRecentMemberships = async () => {
  try {
    const [results] = await db.promise().query(`
        SELECT 
            p.username,
            mp.issue_date,
            mp.days_remaining,
            mpc.privilege_class,
            mp.privilege_level,
			mp.status
        FROM MembershipInPlayer mp
        JOIN Players p ON mp.player_id = p.player_id
        JOIN MembershipExpireDate me ON mp.issue_date = me.issue_date AND mp.days_remaining = me.days_remaining
        JOIN MembershipPrivilegeClass mpc ON mp.privilege_level = mpc.privilege_level
        ORDER BY mp.player_id DESC LIMIT 10; 
      `);
    return results;
  } catch (error) {
    console.error("OH NO! Error fetching recent memberships:", error.message);
    throw error;
  }
};

exports.getMembershipData = async () => {
  const recentMemberships = await getRecentMemberships();

  return {
    recentMemberships: recentMemberships.map((element) => ({
      username: element.username,
      membershipIssueDate: format(element.issue_date, "yyyy-M-d"),
      membershipDaysRemaining: element.days_remaining,
      membershipPrivilegeClass: element.privilege_class,
      membershipPrivilegeLevel: element.privilege_level,
      membershipStatus: element.status,
    })),
  };
};
