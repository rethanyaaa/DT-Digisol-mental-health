import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    required: true,
    ref: "appointment",
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  consultationLink: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending",
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  participants: {
    patient: {
      joined: { type: Boolean, default: false },
      joinedAt: { type: Date },
    },
    doctor: {
      joined: { type: Boolean, default: false },
      joinedAt: { type: Date },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Index for efficient queries
consultationSchema.index({ appointmentId: 1 });

consultationSchema.index({ status: 1 });
consultationSchema.index({ expiresAt: 1 });

// Method to check if consultation is expired
consultationSchema.methods.isExpired = function () {
  return new Date() > this.expiresAt;
};

// Method to check if consultation is active
consultationSchema.methods.isActive = function () {
  return this.status === "active" && !this.isExpired();
};

const consultationModel =
  mongoose.models.consultation ||
  mongoose.model("consultation", consultationSchema);

export default consultationModel;
