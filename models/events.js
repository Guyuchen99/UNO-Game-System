const db = require("../config/db");
const { format } = require("date-fns");
const { toZonedTime, formatInTimeZone } = require("date-fns-tz");

const vancouverTimeZone = "America/Vancouver";

const logError = (functionName) => `OH NO! Error with ${functionName} in Events Models:`;

exports.getRecentEvents = async (order) => {
	let orderByClause;

	switch (order) {
		case "recent":
			orderByClause = "e.event_id DESC";
			break;
		case "startDate":
			orderByClause = "e.start_date, e.status, e.event_id DESC";
			break;
		case "endDate":
			orderByClause = "e.end_date DESC, e.status, e.event_id DESC";
			break;
		case "numOfParticipants":
			orderByClause = "e.num_of_participants DESC";
			break;
		case "status":
			orderByClause = `
                CASE 
                    WHEN e.status = 'Upcoming' THEN 1
                    WHEN e.status = 'Active' THEN 2
                    WHEN e.status = 'Completed' THEN 3
                END,
                e.event_id DESC
            `;
			break;
		default:
			orderByClause = "e.event_id DESC";
	}

	try {
		await updateEventStatus();

		const [results] = await db.promise().query(`
            SELECT 
                e.event_id AS eventID, 
                e.name AS eventName, 
                e.start_date AS eventStartDate, 
                e.end_date AS eventEndDate, 
                e.num_of_participants AS numOfParticipants, 
                e.status AS eventStatus
            FROM Events e
            ORDER BY ${orderByClause} 
        `);

		return results.map((element) => ({
			eventID: element.eventID,
			eventName: element.eventName,
			eventStartDate: format(new Date(element.eventStartDate), "yyyy-MM-dd"),
			eventEndDate: format(new Date(element.eventEndDate), "yyyy-MM-dd"),
			numOfParticipants: element.numOfParticipants,
			eventStatus: element.eventStatus,
		}));
	} catch (error) {
		console.error(logError("getRecentEvents"), error);
		throw error;
	}
};

exports.getEventDataByID = async (eventID) => {
	try {
		const myQuery = `
            SELECT 
            	e.event_id AS eventID,
				e.name AS eventName,
				e.start_date AS eventStartDate,
                e.end_date AS eventEndDate,
				e.num_of_participants AS eventNumOfParticipants, 
				e.status AS eventStatus
            FROM Events e
            WHERE event_id = ?
		`;

		const [results] = await db.promise().query(myQuery, [eventID]);
		results[0].eventStartDate = format(new Date(results[0].eventStartDate), "yyyy-MM-dd");
		results[0].eventEndDate = format(new Date(results[0].eventEndDate), "yyyy-MM-dd");

		return results[0];
	} catch (error) {
		console.error(logError("getEventDataByID"), error);
		throw error;
	}
};

exports.isEventNameAvailable = async (eventName) => {
	try {
		const [results] = await db.promise().query("SELECT * FROM Events WHERE name = ?", [eventName]);

		return results.length === 0;
	} catch (error) {
		console.error(logError("isEventNameAvailable"), error);
		throw error;
	}
};

exports.updateEventByID = async (eventID, updates) => {
	try {
		const newUpdates = updates;

		if (updates.start_date || updates.end_date) {
			const todayUTC = new Date();
			const startDateUTC = toZonedTime(`${updates.start_date}T00:00:00`, vancouverTimeZone);
			const endDateUTC = toZonedTime(`${updates.end_date}T00:00:00`, vancouverTimeZone);

			let currentStatus;

			if (todayUTC < startDateUTC) {
				currentStatus = "Upcoming";
			} else if (endDateUTC < todayUTC) {
				currentStatus = "Expired";
			} else {
				currentStatus = "Active";
			}
			newUpdates.status = currentStatus;

			const startDateVancouver = formatInTimeZone(startDateUTC, vancouverTimeZone, "yyyy-MM-dd");
			newUpdates.start_date = startDateVancouver;

			const endDateVancouver = formatInTimeZone(endDateUTC, vancouverTimeZone, "yyyy-MM-dd");
			newUpdates.end_date = endDateVancouver;
		}

		const columnNames = Object.keys(newUpdates);
		const columnValues = Object.values(newUpdates);

		const setClause = columnNames.map((element) => `${element} = ?`).join(", ");

		if (setClause) {
			const myQuery = `UPDATE Events SET ${setClause} WHERE event_id = ?`;
			columnValues.push(eventID);

			await db.promise().query(myQuery, columnValues);
			console.log("OH YES! Events Updated Successfully!");
		}
	} catch (error) {
		console.error(logError("updateEventByID"), error);
		throw error;
	}
};

exports.registerEventByID = async (name, startDate, endDate) => {
	try {
		const todayUTC = new Date();
		const startDateUTC = toZonedTime(`${startDate}T00:00:00`, vancouverTimeZone);
		const endDateUTC = toZonedTime(`${endDate}T00:00:00`, vancouverTimeZone);

		let currentStatus;

		if (todayUTC < startDateUTC) {
			currentStatus = "Upcoming";
		} else if (endDateUTC < todayUTC) {
			currentStatus = "Expired";
		} else {
			currentStatus = "Active";
		}

		await db.promise().query("INSERT INTO Events SET ?", {
			name: name,
			start_date: formatInTimeZone(new Date(startDateUTC), vancouverTimeZone, "yyyy-MM-dd"),
			end_date: formatInTimeZone(new Date(endDateUTC), vancouverTimeZone, "yyyy-MM-dd"),
			status: currentStatus,
		});

		console.log("OH YES! Event Registered Successfully!");
	} catch (error) {
		console.error(logError("registerEventByID"), error);
		throw error;
	}
};

exports.deleteEventByID = async (eventID) => {
	try {
		await db.promise().query("DELETE FROM Events WHERE event_id = ?", [eventID]);

		console.log("OH YES! Event Deleted Successfully!");
	} catch (error) {
		console.error(logError("deleteEventByID"), error);
		throw error;
	}
};

async function updateEventStatus() {
	try {
		const [results] = await db.promise().query("SELECT * FROM Events");

		results.forEach(async (element) => {
			const todayUTC = new Date();
			const startDateUTC = element.start_date;
			const endDateUTC = element.end_date;

			let currentStatus;

			if (todayUTC < startDateUTC) {
				currentStatus = "Upcoming";
			} else if (endDateUTC < todayUTC) {
				currentStatus = "Expired";
			} else {
				currentStatus = "Active";
			}

			await db.promise().query("UPDATE Events SET status = ? WHERE event_id = ?", [currentStatus, element.event_id]);
		});
	} catch (error) {
		console.error(logError("updateEventStatus"), error);
		throw error;
	}
}
