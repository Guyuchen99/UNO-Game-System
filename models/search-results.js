const db = require("../config/db");

const logError = (functionName) => `OH NO! Error with ${functionName} in Models:`;

const queryMap = {
	"event-participants-count-by-number": (number) => `
    SELECT e.name, COUNT(pe.player_id) AS participants
    FROM Events e
    JOIN PlayerParticipateEvents pe ON e.event_id = pe.event_id
    GROUP BY e.name
    HAVING COUNT(pe.player_id) > ${number};
  `,
	"event-participants-count-by-country": () => `
    SELECT country, event_name, COUNT(player_id) AS participants
    FROM (
      SELECT p.country, e.name AS event_name, pe.player_id
      FROM Players p
      JOIN PlayerParticipateEvents pe ON p.player_id = pe.player_id
      JOIN Events e ON pe.event_id = e.event_id
    ) AS country_event_participation
    GROUP BY country, event_name;
  `,
	"player-participates-all-events": () => `
    SELECT p.username
    FROM Players p
    WHERE NOT EXISTS (
      SELECT e.event_id
      FROM Events e
      WHERE NOT EXISTS (
        SELECT pe.player_id
        FROM PlayerParticipateEvents pe
        WHERE pe.event_id = e.event_id AND pe.player_id = p.player_id
      )
    );
  `,
};

exports.getSearchResultData = async (queryType, number = 10) => {
	const queryFunction = queryMap[queryType];

	if (!queryFunction) {
		throw new Error(`This ${queryType} did not match anything in our database...`);
	}

	const myQuery = queryFunction(number);

	try {
		const [results] = await db.promise().query(myQuery);
		return results;
	} catch (error) {
		console.error(logError("getSearchResultData"), error);
		throw error;
	}
};
