const db = require("../config/db");

const logError = (functionName) => `OH NO! Error with ${functionName} in Search-Results Models:`;

const queryMap = {
	"event-participants-count-by-number": (number) => `
        SELECT 
            e.name AS event_name, 
            COUNT(ppe.player_id) AS participants
        FROM Events e
        JOIN PlayerParticipateEvents ppe ON e.event_id = ppe.event_id
        GROUP BY e.name
        HAVING COUNT(ppe.player_id) > ${number};
    `,
	"event-participants-count-by-country": () => `
        SELECT country, event_name, COUNT(player_id) AS participants
        FROM (
            SELECT p.country, e.name AS event_name, ppe.player_id
            FROM Players p
            JOIN PlayerParticipateEvents ppe ON p.player_id = ppe.player_id
            JOIN Events e ON ppe.event_id = e.event_id
        ) AS country_event_participation
        GROUP BY country, event_name;
    `,
	"player-participates-all-events": () => `
        SELECT p.username
        FROM Players p
        WHERE NOT EXISTS (
            SELECT e.event_id
            FROM Events e
            WHERE e.status = 'Completed' AND NOT EXISTS (
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
