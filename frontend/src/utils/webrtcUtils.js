// WebRTC compatibility check utility
export const checkWebRTCSupport = () => {
  const support = {
    getUserMedia: false,
    RTCPeerConnection: false,
    RTCSessionDescription: false,
    RTCIceCandidate: false,
    adapter: false,
  };

  // Check for getUserMedia support
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    support.getUserMedia = true;
  } else if (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  ) {
    support.getUserMedia = true;
  }

  // Check for RTCPeerConnection support
  if (window.RTCPeerConnection) {
    support.RTCPeerConnection = true;
  } else if (window.webkitRTCPeerConnection || window.mozRTCPeerConnection) {
    support.RTCPeerConnection = true;
  }

  // Check for RTCSessionDescription support
  if (window.RTCSessionDescription) {
    support.RTCSessionDescription = true;
  } else if (
    window.webkitRTCSessionDescription ||
    window.mozRTCSessionDescription
  ) {
    support.RTCSessionDescription = true;
  }

  // Check for RTCIceCandidate support
  if (window.RTCIceCandidate) {
    support.RTCIceCandidate = true;
  } else if (window.webkitRTCIceCandidate || window.mozRTCIceCandidate) {
    support.RTCIceCandidate = true;
  }

  // Check if all required features are supported
  support.adapter =
    support.getUserMedia &&
    support.RTCPeerConnection &&
    support.RTCSessionDescription &&
    support.RTCIceCandidate;

  return support;
};

// Add this to your existing webrtcUtils.js
export const getSystemRequirements = () => {
  return {
    browser: {
      chrome: { minVersion: 72 },
      firefox: { minVersion: 64 },
      edge: { minVersion: 79 },
      safari: { minVersion: 12.1 }
    },
    os: {
      windows: { minVersion: 7 },
      macos: { minVersion: 10.13 },
      android: { minVersion: 6 },
      ios: { minVersion: 12 }
    },
    features: {
      webrtc: true,
      getUserMedia: true,
      peerConnection: true
    }
  };
};

// Get browser-specific RTCPeerConnection
export const getRTCPeerConnection = () => {
  if (window.RTCPeerConnection) {
    return window.RTCPeerConnection;
  } else if (window.webkitRTCPeerConnection) {
    return window.webkitRTCPeerConnection;
  } else if (window.mozRTCPeerConnection) {
    return window.mozRTCPeerConnection;
  }
  return null;
};

// Get browser-specific getUserMedia
export const getUserMedia = async (constraints) => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  } else if (navigator.getUserMedia) {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia(constraints, resolve, reject);
    });
  } else if (navigator.webkitGetUserMedia) {
    return new Promise((resolve, reject) => {
      navigator.webkitGetUserMedia(constraints, resolve, reject);
    });
  } else if (navigator.mozGetUserMedia) {
    return new Promise((resolve, reject) => {
      navigator.mozGetUserMedia(constraints, resolve, reject);
    });
  } else if (navigator.msGetUserMedia) {
    return new Promise((resolve, reject) => {
      navigator.msGetUserMedia(constraints, resolve, reject);
    });
  }
  throw new Error("getUserMedia not supported");
};

// Get browser-specific RTCSessionDescription
export const getRTCSessionDescription = () => {
  if (window.RTCSessionDescription) {
    return window.RTCSessionDescription;
  } else if (window.webkitRTCSessionDescription) {
    return window.webkitRTCSessionDescription;
  } else if (window.mozRTCSessionDescription) {
    return window.mozRTCSessionDescription;
  }
  return null;
};

// Get browser-specific RTCIceCandidate
export const getRTCIceCandidate = () => {
  if (window.RTCIceCandidate) {
    return window.RTCIceCandidate;
  } else if (window.webkitRTCIceCandidate) {
    return window.webkitRTCIceCandidate;
  } else if (window.mozRTCIceCandidate) {
    return window.mozRTCIceCandidate;
  }
  return null;
};

// Check if video consultation is supported
export const isVideoConsultationSupported = () => {
  const support = checkWebRTCSupport();
  return support.adapter;
};

// Get browser information for debugging
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browser = "Unknown";
  let version = "Unknown";

  if (userAgent.includes("Chrome")) {
    browser = "Chrome";
    version = userAgent.match(/Chrome\/(\d+)/)?.[1] || "Unknown";
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
    version = userAgent.match(/Firefox\/(\d+)/)?.[1] || "Unknown";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari";
    version = userAgent.match(/Version\/(\d+)/)?.[1] || "Unknown";
  } else if (userAgent.includes("Edge")) {
    browser = "Edge";
    version = userAgent.match(/Edge\/(\d+)/)?.[1] || "Unknown";
  }

  return { browser, version, userAgent };
};
