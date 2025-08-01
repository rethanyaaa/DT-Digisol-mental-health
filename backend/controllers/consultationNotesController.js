import mongoose from "mongoose";
import consultationNotesModel from "../models/consultationNotesModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";

// Create consultation notes
export const createConsultationNotes = async (req, res) => {
  try {
    const {
      appointmentId,
      doctorId,
      patientId,
      chiefComplaints,
      presentIllness,
      pastMedicalHistory,
      familyHistory,
      socialHistory,
      vitalSigns,
      physicalExamination,
      provisionalDiagnosis,
      differentialDiagnosis,
      finalDiagnosis,
      treatmentPlan,
      prescriptions,
      investigations,
      followUpRequired,
      followUpDate,
      followUpInstructions,
      clinicalNotes,
      patientInstructions,
    } = req.body;

    // Validate required fields
    if (
      !appointmentId ||
      !doctorId ||
      !patientId ||
      !chiefComplaints ||
      !provisionalDiagnosis
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: appointmentId, doctorId, patientId, chiefComplaints, provisionalDiagnosis",
      });
    }

    // Check if consultation notes already exist for this appointment
    const existingNotes = await consultationNotesModel.findOne({
      appointmentId,
    });
    if (existingNotes) {
      return res.status(400).json({
        success: false,
        message: "Consultation notes already exist for this appointment",
      });
    }

    // Create new consultation notes
    const consultationNotes = new consultationNotesModel({
      appointmentId,
      doctorId,
      patientId,
      chiefComplaints,
      presentIllness,
      pastMedicalHistory,
      familyHistory,
      socialHistory,
      vitalSigns,
      physicalExamination,
      provisionalDiagnosis,
      differentialDiagnosis,
      finalDiagnosis,
      treatmentPlan,
      prescriptions: prescriptions || [],
      investigations: investigations || [],
      followUpRequired,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      followUpInstructions,
      clinicalNotes,
      patientInstructions,
      status: "completed",
    });

    await consultationNotes.save();

    res.status(201).json({
      success: true,
      message: "Consultation notes created successfully",
      data: consultationNotes,
    });
  } catch (error) {
    console.error("Error creating consultation notes:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Get consultation notes by appointment ID
 export const getConsultationNotesByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Validate appointmentId
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const consultationNotes = await consultationNotesModel
      .findOne({ appointmentId: new mongoose.Types.ObjectId(appointmentId) })
      .populate({
        path: "doctorId",
        select: "name specialization"
      })
      .populate({
        path: "patientId",
        select: "name dob gender" // Include dob to calculate age if needed
      })
      .populate({
        path: "appointmentId",
        select: "slotDate slotTime consultationType status"
      });

    if (!consultationNotes) {
      return res.status(404).json({
        success: false,
        message: "Consultation notes not found for this appointment",
      });
    }

    res.status(200).json({
      success: true,
      data: consultationNotes,
    });
  } catch (error) {
    console.error("Error getting consultation notes:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Get all consultation notes for a doctor
 // Get all consultation notes for a doctor (with proper status filtering)
export const getDoctorConsultationNotes = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10, status, search } = req.query;

    // Build the query object
    const query = { doctorId: new mongoose.Types.ObjectId(doctorId) };
    
    // Add status filter if provided
    if (status && ['draft', 'completed', 'archived'].includes(status)) {
      query.status = status;
    }

    // Add search functionality if needed
    if (search) {
      query.$or = [
        { 'chiefComplaints': { $regex: search, $options: 'i' } },
        { 'provisionalDiagnosis': { $regex: search, $options: 'i' } },
        { 'finalDiagnosis': { $regex: search, $options: 'i' } }
      ];
    }

    const consultationNotes = await consultationNotesModel
      .find(query)
      .populate("patientId", "name age gender")
      .populate("appointmentId", "slotDate slotTime consultationType")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await consultationNotesModel.countDocuments(query);

    res.status(200).json({
      success: true,
      data: consultationNotes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        recordsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error getting doctor consultation notes:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Get all consultation notes for a patient
export const getPatientConsultationNotes = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const consultationNotes = await consultationNotesModel
      .find({ patientId })
      .populate("doctorId", "name specialization")
      .populate("appointmentId", "slotDate slotTime consultationType")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await consultationNotesModel.countDocuments({ patientId });

    res.status(200).json({
      success: true,
      data: consultationNotes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        recordsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error getting patient consultation notes:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Update consultation notes
 export const updateConsultationNotes = async (req, res) => {
  try {
    const { id } = req.params; // Changed from notesId to id
    const updateData = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation notes ID",
      });
    }

    // Find existing document first
    const existingNotes = await consultationNotesModel.findById(id);
    if (!existingNotes) {
      return res.status(404).json({
        success: false,
        message: "Consultation notes not found",
      });
    }

    // Only remove truly immutable fields
    const immutableFields = ['appointmentId', 'doctorId', 'patientId', 'createdAt'];
    immutableFields.forEach(field => delete updateData[field]);

    // Perform update
    const updatedNotes = await consultationNotesModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('patientId doctorId appointmentId');

    res.status(200).json({
      success: true,
      message: "Consultation notes updated successfully",
      data: updatedNotes,
    });
  } catch (error) {
    console.error("Error updating consultation notes:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};
// Delete consultation notes
export const deleteConsultationNotes = async (req, res) => {
  try {
    const { notesId } = req.params;

    const consultationNotes = await consultationNotesModel.findByIdAndDelete(
      notesId
    );

    if (!consultationNotes) {
      return res.status(404).json({
        success: false,
        message: "Consultation notes not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Consultation notes deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting consultation notes:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Get consultation notes statistics for doctor
export const getConsultationNotesStats = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const stats = await consultationNotesModel.aggregate([
      { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
      {
        $group: {
          _id: null,
          totalConsultations: { $sum: 1 },
          completedConsultations: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          draftConsultations: {
            $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
          },
        },
      },
    ]);

    const monthlyStats = await consultationNotesModel.aggregate([
      { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: stats[0] || {
          totalConsultations: 0,
          completedConsultations: 0,
          draftConsultations: 0,
        },
        monthly: monthlyStats,
      },
    });
  } catch (error) {
    console.error("Error getting consultation notes stats:", error);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};
