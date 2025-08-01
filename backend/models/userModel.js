import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    index: true // Index for name searches
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, // Already creates a unique index
    index: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  image: {
      type: String,
  },
  address: { 
    type: Object, 
    default: { line1: '', line2: '' },
    index: { 
      type: '2dsphere', 
      sparse: true // Only enable if you need geospatial queries
    } 
  },
  gender: { 
    type: String, 
    default: 'Not Selected',
    index: true // Helpful if you frequently filter by gender
  },
  dob: { 
    type: String, 
    default: 'Not Selected',
    index: true // Useful for age-range queries
  },
  phone: { 
    type: String, 
    default: '0000000000',
    index: true // Important if you search by phone
  }
}, { timestamps: true }) // Added timestamps for created/updated tracking

// Compound indexes for common query patterns
userSchema.index({ name: 1, email: 1 }); // For combined name+email searches
userSchema.index({ gender: 1, dob: 1 }); // For demographic analysis
userSchema.index({ 'address.line1': 'text', 'address.line2': 'text' }); // For address searches

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel