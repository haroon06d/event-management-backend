import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  registerForEvent,
  getMyRegistrations,
  updateRegistrationStatus,
} from "../controllers/registrations";

const router = Router();

// Participant routes
router.post("/:eventId", authenticate, authorize("PARTICIPANT"), registerForEvent);
router.get("/me", authenticate, getMyRegistrations);

// Admin route
router.put("/:id/status", authenticate, authorize("ADMIN"), updateRegistrationStatus);

export default router;
