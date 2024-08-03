const db = require("../config/db");
const { formatInTimeZone } = require("date-fns-tz");

const timeZone = "America/Vancouver";

exports.getRecentMatches = async () => {
  try {
    const [results] = await db.promise().query(`
        SELECT 
            match_id AS matchID, 
            start_time AS matchStartTime, 
            end_time AS matchEndTime, 
            winner AS matchWinner, 
            status AS matchStatus
        FROM Matches 
        ORDER BY match_id DESC 
        LIMIT 10
    `);

    return results.map((element) => ({
      matchID: element.matchID,
      matchStartTime: formatInTimeZone(element.matchStartTime, timeZone, "yyyy-MM-dd HH:mm:ss zzz"),
      matchEndTime: element.matchEndTime ? formatInTimeZone(element.matchEndTime, timeZone, "yyyy-MM-dd HH:mm:ss zzz") : "TBD",
      matchWinner: element.matchWinner || "TDB",
      matchStatus: element.matchStatus,
    }));
  } catch (error) {
    console.error("OH NO! Error fetching recent matches:", error.message);
    throw error;
  }
};
