const eventsModel = require("../models/events");

const logError = (functionName) => `OH NO! Error with ${functionName} in Events Controllers:`;
const resError = (functionName) => `OH NO! Internal Server Error with ${functionName} in Events Controllers:`;

exports.loadEvents = async (req, res) => {
	if (!req.loginStatus) {
		return res.redirect("/login");
	}

	const { order } = req.query;

	try {
		const recentEvents = await eventsModel.getRecentEvents(order);

		res.render("events", { recentEvents });
	} catch (error) {
		console.error(logError("loadEvents"), error);
		res.status(500).send(resError("loadEvents"));
	}
};

exports.fetchEventData = async (req, res) => {
	const { eventID } = req.query;

	try {
		const results = await eventsModel.getEventDataByID(eventID);

		res.status(200).json(results);
	} catch (error) {
		console.error(logError("fetchEventData"), error);
		res.status(500).send(resError("fetchEventData"));
	}
};

exports.checkFormInput = async (req, res) => {
	const { eventName } = req.query;

	try {
		const eventNameAvailable = await eventsModel.isEventNameAvailable(eventName);

		if (!eventNameAvailable) {
			return res.status(409).send("OH NO! Event Name already taken!");
		}

		return res.status(200).send("OH YES! No Errors in Form Input!");
	} catch (error) {
		console.error(logError("checkFormInput"), error);
		res.status(500).send(resError("checkFormInput"));
	}
};

exports.updateEvent = async (req, res) => {
	const { eventID, name, startDate, endDate } = req.body;

	try {
		const results = await eventsModel.getEventDataByID(eventID);
		const updates = {};

		if (name !== results.eventName) {
			updates.name = name;
		}

		if (startDate !== results.eventStartDate || endDate !== results.eventEndDate) {
			updates.start_date = startDate;
			updates.end_date = endDate;
		}

		if (Object.keys(updates).length > 0) {
			await eventsModel.updateEventByID(eventID, updates);
		}

		res.redirect("/events");
	} catch (error) {
		console.error(logError("updateEvent"), error);
		res.status(500).send(resError("updateEvent"));
	}
};

exports.registerEvent = async (req, res) => {
	const { name, startDate, endDate } = req.body;

	try {
		await eventsModel.registerEventByID(name, startDate, endDate);

		res.redirect("/events");
	} catch (error) {
		console.error(logError("registerEvent"), error);
		res.status(500).send(resError("registerEvent"));
	}
};

exports.deleteEvent = async (req, res) => {
	const { item: eventID } = req.body;

	try {
		await eventsModel.deleteEventByID(eventID);

		res.status(200).send("OH YES! Event Deleted Successfully");
	} catch (error) {
		console.error(logError("deleteEvent"), error);
		res.status(500).send(resError("deleteEvent"));
	}
};
