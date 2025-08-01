import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  instructions: { type: String },
  beforeAfterMeal: {
    type: String,
    enum: ["before", "after", "empty-stomach", "anytime"],
    default: "anytime",
  },
});

const consultationNotesSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "appointment",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  consultationDate: {
    type: Date,
    default: Date.now,
  },

  // Patient Symptoms and History
  chiefComplaints: {
    type: String,
    required: true,
  },
  presentIllness: {
    type: String,
  },
  pastMedicalHistory: {
    type: String,
  },
  familyHistory: {
    type: String,
  },
  socialHistory: {
    type: String,
  },

  // Physical Examination
  vitalSigns: {
    bloodPressure: { type: String },
    pulse: { type: String },
    temperature: { type: String },
    respiratoryRate: { type: String },
    weight: { type: String },
    height: { type: String },
  },
  physicalExamination: {
    type: String,
  },

  // Diagnosis and Assessment
  provisionalDiagnosis: {
    type: String,
    required: true,
  },
  differentialDiagnosis: [
    {
      type: String,
    },
  ],
  finalDiagnosis: {
    type: String,
  },

  // Treatment Plan
  treatmentPlan: {
    type: String,
  },
  prescriptions: [prescriptionSchema],

  // Investigations
  investigations: [
    {
      testName: { type: String, required: true },
      instructions: { type: String },
      urgency: {
        type: String,
        enum: ["routine", "urgent", "emergency"],
        default: "routine",
      },
    },
  ],

  // Follow-up
  followUpRequired: {
    type: Boolean,
    default: false,
  },
  followUpDate: {
    type: Date,
  },
  followUpInstructions: {
    type: String,
  },

  // General Notes
  clinicalNotes: {
    type: String,
  },
  patientInstructions: {
    type: String,
  },

  // Consultation Status
  status: {
    type: String,
    enum: ["draft", "completed", "archived"],
    default: "draft",
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
consultationNotesSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const consultationNotesModel =
  mongoose.models.consultationNotes ||
  mongoose.model("consultationNotes", consultationNotesSchema);

export default consultationNotesModel;
