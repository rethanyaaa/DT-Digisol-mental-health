# Waiting Room System with Socket.IO

This document describes the implementation of a comprehensive waiting room system that enables real-time communication between patients and doctors using Socket.IO.

## 🚀 Features Implemented

### 1. **Real-Time Waiting Room Management**

- Socket.IO server for real-time communication
- Patient and doctor connection management
- Waiting room state synchronization
- Automatic cleanup on disconnection

### 2. **Patient Waiting Room**

- Camera and microphone preview
- Device testing functionality
- Real-time chat with doctor
- Ready status management
- Automatic consultation transition

### 3. **Doctor Dashboard**

- Real-time patient monitoring
- Device test result tracking
- Patient ready status updates
- Waiting room chat functionality
- Consultation initiation

## 📁 File Structure

```
backend/
├── socketServer.js                    # Socket.IO server implementation
└── server.js                         # Updated with Socket.IO integration

frontend/src/
├── pages/
│   ├── PatientWaitingRoom.jsx        # Patient waiting room interface
│   └── DoctorWaitingRoom.jsx         # Doctor dashboard interface
└── utils/
    └── webrtcUtils.js                # WebRTC utilities (existing)
```

## 🔧 Technical Implementation

### Backend Components

#### 1. **Socket.IO Server** (`backend/socketServer.js`)

```javascript
class SocketServer {
  constructor(server) {
    this.io = new Server(server, {
      cors: { origin: process.env.FRONTEND_URL },
    });
    this.waitingRooms = new Map(); // roomId -> { patients: [], doctor: null }
    this.userSockets = new Map(); // userId -> socketId
    this.socketUsers = new Map(); // socketId -> { userId, userType, roomId }
  }
}
```

**Key Features:**

- Authentication middleware with JWT
- Waiting room management
- Real-time event handling
- Automatic cleanup on disconnection

#### 2. **Event Handlers**

- `join-waiting-room` - Join waiting room
- `leave-waiting-room` - Leave waiting room
- `doctor-join-consultation` - Doctor joins consultation
- `start-consultation` - Start consultation
- `device-test-results` - Device test results
- `patient-ready` - Patient ready status
- `waiting-room-message` - Chat messages

### Frontend Components

#### 1. **Patient Waiting Room** (`frontend/src/pages/PatientWaitingRoom.jsx`)

**Features:**

- Real-time video/audio preview
- Device testing with results
- Chat functionality
- Ready status management
- Automatic consultation transition

#### 2. **Doctor Dashboard** (`frontend/src/pages/DoctorWaitingRoom.jsx`)

**Features:**

- Real-time patient monitoring
- Device test result tracking
- Patient ready status updates
- Waiting room management
- Consultation initiation

## 🔌 Socket.IO Events

### Client to Server Events

#### Patient Events:

```javascript
// Join waiting room
socket.emit("join-waiting-room", { roomId, appointmentId });

// Leave waiting room
socket.emit("leave-waiting-room", { roomId });

// Device test results
socket.emit("device-test-results", { roomId, results });

// Patient ready status
socket.emit("patient-ready", { roomId, ready });

// Send message
socket.emit("waiting-room-message", { roomId, message });
```

#### Doctor Events:

```javascript
// Join waiting room
socket.emit("join-waiting-room", { roomId });

// Start consultation
socket.emit("start-consultation", { roomId, patientId });

// Send message
socket.emit("waiting-room-message", { roomId, message });
```

### Server to Client Events

#### Patient Events:

```javascript
// Waiting room joined
socket.on("waiting-room-joined", (data) => {
  // roomId, appointment, waitingPatients, doctorOnline, messages
});

// Doctor joined
socket.on("doctor-joined-waiting-room", (data) => {
  // roomId, doctor, waitingPatients
});

// Doctor left
socket.on("doctor-left-waiting-room", (data) => {
  // roomId
});

// Consultation starting
socket.on("consultation-starting", (data) => {
  // roomId, doctorId
});

// New message
socket.on("waiting-room-message", (message) => {
  // id, userId, userType, message, timestamp
});
```

#### Doctor Events:

```javascript
// Patient joined
socket.on("patient-joined-waiting-room", (data) => {
  // roomId, patient, appointment
});

// Patient left
socket.on("patient-left-waiting-room", (data) => {
  // roomId, patientId, remainingPatients
});

// Device test completed
socket.on("patient-device-test-completed", (data) => {
  // roomId, patientId, results, ready
});

// Patient ready status changed
socket.on("patient-ready-status-changed", (data) => {
  // roomId, patientId, ready
});

// New message
socket.on("waiting-room-message", (message) => {
  // id, userId, userType, message, timestamp
});
```

## 🎨 User Interface Features

### Patient Waiting Room

#### 1. **Video Preview**

- Live camera feed
- Audio/video toggle controls
- Device status indicators

#### 2. **Device Testing**

- Camera functionality test
- Microphone audio level monitoring
- Browser compatibility check
- Test results display

#### 3. **Chat System**

- Real-time messaging
- Message history
- User type indicators
- Timestamp display

#### 4. **Status Management**

- Ready/Not ready toggle
- Device test completion status
- Connection status indicator

### Doctor Dashboard

#### 1. **Waiting Room Overview**

- List of all waiting rooms
- Patient count per room
- Appointment details
- Room selection interface

#### 2. **Patient Monitoring**

- Real-time patient status
- Device test results
- Ready status tracking
- Join time display

#### 3. **Consultation Management**

- Start consultation buttons
- Patient readiness indicators
- Room-specific actions

#### 4. **Notifications**

- Real-time notifications
- Patient join/leave alerts
- Device test completion alerts
- Status change notifications

## 🔐 Security Features

### 1. **Authentication**

- JWT token validation
- User type verification
- Socket connection authentication

### 2. **Room Access Control**

- Room ID validation
- Token-based access
- Expiration handling

### 3. **Data Validation**

- Input sanitization
- Event validation
- Error handling

## 📊 Data Models

### Waiting Room Structure:

```javascript
{
  roomId: "uuid-v4",
  patients: [
    {
      userId: "patient_id",
      socketId: "socket_id",
      joinedAt: Date,
      ready: boolean,
      deviceTestCompleted: boolean,
      deviceTestResults: object
    }
  ],
  doctor: {
    userId: "doctor_id",
    socketId: "socket_id",
    joinedAt: Date
  },
  messages: [
    {
      id: "message_id",
      userId: "user_id",
      userType: "patient|doctor",
      message: "text",
      timestamp: Date
    }
  ]
}
```

## 🚀 Usage Flow

### Patient Flow:

1. **Join Waiting Room**

   - Navigate to waiting room URL
   - Socket connection established
   - Join waiting room event sent

2. **Device Testing**

   - Run device tests
   - Results sent to server
   - Ready status updated

3. **Wait for Doctor**

   - Monitor connection status
   - Chat with doctor if available
   - Wait for consultation start

4. **Consultation Start**
   - Receive consultation starting event
   - Navigate to consultation page

### Doctor Flow:

1. **Access Dashboard**

   - Login to doctor dashboard
   - View waiting rooms
   - Monitor patient status

2. **Join Waiting Room**

   - Select waiting room
   - Join room event sent
   - Access patient information

3. **Monitor Patients**

   - View patient device test results
   - Check patient ready status
   - Communicate via chat

4. **Start Consultation**
   - Select ready patient
   - Initiate consultation
   - Navigate to consultation page

## 🔧 Environment Variables

### Required Environment Variables:

```env
# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# JWT Secret
JWT_SECRET=your-jwt-secret

# Backend URL
BACKEND_URL=http://localhost:4000
```

## 📦 Dependencies

### Backend Dependencies:

```json
{
  "socket.io": "^4.7.4"
}
```

### Frontend Dependencies:

```json
{
  "socket.io-client": "^4.7.4"
}
```

### Installation:

```bash
# Backend
cd backend
npm install socket.io

# Frontend
cd frontend
npm install socket.io-client
```

## 🧪 Testing

### Manual Testing:

1. **Start Backend Server**

   ```bash
   cd backend
   npm run server
   ```

2. **Start Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Patient Flow**

   - Open patient waiting room
   - Test device functionality
   - Verify chat functionality
   - Test consultation transition

4. **Test Doctor Flow**
   - Open doctor dashboard
   - Monitor patient connections
   - Test chat functionality
   - Initiate consultations

### Automated Testing:

```javascript
// Test Socket.IO connection
const socket = io("http://localhost:4000", {
  auth: { token: "test-token", userType: "patient" },
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

// Test waiting room join
socket.emit("join-waiting-room", { roomId: "test-room" });
```

## 🔄 Integration Points

### 1. **Consultation System Integration**

- Automatic transition from waiting room to consultation
- Status synchronization
- Participant management

### 2. **Device Testing Integration**

- Real-time test result sharing
- Status updates
- Ready state management

### 3. **Email System Integration**

- Waiting room links in emails
- Notification system
- Status updates

## 🚨 Error Handling

### Common Error Scenarios:

1. **Connection Failures**

   - Automatic reconnection
   - Error messages
   - Fallback options

2. **Authentication Errors**

   - Token validation
   - Access denial
   - Redirect to login

3. **Device Access Errors**
   - Permission handling
   - Alternative options
   - User guidance

### Error Recovery:

- Automatic reconnection attempts
- Graceful degradation
- User-friendly error messages
- Fallback functionality

## 📈 Monitoring and Logging

### Logging Features:

- Connection events
- Room join/leave events
- Message events
- Error tracking

### Monitoring Points:

- Active connections
- Waiting room usage
- Message frequency
- Error rates

## 🔮 Future Enhancements

### Planned Features:

1. **Advanced Notifications**

   - Push notifications
   - Email alerts
   - SMS notifications

2. **Enhanced Chat**

   - File sharing
   - Image sharing
   - Voice messages

3. **Analytics Dashboard**

   - Usage statistics
   - Performance metrics
   - User behavior analysis

4. **Multi-language Support**

   - Internationalization
   - Localized interfaces
   - Language detection

5. **Advanced Device Testing**
   - Bandwidth testing
   - Quality assessment
   - Performance metrics

## 📞 Support and Troubleshooting

### Common Issues:

#### Connection Problems:

1. Check network connectivity
2. Verify server status
3. Check authentication tokens
4. Review browser console

#### Device Issues:

1. Check browser permissions
2. Verify hardware connections
3. Update browser version
4. Test in different browser

#### Chat Issues:

1. Check Socket.IO connection
2. Verify room membership
3. Check message format
4. Review server logs

This comprehensive waiting room system provides a complete solution for real-time patient-doctor communication and consultation management.
