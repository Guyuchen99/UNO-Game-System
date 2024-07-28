const db = require("../config/db");
const { format } = require("date-fns");

exports.getRecentEvents = async () => {
  try {
    const [results] = await db.promise().query(`
        SELECT 
            event_id AS eventID, 
            name AS eventName, 
            start_date AS eventStartDate, 
            end_date AS eventEndDate, 
            num_of_participants AS numOfParticipants, 
            status AS eventStatus
        FROM Events
        ORDER BY event_id DESC 
        LIMIT 10;
    `);

    return results.map((element) => ({
      eventID: element.eventID,
      eventName: element.eventName,
      eventStartDate: format(new Date(element.eventStartDate), "yyyy-M-d"),
      eventEndDate: format(new Date(element.eventEndDate), "yyyy-M-d"),
      numOfParticipants: element.numOfParticipants,
      eventStatus: element.eventStatus,
    }));
  } catch (error) {
    console.error("OH NO! Error fetching recent events:", error.message);
    throw error;
  }
};
