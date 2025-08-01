# Video Consultation Feature Implementation

This document describes the implementation of the video consultation feature in the Mental Health Dashboard application.

## Features Implemented

### 1. Consultation Type Selection

- Added radio button selection for "In-person" and "Video" consultation types
- Integrated with the existing appointment booking system
- Stored consultation type in the database

### 2. WebRTC Compatibility Check

- Comprehensive browser compatibility detection
- Support for multiple browsers (Chrome, Firefox, Safari, Edge)
- Real-time compatibility status display
- Warning modal for incompatible browsers

### 3. Video Call Interface

- Full-screen video call component
- Local and remote video streams
- Audio/video toggle controls
- Connection status indicators
- Fullscreen mode support

## Technical Implementation

### Backend Changes

#### 1. Appointment Model (`backend/models/appointmentModel.js`)

```javascript
consultationType: {
  type: String,
  enum: ['in-person', 'video'],
  default: 'in-person',
  required: true
}
```

#### 2. User Controller (`backend/controllers/userController.js`)

- Updated `bookAppointment` function to handle consultation type
- Added consultation type validation

### Frontend Changes

#### 1. WebRTC Utilities (`frontend/src/utils/webrtcUtils.js`)

- Browser compatibility detection
- Cross-browser WebRTC API support
- Browser information extraction

#### 2. Appointment Booking (`frontend/src/pages/Appointment.jsx`)

- Added consultation type selection UI
- WebRTC compatibility warnings
- Enhanced booking flow

#### 3. Video Call Component (`frontend/src/components/VideoConsultation/VideoCall.jsx`)

- WebRTC peer connection setup
- Media stream handling
- Video call controls

#### 4. My Appointments (`frontend/src/pages/MyAppointments.jsx`)

- Consultation type display
- Video call initiation for video consultations
- Enhanced appointment cards

## Browser Support

### Supported Browsers

- **Chrome**: Full support (version 60+)
- **Firefox**: Full support (version 55+)
- **Safari**: Full support (version 11+)
- **Edge**: Full support (version 79+)

### WebRTC Features Checked

- `getUserMedia` API
- `RTCPeerConnection` API
- `RTCSessionDescription` API
- `RTCIceCandidate` API

## Usage

### For Patients

1. **Booking a Video Consultation**:

   - Navigate to doctor's appointment page
   - Select "Video Consultation" option
   - Complete booking process
   - Browser compatibility is automatically checked

2. **Starting a Video Call**:
   - Go to "My Appointments"
   - Find the video consultation appointment
   - Click "Start Video Call" button
   - Grant camera and microphone permissions

### For Developers

#### Testing WebRTC Support

```javascript
import { testWebRTCSupport } from "./utils/webrtcTest";

// Run compatibility test
const result = testWebRTCSupport();
console.log(result);
```

#### Manual Compatibility Check

```javascript
import {
  isVideoConsultationSupported,
  getBrowserInfo,
} from "./utils/webrtcUtils";

const isSupported = isVideoConsultationSupported();
const browserInfo = getBrowserInfo();
```

## Security Considerations

1. **HTTPS Required**: WebRTC requires secure context (HTTPS)
2. **Permission Handling**: Camera and microphone permissions are requested
3. **Data Privacy**: Video streams are peer-to-peer when possible
4. **STUN Servers**: Using Google's public STUN servers for NAT traversal

## Future Enhancements

1. **Signaling Server**: Implement WebSocket-based signaling for peer connection
2. **TURN Servers**: Add TURN servers for better connectivity
3. **Recording**: Video call recording functionality
4. **Screen Sharing**: Add screen sharing capability
5. **Chat**: In-call text messaging
6. **File Sharing**: Secure file sharing during calls

## Troubleshooting

### Common Issues

1. **Camera/Microphone Not Working**:

   - Check browser permissions
   - Ensure HTTPS is enabled
   - Try refreshing the page

2. **Video Call Not Starting**:

   - Verify WebRTC support
   - Check browser version
   - Clear browser cache

3. **Connection Issues**:
   - Check internet connection
   - Verify firewall settings
   - Try different browser

### Debug Information

The application logs detailed WebRTC information to the browser console:

- Browser compatibility status
- WebRTC API support details
- Connection state changes
- Error messages

## Dependencies

### Frontend

- React (existing)
- Lucide React (for icons)
- Axios (for API calls)

### Backend

- No additional dependencies required
- Uses existing MongoDB schema

## File Structure

```
frontend/src/
├── components/
│   └── VideoConsultation/
│       ├── VideoCall.jsx
│       └── index.js
├── pages/
│   ├── Appointment.jsx (updated)
│   └── MyAppointments.jsx (updated)
└── utils/
    ├── webrtcUtils.js (new)
    └── webrtcTest.js (new)

backend/
├── models/
│   └── appointmentModel.js (updated)
└── controllers/
    └── userController.js (updated)
```

## Testing

1. **Browser Compatibility**: Test in different browsers
2. **Network Conditions**: Test with various network speeds
3. **Permissions**: Test camera/microphone permission flows
4. **Error Handling**: Test with unsupported browsers
5. **Mobile Devices**: Test on mobile browsers

## Deployment Notes

1. **HTTPS Required**: Ensure production environment uses HTTPS
2. **STUN/TURN Servers**: Consider deploying custom STUN/TURN servers
3. **Browser Support**: Test on target browser versions
4. **Performance**: Monitor video call performance in production
