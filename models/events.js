const db = require("../config/db");
const { format } = require("date-fns");

const getRecentEvents = async () => {
  try {
    const [results] = await db.promise().query(`
        SELECT 
            event_id, 
            name, 
            start_date, 
            end_date, 
            num_of_participants, 
            status
        FROM Events
        ORDER BY event_id DESC LIMIT 10; 
      `);
    return results;
  } catch (error) {
    console.error("OH NO! Error fetching recent events:", error.message);
    throw error;
  }
};

exports.getEventData = async () => {
  const recentEvents = await getRecentEvents();

  return {
    recentEvents: recentEvents.map((element) => ({
      name: element.name,
      eventStartDate: format(element.start_date, "yyyy-M-d"),
      eventEndDate: format(element.end_date, "yyyy-M-d"),
      numOfParticipants: element.num_of_participants,
      eventStatus: element.status,
    })),
  };
};
