 import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true }, // Index for name searches
    email: { type: String, required: true, unique: true }, // Already has unique index
    password: { type: String, required: true },
    image: { type: String, required: true },
    video: { type: String, required: true },
    speciality: { type: String, required: true, index: true }, // Index for filtering by speciality
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true, index: true }, // Index for filtering available doctors
    fees: { type: Number, required: true, index: true }, // Index for sorting by fees
    address: { 
      type: Object, 
      required: true,
      index: { 
        type: '2dsphere', 
        sparse: true // Only if you need geospatial queries
      } 
    },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} }
  },
  { minimize: false }
)

// Compound indexes for common query patterns
doctorSchema.index({ speciality: 1, available: 1 }); // For finding available doctors by speciality
doctorSchema.index({ speciality: 1, fees: 1 }); // For finding doctors by speciality sorted by fees
doctorSchema.index({ name: 'text', speciality: 'text', about: 'text' }); // Text index for search functionality

const doctorModel =
  mongoose.models.doctor || mongoose.model('doctor', doctorSchema)

export default doctorModel