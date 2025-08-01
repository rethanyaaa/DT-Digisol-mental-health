import consultationModel from "../models/consultationModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import {
  generateConsultationRoomId,
  generateConsultationToken,
  createConsultationLink,
} from "../utils/consultationUtils.js";
import { sendConsultationEmail } from "../services/emailService.js";

// Generate consultation room and send email
export const generateConsultationLink = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    // Get appointment details
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check if consultation is already created
    const existingConsultation = await consultationModel.findOne({
      appointmentId,
    });
    if (existingConsultation) {
      return res.status(400).json({
        success: false,
        message: "Consultation link already exists for this appointment",
      });
    }

    // Generate consultation details
    const roomId = generateConsultationRoomId();
    const token = generateConsultationToken(appointmentId, roomId);

    // Use patient frontend URL for consultation links (patients will use this)
    const patientFrontendUrl =
      process.env.PATIENT_FRONTEND_URL || "http://localhost:5173";
    const consultationLink = createConsultationLink(
      roomId,
      token,
      patientFrontendUrl
    );
    const testLink = `${patientFrontendUrl}/device-test?roomId=${roomId}`;

    // Set expiration (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create consultation record
    const consultation = new consultationModel({
      appointmentId,
      roomId,
      token,
      consultationLink,
      expiresAt,
    });

    await consultation.save();

    // Get user and doctor details for email
    const user = await userModel.findById(appointment.userId);
    const doctor = await doctorModel.findById(appointment.docId);

    if (!user || !doctor) {
      return res.status(404).json({
        success: false,
        message: "User or doctor not found",
      });
    }

    // Format appointment date and time
    const appointmentDate = new Date(
      appointment.slotDate.split("/").reverse().join("-")
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Prepare email data
    const emailData = {
      patientName: user.name,
      patientEmail: user.email,
      doctorName: doctor.name,
      appointmentDate,
      appointmentTime: appointment.slotTime,
      consultationLink,
      testLink,
      roomId,
    };

    // Send consultation email
    try {
      await sendConsultationEmail(emailData);
    } catch (emailError) {
      console.error(
        "Failed to send email, but consultation was created:",
        emailError
      );
      // Don't fail the request if email fails, just log it
    }

    res.status(201).json({
      success: true,
      message: "Consultation link generated and email sent successfully",
      data: {
        roomId,
        consultationLink,
        testLink,
        expiresAt,
      },
    });
  } catch (error) {
    console.error("Error generating consultation link:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate consultation link",
    });
  }
};

// Get consultation details by room ID
export const getConsultationDetails = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { token } = req.query;

    const consultation = await consultationModel.findOne({ roomId });
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    // Validate token
    if (token !== consultation.token) {
      return res.status(401).json({
        success: false,
        message: "Invalid consultation token",
      });
    }

    // Check if consultation is expired
    if (consultation.isExpired()) {
      return res.status(400).json({
        success: false,
        message: "Consultation has expired",
      });
    }

    // Get appointment details
    const appointment = await appointmentModel.findById(
      consultation.appointmentId
    );
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        consultation,
        appointment,
      },
    });
  } catch (error) {
    console.error("Error getting consultation details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get consultation details",
    });
  }
};

// Update consultation status
export const updateConsultationStatus = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { status, participantType } = req.body;

    const consultation = await consultationModel.findOne({ roomId });
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    // Update status
    if (status) {
      consultation.status = status;

      if (status === "active" && !consultation.startTime) {
        consultation.startTime = new Date();
      } else if (status === "completed" && !consultation.endTime) {
        consultation.endTime = new Date();
      }
    }

    // Update participant status
    if (participantType && ["patient", "doctor"].includes(participantType)) {
      consultation.participants[participantType].joined = true;
      consultation.participants[participantType].joinedAt = new Date();
    }

    await consultation.save();

    res.status(200).json({
      success: true,
      message: "Consultation status updated successfully",
      data: consultation,
    });
  } catch (error) {
    console.error("Error updating consultation status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update consultation status",
    });
  }
};

// Get all consultations for an appointment
export const getAppointmentConsultations = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    console.log(`Getting consultations for appointment: ${appointmentId}`);
    console.log(`Request user type: ${req.userType}`);
    console.log(
      `Request user:`,
      req.user ? req.user._id : req.doctor ? req.doctor._id : "unknown"
    );

    const consultations = await consultationModel
      .find({ appointmentId })
      .sort({ createdAt: -1 });

    console.log(
      `Found ${consultations.length} consultations for appointment ${appointmentId}`
    );

    res.status(200).json({
      success: true,
      data: consultations,
    });
  } catch (error) {
    console.error("Error getting appointment consultations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get appointment consultations",
    });
  }
};

// Clean up expired consultations
export const cleanupExpiredConsultations = async () => {
  try {
    const expiredConsultations = await consultationModel.find({
      expiresAt: { $lt: new Date() },
      status: { $in: ["pending", "active"] },
    });

    for (const consultation of expiredConsultations) {
      consultation.status = "cancelled";
      await consultation.save();
    }

    console.log(
      `Cleaned up ${expiredConsultations.length} expired consultations`
    );
  } catch (error) {
    console.error("Error cleaning up expired consultations:", error);
  }
};
