// WebRTC Configuration with STUN servers
export const rtcConfiguration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
    // Additional STUN servers for better connectivity
    {
      urls: [
        "stun:stun.stunprotocol.org:3478",
        "stun:stun.voiparound.com:3478",
        "stun:stun.voipbuster.com:3478",
        "stun:stun.voipstunt.com:3478",
        "stun:stun.counterpath.com:3478",
      ],
    },
    // Free TURN servers for better connectivity in restrictive networks
    {
      urls: [
        "turn:openrelay.metered.ca:80",
        "turn:openrelay.metered.ca:443",
        "turn:openrelay.metered.ca:443?transport=tcp",
      ],
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    // Additional TURN servers for redundancy
    {
      urls: [
        "turn:global.turn.twilio.com:3478?transport=udp",
        "turn:global.turn.twilio.com:3478?transport=tcp",
        "turn:global.turn.twilio.com:443?transport=tcp",
      ],
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
  iceCandidatePoolSize: 20, // Increased pool size
  bundlePolicy: "max-bundle",
  rtcpMuxPolicy: "require",
  iceTransportPolicy: "all",
  // Add advanced configuration for better quality
  sdpSemantics: "unified-plan",
  // Enable bandwidth estimation
  bandwidth: {
    audio: 128,
    video: 5000,
  },
  // Add additional configuration for better reliability
  iceCandidatePoolSize: 20,
  iceTransportPolicy: "all",
  bundlePolicy: "max-bundle",
  rtcpMuxPolicy: "require",
  // Enable advanced features
  sdpSemantics: "unified-plan",
  // Add constraints for better quality
  constraints: {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: {
      width: { ideal: 1920, max: 2560 },
      height: { ideal: 1080, max: 1440 },
      frameRate: { ideal: 30, max: 60 },
    },
  },
};

// Media constraints for video and audio
export const mediaConstraints = {
  video: {
    width: { ideal: 1920, max: 2560 },
    height: { ideal: 1080, max: 1440 },
    frameRate: { ideal: 30, max: 60 },
    facingMode: "user",
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000,
    channelCount: 2,
  },
};

// Progressive quality constraints for fallback
export const progressiveConstraints = [
  // High quality
  {
    video: {
      width: { ideal: 1920, max: 2560 },
      height: { ideal: 1080, max: 1440 },
      frameRate: { ideal: 30, max: 60 },
      facingMode: "user",
    },
    audio: true,
  },
  // Medium quality
  {
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30, max: 60 },
      facingMode: "user",
    },
    audio: true,
  },
  // Basic quality
  {
    video: {
      width: { ideal: 640, max: 1280 },
      height: { ideal: 480, max: 720 },
      frameRate: { ideal: 24, max: 30 },
      facingMode: "user",
    },
    audio: true,
  },
  // Minimum quality
  {
    video: true,
    audio: true,
  },
];

// Connection state mapping
export const connectionStates = {
  new: "Initializing",
  connecting: "Connecting...",
  connected: "Connected",
  disconnected: "Disconnected",
  failed: "Connection Failed",
  closed: "Connection Closed",
};

// ICE connection state mapping
export const iceConnectionStates = {
  new: "Checking",
  checking: "Checking...",
  connected: "Connected",
  completed: "Completed",
  failed: "Failed",
  disconnected: "Disconnected",
  closed: "Closed",
};

// Signaling state mapping
export const signalingStates = {
  stable: "Stable",
  "have-local-offer": "Local Offer",
  "have-remote-offer": "Remote Offer",
  "have-local-pranswer": "Local Answer",
  "have-remote-pranswer": "Remote Answer",
  closed: "Closed",
};
