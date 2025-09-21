import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
	createEvent,
	getEvents,
	getEventById,
	updateEvent,
	deleteEvent,
	getEventParticipants,
} from "../controllers/events";

import multer from "multer";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
	destination: "uploads/",
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});
const upload = multer({ storage });

// Upload route for images
router.post("/upload", authenticate, authorize("ADMIN"), upload.single("image"), (req, res) => {
	if (!req.file) return res.status(400).json({ message: "No file uploaded" });
	res.json({ url: `/uploads/${req.file.filename}` });
});

// Admin routes
router.post("/", authenticate, authorize("ADMIN"), createEvent);
router.put("/:id", authenticate, authorize("ADMIN"), updateEvent);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteEvent);
router.get("/:id/participants", authenticate, authorize("ADMIN"), getEventParticipants);

// Participant routes
router.get("/", authenticate, getEvents);
router.get("/:id", authenticate, getEventById);

export default router;
