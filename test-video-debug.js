// Video Debug Test Script
// Run this in the browser console during a video call to debug issues

function testVideoConnection() {
  console.log("=== Video Connection Debug Test ===");

  // Test 1: Check if we're in a video call context
  const videoElements = document.querySelectorAll("video");
  console.log("Found video elements:", videoElements.length);

  videoElements.forEach((video, index) => {
    console.log(`Video ${index}:`, {
      srcObject: !!video.srcObject,
      readyState: video.readyState,
      paused: video.paused,
      currentTime: video.currentTime,
      duration: video.duration,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      muted: video.muted,
      autoplay: video.autoplay,
      playsInline: video.playsInline,
    });

    if (video.srcObject) {
      const stream = video.srcObject;
      console.log(`Video ${index} stream:`, {
        id: stream.id,
        tracks: stream.getTracks().map((t) => ({
          kind: t.kind,
          enabled: t.enabled,
          readyState: t.readyState,
          muted: t.muted,
        })),
      });
    }
  });

  // Test 2: Check for WebRTC connection
  if (window.RTCPeerConnection) {
    console.log("✅ RTCPeerConnection is available");
  } else {
    console.error("❌ RTCPeerConnection not available");
  }

  // Test 3: Check for getUserMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("✅ getUserMedia is available");
  } else {
    console.error("❌ getUserMedia not available");
  }

  // Test 4: Check for socket connection
  if (window.socket && window.socket.connected) {
    console.log("✅ Socket is connected");
  } else {
    console.log("⚠️ Socket not found or not connected");
  }

  // Test 5: Try to get local media
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("✅ Local media access successful");
        console.log(
          "Local stream tracks:",
          stream.getTracks().map((t) => ({
            kind: t.kind,
            enabled: t.enabled,
            readyState: t.readyState,
          }))
        );

        // Clean up
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((error) => {
        console.error("❌ Local media access failed:", error);
      });
  }
}

// Function to force play all videos
function forcePlayVideos() {
  console.log("=== Force Playing All Videos ===");
  const videos = document.querySelectorAll("video");

  videos.forEach((video, index) => {
    console.log(`Attempting to play video ${index}`);

    if (video.srcObject) {
      video
        .play()
        .then(() => {
          console.log(`✅ Video ${index} started playing`);
        })
        .catch((error) => {
          console.error(`❌ Error playing video ${index}:`, error);
        });
    } else {
      console.log(`⚠️ Video ${index} has no srcObject`);
    }
  });
}

// Function to check video element states
function checkVideoStates() {
  console.log("=== Video Element States ===");
  const videos = document.querySelectorAll("video");

  videos.forEach((video, index) => {
    const state = {
      srcObject: !!video.srcObject,
      readyState: video.readyState,
      paused: video.paused,
      ended: video.ended,
      seeking: video.seeking,
      currentTime: video.currentTime,
      duration: video.duration,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      muted: video.muted,
      volume: video.volume,
      playbackRate: video.playbackRate,
      autoplay: video.autoplay,
      controls: video.controls,
      loop: video.loop,
      playsInline: video.playsInline,
    };

    console.log(`Video ${index} state:`, state);
  });
}

// Run the tests
console.log("Available functions:");
console.log("- testVideoConnection() - Test video connection");
console.log("- forcePlayVideos() - Force play all videos");
console.log("- checkVideoStates() - Check video element states");

// Auto-run the main test
testVideoConnection();
