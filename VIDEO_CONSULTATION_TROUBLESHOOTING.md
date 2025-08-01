# Video Consultation Troubleshooting Guide

## Issue: Patient Cannot See Doctor's Video

### Problem Description

- Doctor can see patient's video ✅
- Patient cannot see doctor's video ❌
- Patient sees "Waiting for remote video..." message

### Debugging Steps

#### 1. Check Browser Console

Open the browser developer tools (F12) and check the console for any error messages or debug information.

#### 2. Use Debug Buttons

The video call interface now includes several debug buttons:

- **DBG** (Yellow): General connection debug information
- **PC** (Purple): Peer connection state check
- **RST** (Green): Reinitialize connection
- **HD** (Blue): Video quality test

#### 3. Check Connection States

Look for these connection states in the console:

- Connection State: Should be "connected"
- ICE Connection State: Should be "connected" or "completed"
- Signaling State: Should be "stable"

#### 4. Verify Stream Information

Check if the remote stream is being received:

- Look for "Received remote stream" messages
- Check if remote stream tracks are present
- Verify video track is enabled and not muted

#### 5. Check Video Element

Verify the remote video element is properly configured:

- Check if srcObject is set
- Verify video element readyState
- Look for any video element errors

### Common Issues and Solutions

#### Issue 1: No Remote Stream Received

**Symptoms:**

- No "Received remote stream" message in console
- Remote stream is null

**Possible Causes:**

- WebRTC offer/answer exchange failed
- ICE connection failed
- Network connectivity issues

**Solutions:**

1. Check network connectivity
2. Try reinitializing connection (RST button)
3. Check if STUN/TURN servers are accessible
4. Verify firewall settings

#### Issue 2: Remote Stream Received but No Video

**Symptoms:**

- "Received remote stream" message appears
- Remote stream exists but video doesn't display

**Possible Causes:**

- Video track is disabled or muted
- Video element not properly configured
- Codec compatibility issues

**Solutions:**

1. Check if video track is enabled
2. Verify video element srcObject is set
3. Check browser codec support
4. Try different video constraints

#### Issue 3: One-Way Video Only

**Symptoms:**

- Doctor can see patient but not vice versa
- Patient's video works but doctor's doesn't

**Possible Causes:**

- Asymmetric network conditions
- Different browser implementations
- Timing issues in stream setup

**Solutions:**

1. Check both participants' network conditions
2. Ensure both use same browser type/version
3. Try reinitializing connection
4. Check for browser-specific issues

### Debug Information to Collect

When reporting issues, please provide:

1. **Browser Information:**

   - Browser type and version
   - Operating system
   - Device type (desktop/mobile)

2. **Console Logs:**

   - All console messages during connection
   - Any error messages
   - Debug button output

3. **Network Information:**

   - Network type (WiFi/cellular)
   - Network speed
   - Firewall/proxy settings

4. **Connection Details:**
   - User type (patient/doctor)
   - Room ID
   - Connection states

### Technical Debugging

#### WebRTC Connection Flow

1. **Offer Creation** (Patient):

   - Patient creates and sends offer
   - Offer includes local stream tracks

2. **Answer Creation** (Doctor):

   - Doctor receives offer
   - Doctor creates and sends answer
   - Answer includes doctor's stream tracks

3. **ICE Candidate Exchange**:

   - Both parties exchange ICE candidates
   - Connection established through best path

4. **Stream Reception**:
   - Remote streams received via ontrack event
   - Video elements updated with remote streams

#### Key Debug Points

- Check if offer/answer exchange completes
- Verify ICE candidates are exchanged
- Confirm ontrack events fire for both parties
- Ensure video elements are properly updated

### Browser Compatibility

#### Supported Browsers

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

#### Required Permissions

- Camera access
- Microphone access
- WebRTC support

### Network Requirements

#### Minimum Requirements

- Stable internet connection
- Low latency (< 100ms)
- Sufficient bandwidth (> 1 Mbps)

#### Recommended Settings

- Wired connection preferred
- 5+ Mbps bandwidth
- Low network congestion

### Advanced Troubleshooting

#### STUN/TURN Server Issues

If connection fails, check:

- STUN server accessibility
- TURN server credentials
- Network restrictions

#### Codec Issues

If video doesn't display:

- Check H.264 support
- Verify VP8/VP9 availability
- Test with different codecs

#### Timing Issues

If streams don't sync:

- Check connection timing
- Verify stream initialization order
- Monitor connection state changes

### Support Information

For additional support:

1. Collect all debug information
2. Note exact steps to reproduce
3. Include browser and system details
4. Provide console logs and error messages

### Recent Improvements

The following improvements have been made to help with debugging:

1. **Enhanced Logging:**

   - Detailed stream information
   - Video element state tracking
   - Connection state monitoring

2. **Debug Utilities:**

   - Comprehensive debug functions
   - Stream and video element analysis
   - Peer connection state checking

3. **Manual Controls:**

   - Connection reinitialization
   - Video quality testing
   - Real-time state monitoring

4. **Error Handling:**
   - Better error messages
   - Graceful failure handling
   - Recovery mechanisms
