import { Request, Response } from "express";
import { prisma } from "../prismaClient";

// Register an event
export const registerForEvent = async (req: Request, res: Response) => {
	const userId = req.user?.userId;
	if (!userId) return res.status(401).json({ message: "Unauthorized" });

	const eventIdStr = req.params.eventId;
	if (!eventIdStr) return res.status(400).json({ message: "Event ID is required" });

	const eventId = parseInt(eventIdStr, 10);
	if (isNaN(eventId)) return res.status(400).json({ message: "Invalid Event ID" });

	try {
		const existing = await prisma.registration.findUnique({
			where: { userId_eventId: { userId, eventId } },
		});
		if (existing) return res.status(400).json({ message: "Already registered" });

		const event = await prisma.event.findUnique({ where: { id: eventId } });
		if (!event) return res.status(404).json({ message: "Event not found" });

		const confirmedCount = await prisma.registration.count({
			where: { eventId, status: "CONFIRMED" },
		});

		const status = confirmedCount >= event.participantLimit ? "WAITLIST" : "CONFIRMED";

		const registration = await prisma.registration.create({
			data: { userId, eventId, status },
		});

		res.json(registration);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

// Get registrations of the logged-in user
export const getMyRegistrations = async (req: Request, res: Response) => {
	const userId = req.user?.userId;
	if (!userId) return res.status(401).json({ message: "Unauthorized" });

	try {
		const registrations = await prisma.registration.findMany({
			where: { userId },
			include: { event: true },
		});
		res.json(registrations);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

// Update registration status
export const updateRegistrationStatus = async (req: Request, res: Response) => {
	const idStr = req.params.id;
	if (!idStr) return res.status(400).json({ message: "Registration ID is required" });

	const id = parseInt(idStr, 10);
	if (isNaN(id)) return res.status(400).json({ message: "Invalid Registration ID" });

	const { status } = req.body;
	if (!["CONFIRMED", "WAITLIST", "CANCELLED"].includes(status)) {
		return res.status(400).json({ message: "Invalid status" });
	}

	try {
		const updated = await prisma.registration.update({
			where: { id },
			data: { status },
		});
		res.json(updated);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};
