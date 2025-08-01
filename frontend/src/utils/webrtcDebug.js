// WebRTC Debug Utilities

export const debugWebRTCConnection = (peerConnection, userType) => {
  console.log(`=== WebRTC Debug for ${userType} ===`);
  
  if (!peerConnection) {
    console.log("Peer connection is null");
    return;
  }

  // Connection state
  console.log("Connection state:", peerConnection.connectionState);
  console.log("ICE connection state:", peerConnection.iceConnectionState);
  console.log("Signaling state:", peerConnection.signalingState);

  // Local description
  console.log("Local description:", peerConnection.localDescription);
  
  // Remote description
  console.log("Remote description:", peerConnection.remoteDescription);

  // Senders (outgoing tracks)
  const senders = peerConnection.getSenders();
  console.log("Senders:", senders.map(sender => ({
    track: sender.track ? {
      kind: sender.track.kind,
      enabled: sender.track.enabled,
      readyState: sender.track.readyState,
      muted: sender.track.muted
    } : null,
    dtmfSender: !!sender.dtmfSender
  })));

  // Receivers (incoming tracks)
  const receivers = peerConnection.getReceivers();
  console.log("Receivers:", receivers.map(receiver => ({
    track: receiver.track ? {
      kind: receiver.track.kind,
      enabled: receiver.track.enabled,
      readyState: receiver.track.readyState,
      muted: receiver.track.muted
    } : null
  })));

  // ICE candidates
  console.log("ICE gathering state:", peerConnection.iceGatheringState);
  
  console.log("=== End WebRTC Debug ===");
};

export const debugStream = (stream, name) => {
  console.log(`=== Stream Debug: ${name} ===`);
  
  if (!stream) {
    console.log("Stream is null");
    return;
  }

  console.log("Stream ID:", stream.id);
  console.log("Stream active:", stream.active);
  
  const tracks = stream.getTracks();
  console.log("Tracks:", tracks.map(track => ({
    kind: track.kind,
    enabled: track.enabled,
    readyState: track.readyState,
    muted: track.muted,
    settings: track.getSettings(),
    capabilities: track.getCapabilities()
  })));

  console.log("=== End Stream Debug ===");
};

export const debugVideoElement = (videoElement, name) => {
  console.log(`=== Video Element Debug: ${name} ===`);
  
  if (!videoElement) {
    console.log("Video element is null");
    return;
  }

  console.log("Video element properties:", {
    srcObject: !!videoElement.srcObject,
    currentSrc: videoElement.currentSrc,
    readyState: videoElement.readyState,
    networkState: videoElement.networkState,
    currentTime: videoElement.currentTime,
    duration: videoElement.duration,
    paused: videoElement.paused,
    ended: videoElement.ended,
    muted: videoElement.muted,
    volume: videoElement.volume,
    width: videoElement.width,
    height: videoElement.height,
    videoWidth: videoElement.videoWidth,
    videoHeight: videoElement.videoHeight
  });

  if (videoElement.srcObject) {
    debugStream(videoElement.srcObject, `${name} srcObject`);
  }

  console.log("=== End Video Element Debug ===");
};

export const logWebRTCEvent = (event, description) => {
  console.log(`=== WebRTC Event: ${description} ===`);
  console.log("Event:", event);
  console.log("Event type:", event.type);
  console.log("Event target:", event.target);
  console.log("=== End WebRTC Event ===");
}; 