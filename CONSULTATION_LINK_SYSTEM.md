# Consultation Link System with Email Notifications

This document describes the implementation of a comprehensive consultation link system that generates unique room IDs, sends email notifications with system requirements, and includes device testing functionality.

## 🚀 Features Implemented

### 1. **Automatic Consultation Link Generation**

- Generates unique UUID v4 room IDs for each consultation
- Creates secure tokens for consultation access
- Automatically triggered after successful payment for video consultations

### 2. **Email Notifications**

- Professional HTML email templates
- System requirements information
- Direct links to consultation and device test pages
- Responsive design for all email clients

### 3. **Device Testing System**

- Comprehensive device compatibility testing
- Real-time camera and microphone testing
- Audio level monitoring
- Network connectivity testing
- Browser compatibility verification

## 📁 File Structure

```
backend/
├── controllers/
│   └── consultationController.js     # Consultation management
├── models/
│   └── consultationModel.js          # Consultation data model
├── routes/
│   └── consultationRoute.js          # API routes
├── services/
│   └── emailService.js               # Email functionality
├── utils/
│   └── consultationUtils.js          # Utility functions
└── server.js                         # Updated with consultation routes

frontend/src/
├── pages/
│   └── DeviceTest.jsx                # Device testing component
└── utils/
    └── webrtcUtils.js                # WebRTC utilities (existing)
```

## 🔧 Technical Implementation

### Backend Components

#### 1. **Consultation Model** (`backend/models/consultationModel.js`)

```javascript
const consultationSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true, ref: "appointment" },
  roomId: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  consultationLink: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
  },
  participants: {
    patient: { joined: Boolean, joinedAt: Date },
    doctor: { joined: Boolean, joinedAt: Date },
  },
  expiresAt: { type: Date, required: true },
});
```

#### 2. **Consultation Controller** (`backend/controllers/consultationController.js`)

Key functions:

- `generateConsultationLink()` - Creates consultation room and sends email
- `getConsultationDetails()` - Retrieves consultation information
- `updateConsultationStatus()` - Updates consultation status
- `cleanupExpiredConsultations()` - Cleans up expired consultations

#### 3. **Email Service** (`backend/services/emailService.js`)

Features:

- Professional HTML email templates
- System requirements formatting
- Responsive design
- Error handling and logging

#### 4. **Consultation Utils** (`backend/utils/consultationUtils.js`)

Utility functions:

- `generateConsultationRoomId()` - Creates UUID v4 room IDs
- `generateConsultationToken()` - Creates secure access tokens
- `createConsultationLink()` - Generates consultation URLs
- `getSystemRequirements()` - Returns system requirements

### Frontend Components

#### 1. **Device Test Page** (`frontend/src/pages/DeviceTest.jsx`)

Comprehensive testing features:

- Browser compatibility testing
- Camera functionality testing
- Microphone audio level monitoring
- Speaker testing with audio tones
- Network connectivity testing
- Real-time test status updates

## 📧 Email Template Features

### Email Content Includes:

1. **Appointment Information**

   - Patient and doctor names
   - Date and time
   - Room ID for reference

2. **Direct Links**

   - Primary consultation link
   - Device test link
   - Both links are prominently displayed

3. **System Requirements**

   - Browser compatibility requirements
   - Hardware requirements
   - Network requirements
   - Permission requirements

4. **Pre-Consultation Checklist**
   - Device testing instructions
   - Environment preparation tips
   - Technical troubleshooting

### Email Design Features:

- Responsive HTML design
- Professional styling
- Clear call-to-action buttons
- Mobile-friendly layout
- Branded header and footer

## 🧪 Device Testing System

### Test Categories:

#### 1. **Browser Compatibility Test**

- Checks WebRTC support
- Validates browser version
- Detects browser type and version

#### 2. **Camera Test**

- Requests camera permissions
- Displays live video preview
- Validates camera functionality

#### 3. **Microphone Test**

- Requests microphone permissions
- Monitors audio levels in real-time
- Visual audio level indicator

#### 4. **Speaker Test**

- Generates test audio tones
- Validates audio output
- User confirmation of audio playback

#### 5. **Network Test**

- Tests internet connectivity
- Measures response times
- Validates network stability

### Test Features:

- Real-time status updates
- Visual progress indicators
- Error handling and recovery
- Detailed test results
- System requirements display

## 🔐 Security Features

### 1. **Token-Based Access**

- Secure consultation tokens
- Time-limited access
- Token validation on each request

### 2. **Room ID Security**

- UUID v4 generation
- Unique room identifiers
- No sequential or predictable IDs

### 3. **Expiration Management**

- 24-hour consultation expiration
- Automatic cleanup of expired consultations
- Status tracking and updates

## 📋 API Endpoints

### Consultation Routes:

```
POST /api/consultation/generate-link     # Generate consultation link
GET  /api/consultation/details/:roomId   # Get consultation details
PUT  /api/consultation/status/:roomId    # Update consultation status
GET  /api/consultation/appointment/:id   # Get appointment consultations
```

### Request Examples:

#### Generate Consultation Link:

```javascript
POST /api/consultation/generate-link
{
  "appointmentId": "appointment_id_here"
}
```

#### Get Consultation Details:

```javascript
GET /api/consultation/details/room-uuid-here?token=secure_token_here
```

## 🚀 Usage Flow

### 1. **Payment Completion**

```javascript
// After successful payment verification
if (appointment.consultationType === "video") {
  // Automatically generate consultation link
  await generateConsultationLink(appointmentId);
  // Email is sent automatically
}
```

### 2. **Email Reception**

- Patient receives professional email
- Contains consultation and test links
- Includes system requirements
- Pre-consultation checklist

### 3. **Device Testing**

- Patient clicks "Test Audio/Video" button
- Comprehensive device testing
- Real-time feedback and results
- Proceed to consultation if all tests pass

### 4. **Consultation Access**

- Secure token-based access
- Room ID validation
- Participant tracking
- Status management

## 🔧 Environment Variables

### Required Environment Variables:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# JWT Secret
JWT_SECRET=your-jwt-secret
```

## 📦 Dependencies

### Backend Dependencies Added:

```json
{
  "nodemailer": "^6.9.7",
  "uuid": "^9.0.1"
}
```

### Installation:

```bash
cd backend
npm install nodemailer uuid
```

## 🧪 Testing

### Manual Testing:

1. **Create video consultation appointment**
2. **Complete payment process**
3. **Verify email receipt**
4. **Test device testing page**
5. **Validate consultation access**

### Automated Testing:

```javascript
// Test consultation link generation
const result = await generateConsultationLink(appointmentId);
expect(result.success).toBe(true);
expect(result.data.roomId).toBeDefined();

// Test email sending
const emailResult = await sendConsultationEmail(emailData);
expect(emailResult.success).toBe(true);
```

## 🔄 Integration Points

### 1. **Payment System Integration**

- Automatic trigger after payment verification
- Consultation type detection
- Error handling for failed link generation

### 2. **Appointment System Integration**

- Consultation status tracking
- Participant management
- Expiration handling

### 3. **Email System Integration**

- SMTP configuration
- Template management
- Delivery tracking

## 🚨 Error Handling

### Common Error Scenarios:

1. **Email Delivery Failure**

   - Logs error but doesn't fail consultation creation
   - Retry mechanism for failed emails

2. **Device Test Failures**

   - Clear error messages
   - Troubleshooting guidance
   - Alternative solutions

3. **Token Validation Errors**
   - Secure error responses
   - Access denial for invalid tokens
   - Expiration handling

## 📈 Monitoring and Logging

### Logging Features:

- Consultation creation logs
- Email delivery status
- Device test results
- Error tracking and reporting

### Monitoring Points:

- Email delivery success rates
- Device test completion rates
- Consultation access patterns
- Error frequency and types

## 🔮 Future Enhancements

### Planned Features:

1. **SMS Notifications**

   - Text message reminders
   - Quick access links

2. **Advanced Device Testing**

   - Bandwidth testing
   - Video quality assessment
   - Audio quality testing

3. **Consultation Recording**

   - Session recording capability
   - Secure storage and access

4. **Multi-language Support**

   - Internationalization
   - Localized email templates

5. **Analytics Dashboard**
   - Usage statistics
   - Performance metrics
   - User behavior analysis

## 📞 Support and Troubleshooting

### Common Issues:

#### Email Not Received:

1. Check spam folder
2. Verify email address
3. Check SMTP configuration
4. Review server logs

#### Device Test Failures:

1. Check browser permissions
2. Verify hardware connections
3. Update browser version
4. Check network connectivity

#### Consultation Access Issues:

1. Verify token validity
2. Check expiration time
3. Validate room ID
4. Review access logs

This comprehensive consultation link system provides a complete solution for video consultation management, from automatic link generation to device testing and email notifications.
