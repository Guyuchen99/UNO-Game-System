const db = require("../config/db");
const { formatInTimeZone } = require("date-fns-tz");

const timeZone = "America/Vancouver";

const getRecentMatches = async () => {
  try {
    const [results] = await db.promise().query(
      `SELECT * FROM Matches 
       ORDER BY match_id DESC 
       LIMIT 10`
    );
    return results;
  } catch (error) {
    console.error("OH NO! Error fetching recent matches:", error.message);
    throw error;
  }
};

exports.getMatchData = async () => {
  const recentMatches = await getRecentMatches();

  return {
    recentMatches: recentMatches.map((element) => ({
      matchId: element.match_id,
      matchStartTime: formatInTimeZone(element.start_time, timeZone, "yyyy-MM-dd HH:mm:ss zzz"),
      matchEndTime: element.end_time ? formatInTimeZone(element.end_time, timeZone, "yyyy-MM-dd HH:mm:ss zzz") : "TBD",
      matchWinner: element.winner || "TDB",
      matchStatus: element.status,
    })),
  };
};
