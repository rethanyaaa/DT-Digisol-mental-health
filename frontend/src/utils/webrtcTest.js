// Test file for WebRTC compatibility check
import {
  checkWebRTCSupport,
  isVideoConsultationSupported,
  getBrowserInfo,
} from "./webrtcUtils";

// Test function to log WebRTC support status
export const testWebRTCSupport = () => {
  console.log("=== WebRTC Compatibility Test ===");

  const support = checkWebRTCSupport();
  console.log("WebRTC Support Details:", support);

  const isSupported = isVideoConsultationSupported();
  console.log("Video Consultation Supported:", isSupported);

  const browserInfo = getBrowserInfo();
  console.log("Browser Information:", browserInfo);

  return {
    support,
    isSupported,
    browserInfo,
  };
};

// Run test if this file is imported directly
if (typeof window !== "undefined") {
  // Only run in browser environment
  setTimeout(() => {
    testWebRTCSupport();
  }, 1000);
}
