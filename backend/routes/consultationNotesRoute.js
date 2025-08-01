import express from "express";
import {
  createConsultationNotes,
  getConsultationNotesByAppointment,
  getDoctorConsultationNotes,
  getPatientConsultationNotes,
  updateConsultationNotes,
  deleteConsultationNotes,
  getConsultationNotesStats,
} from "../controllers/consultationNotesController.js";
import authDoctor from "../middlewares/authDoctor.js";
import authUser from "../middlewares/authUser.js";
import authUserOrDoctor from "../middlewares/authUserOrDoctor.js";

const consultationNotesRouter = express.Router();

// Doctor routes (require doctor authentication)
consultationNotesRouter.post("/create", authDoctor, createConsultationNotes);
consultationNotesRouter.get(
  "/doctor/:doctorId",
  authDoctor,
  getDoctorConsultationNotes
);
 // Update the route parameter names to match the controller
consultationNotesRouter.put("/:id", authDoctor, updateConsultationNotes);
consultationNotesRouter.delete("/:id", authDoctor, deleteConsultationNotes);
// Patient routes (require user authentication)
consultationNotesRouter.get(
  "/patient/:patientId",
  authUser,
  getPatientConsultationNotes
);

// Shared routes (can be accessed by both doctor and patient)
consultationNotesRouter.get(
  "/appointment/:appointmentId",
  authUserOrDoctor,
  getConsultationNotesByAppointment
);

export default consultationNotesRouter;
