import { Request, Response } from "express";
import { prisma } from "../prismaClient";

interface EventBody {
	title?: string;
	description?: string;
	image?: string;
	datetime?: string;
	venue?: string;
	organiser?: string;
	participantLimit?: number;
	status?: "DRAFT" | "PUBLISHED" | "CANCELLED";
}

// Create Event
export const createEvent = async (req: Request, res: Response) => {
	try {
		const { title, description, image, datetime, venue, organiser, participantLimit, status } = req.body;

		if (!title || !description || !datetime || !venue || !organiser || participantLimit === undefined) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		const event = await prisma.event.create({
			data: {
				title,
				description,
				image: image || null,
				datetime: new Date(datetime),
				venue,
				organiser,
				participantLimit,
				status: status || "PUBLISHED",
			},
		});

		res.json(event);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

// Update Event
export const updateEvent = async (req: Request<{ id: string }, {}, EventBody>, res: Response) => {
	const id = parseInt(req.params.id);
	try {
		const { title, description, image, datetime, venue, organiser, participantLimit, status } = req.body;

		const updated = await prisma.event.update({
			where: { id },
			data: {
				...(title && { title }),
				...(description && { description }),
				...(image !== undefined && { image }),
				...(datetime && { datetime: new Date(datetime) }),
				...(venue && { venue }),
				...(organiser && { organiser }),
				...(participantLimit !== undefined && { participantLimit }),
				...(status && { status }),
			},
		});

		res.json(updated);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

// Get all events
export const getEvents = async (req: Request, res: Response) => {
	try {
		const events = await prisma.event.findMany({
			orderBy: { datetime: "asc" },
		});
		res.json(events);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

// Get single event by ID
export const getEventById = async (req: Request<{ id: string }>, res: Response) => {
	const id = parseInt(req.params.id);
	try {
		const event = await prisma.event.findUnique({ where: { id } });
		if (!event) return res.status(404).json({ message: "Event not found" });
		res.json(event);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

// Delete Event
export const deleteEvent = async (req: Request<{ id: string }>, res: Response) => {
	const id = parseInt(req.params.id);
	try {
		await prisma.event.delete({ where: { id } });
		res.json({ message: "Event deleted" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

// Get participants for an event
export const getEventParticipants = async (req: Request<{ id: string }>, res: Response) => {
	const id = parseInt(req.params.id);
	try {
		const registrations = await prisma.registration.findMany({
			where: { eventId: id },
			include: { user: true },
		});
		res.json(registrations);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};
