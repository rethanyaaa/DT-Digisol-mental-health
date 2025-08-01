import express from "express";
import {
  generateConsultationLink,
  getConsultationDetails,
  updateConsultationStatus,
  getAppointmentConsultations,
} from "../controllers/consultationController.js";
import authUser from "../middlewares/authUser.js";
import authUserOrDoctor from "../middlewares/authUserOrDoctor.js"; // Add this import

const router = express.Router();

// Generate consultation link and send email (requires user auth)
router.post("/generate-link", authUser, generateConsultationLink);

// Get consultation details by room ID (public endpoint for joining)
router.get("/details/:roomId", getConsultationDetails);

// Update consultation status (requires user auth)
router.put("/status/:roomId", authUser, updateConsultationStatus);

// Get all consultations for an appointment (requires user OR doctor auth)
router.get(
  "/appointment/:appointmentId",
  authUserOrDoctor, // Changed from authUser to authUserOrDoctor
  getAppointmentConsultations
);

export default router;
