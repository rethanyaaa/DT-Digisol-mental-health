# WebRTC Integration Guide

## Overview
This guide explains how to integrate the WebRTC video calling functionality into your waiting room components.

## Files Created/Modified

### 1. WebRTC Configuration (`frontend/src/utils/webrtcConfig.js`)
- **Purpose**: Contains STUN servers and media constraints
- **Key Features**:
  - Multiple STUN servers for better connectivity
  - Optimized media constraints for video/audio
  - State mapping for connection status

### 2. WebRTC Hook (`frontend/src/hooks/useWebRTC.js`)
- **Purpose**: Manages WebRTC connection state and negotiation
- **Key Features**:
  - Automatic offer/answer creation
  - ICE candidate handling
  - Connection state management
  - Error handling

### 3. VideoCall Component (`frontend/src/components/VideoConsultation/VideoCall.jsx`)
- **Purpose**: UI for video calls
- **Key Features**:
  - Picture-in-picture layout
  - Video/audio controls
  - Connection status display
  - Settings panel

### 4. Socket.IO Server (`backend/socketServer.js`)
- **Purpose**: Handles WebRTC signaling
- **Key Features**:
  - Offer/answer relay
  - ICE candidate exchange
  - Room-based broadcasting

## Integration Steps

### Step 1: Update PatientWaitingRoom.jsx

```javascript
import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { AppContext } from "../context/AppContext";
import VideoCall from "../components/VideoConsultation/VideoCall"; // Add this import

const PatientWaitingRoom = () => {
  // ... existing state ...
  const [isInVideoCall, setIsInVideoCall] = useState(false); // Add this state

  // ... existing code ...

  // Add video call handlers
  const startVideoCall = () => {
    setIsInVideoCall(true);
  };

  const endVideoCall = () => {
    setIsInVideoCall(false);
  };

  // In your JSX, add the video call component
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* ... existing waiting room UI ... */}
      
      {/* Add video call component */}
      {isInVideoCall && (
        <VideoCall
          socket={socket}
          roomId={roomId}
          userType="patient"
          onEndCall={endVideoCall}
        />
      )}
    </div>
  );
};
```

### Step 2: Update DoctorWaitingRoom.jsx

```javascript
import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { DoctorContext } from "../../context/DoctorContext";
import VideoCall from "../components/VideoConsultation/VideoCall"; // Add this import

const DoctorWaitingRoom = () => {
  // ... existing state ...
  const [isInVideoCall, setIsInVideoCall] = useState(false); // Add this state
  const [currentCallRoom, setCurrentCallRoom] = useState(null); // Add this state

  // ... existing code ...

  // Add video call handlers
  const startVideoCall = (roomId) => {
    setCurrentCallRoom(roomId);
    setIsInVideoCall(true);
  };

  const endVideoCall = () => {
    setIsInVideoCall(false);
    setCurrentCallRoom(null);
  };

  // In your JSX, add the video call component
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* ... existing waiting room UI ... */}
      
      {/* Add video call component */}
      {isInVideoCall && currentCallRoom && (
        <VideoCall
          socket={socket}
          roomId={currentCallRoom}
          userType="doctor"
          onEndCall={endVideoCall}
        />
      )}
    </div>
  );
};
```

### Step 3: Add Start Call Buttons

In your waiting room components, add buttons to start video calls:

```javascript
// For patients (in PatientWaitingRoom.jsx)
<button
  onClick={startVideoCall}
  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
>
  Start Video Call
</button>

// For doctors (in DoctorWaitingRoom.jsx)
<button
  onClick={() => startVideoCall(room.roomId)}
  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
>
  Start Consultation
</button>
```

## WebRTC Flow

### 1. Connection Initialization
```javascript
// Patient joins waiting room
// Doctor joins waiting room
// Both parties are ready for video call
```

### 2. Video Call Start
```javascript
// Patient clicks "Start Video Call"
// useWebRTC hook initializes connection
// Patient creates offer automatically
// Offer sent via Socket.IO to doctor
```

### 3. Offer/Answer Exchange
```javascript
// Doctor receives offer
// Doctor creates answer automatically
// Answer sent via Socket.IO to patient
// Both parties set remote descriptions
```

### 4. ICE Candidate Exchange
```javascript
// Both parties generate ICE candidates
// Candidates sent via Socket.IO
// Remote candidates added to peer connection
```

### 5. P2P Connection
```javascript
// Direct video/audio streaming established
// No more server involvement needed
// Real-time communication active
```

## Testing

### Test Scenarios

1. **Patient starts call first**
   - Patient creates offer
   - Doctor receives and responds
   - Connection established

2. **Doctor starts call first**
   - Doctor creates offer
   - Patient receives and responds
   - Connection established

3. **Network issues**
   - ICE candidates handle NAT traversal
   - Multiple STUN servers provide fallback
   - Connection re-establishment

### Debug Information

The system includes extensive logging:
- Connection state changes
- ICE candidate exchange
- Offer/answer creation
- Error handling

Check browser console for detailed logs.

## Troubleshooting

### Common Issues

1. **Camera/Microphone not working**
   - Check browser permissions
   - Ensure HTTPS (required for getUserMedia)
   - Test with device test page

2. **Connection not establishing**
   - Check STUN server connectivity
   - Verify Socket.IO connection
   - Check firewall settings

3. **Poor video quality**
   - Adjust media constraints in webrtcConfig.js
   - Check network bandwidth
   - Consider TURN servers for restrictive networks

### Error Handling

The system includes comprehensive error handling:
- Media access errors
- Connection failures
- Network timeouts
- Invalid offers/answers

All errors are displayed to users with actionable messages.

## Security Considerations

1. **HTTPS Required**: WebRTC requires secure context
2. **Token Validation**: All Socket.IO connections use JWT tokens
3. **Room Isolation**: Users can only join authorized rooms
4. **Media Permissions**: Explicit user consent required

## Performance Optimization

1. **STUN Server Pool**: Multiple servers for redundancy
2. **ICE Candidate Pool**: Pre-gathered candidates
3. **Media Constraints**: Optimized for quality/bandwidth balance
4. **Connection Cleanup**: Proper resource management 