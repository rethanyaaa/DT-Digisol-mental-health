// Video Debug Utilities
export const videoDebug = {
  // Log comprehensive video element state
  logVideoState: (videoElement, label = "Video Element") => {
    if (!videoElement) {
      console.log(`${label}: Element is null`);
      return;
    }

    console.log(`=== ${label} State ===`);
    console.log("Element exists:", !!videoElement);
    console.log("Ready state:", videoElement.readyState);
    console.log("Network state:", videoElement.networkState);
    console.log("Paused:", videoElement.paused);
    console.log("Current time:", videoElement.currentTime);
    console.log("Duration:", videoElement.duration);
    console.log("Video width:", videoElement.videoWidth);
    console.log("Video height:", videoElement.videoHeight);
    console.log("Src object exists:", !!videoElement.srcObject);
    console.log("Src exists:", !!videoElement.src);
    console.log("Muted:", videoElement.muted);
    console.log("Volume:", videoElement.volume);
    console.log("Playback rate:", videoElement.playbackRate);
    console.log("Ended:", videoElement.ended);
    console.log("Seeking:", videoElement.seeking);
    console.log("Error:", videoElement.error);
  },

  // Log MediaStream state
  logStreamState: (stream, label = "MediaStream") => {
    if (!stream) {
      console.log(`${label}: Stream is null`);
      return;
    }

    console.log(`=== ${label} State ===`);
    console.log("Stream ID:", stream.id);
    console.log("Active:", stream.active);
    console.log("Tracks count:", stream.getTracks().length);

    const tracks = stream.getTracks();
    tracks.forEach((track, index) => {
      console.log(`Track ${index}:`, {
        kind: track.kind,
        id: track.id,
        enabled: track.enabled,
        muted: track.muted,
        readyState: track.readyState,
        settings: track.getSettings(),
        capabilities: track.getCapabilities(),
      });
    });
  },

  // Test video playback
  testVideoPlayback: async (videoElement, label = "Video Element") => {
    if (!videoElement) {
      console.log(`${label}: Cannot test - element is null`);
      return false;
    }

    console.log(`=== Testing ${label} Playback ===`);

    try {
      // Check if video can play
      if (videoElement.readyState >= 2) {
        // HAVE_CURRENT_DATA
        console.log("Video has data, attempting to play...");

        if (videoElement.paused) {
          await videoElement.play();
          console.log("Video playback started successfully");
          return true;
        } else {
          console.log("Video is already playing");
          return true;
        }
      } else {
        console.log(
          "Video not ready to play, readyState:",
          videoElement.readyState
        );
        return false;
      }
    } catch (error) {
      console.error("Error testing video playback:", error);
      return false;
    }
  },

  // Test WebRTC connection
  testWebRTCConnection: (peerConnection, label = "Peer Connection") => {
    if (!peerConnection) {
      console.log(`${label}: Connection is null`);
      return;
    }

    console.log(`=== ${label} State ===`);
    console.log("Connection state:", peerConnection.connectionState);
    console.log("ICE connection state:", peerConnection.iceConnectionState);
    console.log("Signaling state:", peerConnection.signalingState);
    console.log("Remote description:", peerConnection.remoteDescription);
    console.log("Local description:", peerConnection.localDescription);

    // Log ICE candidates
    console.log("ICE gathering state:", peerConnection.iceGatheringState);

    // Log connection quality
    if (peerConnection.getStats) {
      peerConnection
        .getStats()
        .then((stats) => {
          console.log("Connection stats:", stats);
        })
        .catch((error) => {
          console.error("Error getting stats:", error);
        });
    }
  },

  // Force video element setup
  forceVideoSetup: (videoElement, stream, label = "Video Element") => {
    if (!videoElement || !stream) {
      console.log(`${label}: Cannot setup - missing element or stream`);
      return false;
    }

    console.log(`=== Forcing ${label} Setup ===`);

    try {
      // Set the stream
      videoElement.srcObject = stream;
      console.log("Stream set to video element");

      // Add event listeners
      const events = [
        "loadstart",
        "loadedmetadata",
        "loadeddata",
        "canplay",
        "canplaythrough",
        "play",
        "playing",
        "waiting",
        "seeking",
        "seeked",
        "ended",
        "error",
        "stalled",
      ];

      events.forEach((event) => {
        videoElement.addEventListener(event, () => {
          console.log(`${label} event: ${event}`);
        });
      });

      // Try to play
      videoElement
        .play()
        .then(() => {
          console.log(`${label} playback started`);
        })
        .catch((error) => {
          console.error(`${label} playback failed:`, error);
        });

      return true;
    } catch (error) {
      console.error(`Error setting up ${label}:`, error);
      return false;
    }
  },

  // Check browser compatibility
  checkBrowserCompatibility: () => {
    console.log("=== Browser Compatibility Check ===");

    const checks = {
      getUserMedia: !!navigator.mediaDevices?.getUserMedia,
      RTCPeerConnection: !!window.RTCPeerConnection,
      MediaStream: !!window.MediaStream,
      WebSocket: !!window.WebSocket,
      videoElement: !!document.createElement("video").play,
    };

    Object.entries(checks).forEach(([feature, supported]) => {
      console.log(`${feature}: ${supported ? "Supported" : "Not Supported"}`);
    });

    return checks;
  },

  // Monitor video element for changes
  monitorVideoElement: (
    videoElement,
    label = "Video Element",
    duration = 10000
  ) => {
    if (!videoElement) {
      console.log(`${label}: Cannot monitor - element is null`);
      return;
    }

    console.log(`=== Monitoring ${label} for ${duration}ms ===`);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      console.log(`[${elapsed}ms] ${label} state:`, {
        readyState: videoElement.readyState,
        paused: videoElement.paused,
        currentTime: videoElement.currentTime,
        srcObject: !!videoElement.srcObject,
      });

      if (elapsed >= duration) {
        clearInterval(interval);
        console.log(`=== ${label} monitoring complete ===`);
      }
    }, 1000);

    return interval;
  },
};

export default videoDebug;
