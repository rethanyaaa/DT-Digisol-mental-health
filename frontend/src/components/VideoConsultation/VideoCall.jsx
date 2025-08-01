import React, { useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useWebRTC } from "../../hooks/useWebRTC";
import {
  connectionStates,
  iceConnectionStates,
} from "../../utils/webrtcConfig";
import {
  debugWebRTCConnection,
  debugStream,
  debugVideoElement,
} from "../../utils/webrtcDebug";

const VideoCall = ({ socket, roomId, userType, onEndCall }) => {
  const {
    localStream,
    remoteStream,
    connectionState,
    iceConnectionState,
    isConnecting,
    error,
    localVideoRef,
    remoteVideoRef,
    initializeConnection,
    cleanup,
  } = useWebRTC(socket, roomId, userType);

  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  // Initialize connection on mount
  useEffect(() => {
    console.log("VideoCall component mounted, initializing connection...");
    initializeConnection();
    return () => {
      console.log("VideoCall component unmounting, cleaning up...");
      cleanup();
    };
  }, []); // Remove dependencies to prevent re-initialization

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // End call
  const handleEndCall = () => {
    cleanup();
    onEndCall();
  };

  // Test video quality
  const testVideoQuality = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        const capabilities = videoTrack.getCapabilities();
        console.log("=== VIDEO QUALITY TEST ===");
        console.log("Current settings:", settings);
        console.log("Available capabilities:", capabilities);
        console.log("Track enabled:", videoTrack.enabled);
        console.log("Track ready state:", videoTrack.readyState);
        console.log("Track muted:", videoTrack.muted);
        console.log("=== END VIDEO QUALITY TEST ===");
      }
    }
  };

  // Debug connection state
  const debugConnection = () => {
    console.log("=== CONNECTION DEBUG ===");
    console.log("Local stream:", localStream);
    console.log("Remote stream:", remoteStream);
    console.log("Connection state:", connectionState);
    console.log("ICE connection state:", iceConnectionState);
    console.log("Signaling state:", signalingState);
    console.log("Is connecting:", isConnecting);
    console.log("Error:", error);
    console.log("User type:", userType);
    console.log("Room ID:", roomId);

    // Use debug utilities
    if (localStream) {
      debugStream(localStream, "Local Stream");
    }

    if (remoteStream) {
      debugStream(remoteStream, "Remote Stream");
    }

    if (localVideoRef.current) {
      debugVideoElement(localVideoRef.current, "Local Video");
    }

    if (remoteVideoRef.current) {
      debugVideoElement(remoteVideoRef.current, "Remote Video");
    }

    console.log("=== END CONNECTION DEBUG ===");
  };

  // Check peer connection state
  const checkPeerConnection = () => {
    console.log("=== PEER CONNECTION CHECK ===");
    // We need to access the peer connection from the hook
    // This is a limitation of the current hook design
    console.log("Note: Peer connection debugging requires hook modification");
    console.log("Current connection state:", connectionState);
    console.log("Current ICE state:", iceConnectionState);
    console.log("Current signaling state:", signalingState);
    console.log("=== END PEER CONNECTION CHECK ===");
  };

  // Get status color
  const getStatusColor = () => {
    switch (connectionState) {
      case "connected":
        return "text-green-500";
      case "connecting":
        return "text-yellow-500";
      case "failed":
      case "disconnected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <VideoOff className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleEndCall}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            End Call
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Remote Video */}
      <div className="relative w-full h-full">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          onLoadedMetadata={() => {
            console.log("Remote video loaded metadata");
            console.log("Remote video element:", remoteVideoRef.current);
            console.log(
              "Remote video srcObject:",
              remoteVideoRef.current?.srcObject
            );
          }}
          onCanPlay={() => {
            console.log("Remote video can play");
            console.log(
              "Remote video currentTime:",
              remoteVideoRef.current?.currentTime
            );
            console.log(
              "Remote video readyState:",
              remoteVideoRef.current?.readyState
            );
          }}
          onError={(e) => {
            console.error("Remote video error:", e);
            console.error("Remote video error details:", e.target.error);
          }}
          onStalled={() => console.log("Remote video stalled")}
          onWaiting={() => console.log("Remote video waiting")}
          onPlaying={() => console.log("Remote video playing")}
          onPause={() => console.log("Remote video paused")}
          // Add quality optimization attributes
          preload="auto"
          muted={false}
          controls={false}
          style={{
            imageRendering: "crisp-edges",
            objectFit: "cover",
          }}
        />
        {!remoteStream && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-2xl">
            Waiting for remote video...
            <br />
            <span className="text-sm mt-2">
              Connection: {connectionStates[connectionState]} | ICE:{" "}
              {iceConnectionStates[iceConnectionState]}
            </span>
          </div>
        )}

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            onLoadedMetadata={() => console.log("Local video loaded metadata")}
            onCanPlay={() => console.log("Local video can play")}
            onError={(e) => console.error("Local video error:", e)}
            // Add quality optimization attributes
            preload="auto"
            controls={false}
            style={{
              imageRendering: "crisp-edges",
              objectFit: "cover",
            }}
          />
          {!localStream && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
              No local video
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
          <span
            className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor()}`}
          ></span>
          {connectionStates[connectionState]} |{" "}
          {iceConnectionStates[iceConnectionState]}
        </div>

        {/* Video Quality Indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
          <span className="text-xs">HD Video Enabled</span>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              isVideoEnabled ? "bg-white" : "bg-red-600"
            }`}
          >
            {isVideoEnabled ? (
              <Video className="w-6 h-6 text-gray-800" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full ${
              isAudioEnabled ? "bg-white" : "bg-red-600"
            }`}
          >
            {isAudioEnabled ? (
              <Mic className="w-6 h-6 text-gray-800" />
            ) : (
              <MicOff className="w-6 h-6 text-white" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 rounded-full bg-white"
          >
            <Settings className="w-6 h-6 text-gray-800" />
          </button>

          {/* Quality Test */}
          <button
            onClick={testVideoQuality}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700"
            title="Test Video Quality"
          >
            <span className="text-white text-xs">HD</span>
          </button>

          {/* Debug Connection */}
          <button
            onClick={debugConnection}
            className="p-3 rounded-full bg-yellow-600 hover:bg-yellow-700"
            title="Debug Connection"
          >
            <span className="text-white text-xs">DBG</span>
          </button>

          {/* Check Peer Connection */}
          <button
            onClick={checkPeerConnection}
            className="p-3 rounded-full bg-purple-600 hover:bg-purple-700"
            title="Check Peer Connection"
          >
            <span className="text-white text-xs">PC</span>
          </button>

          {/* Reinitialize Connection */}
          <button
            onClick={() => {
              console.log("Manually reinitializing connection...");
              cleanup();
              setTimeout(() => {
                initializeConnection();
              }, 1000);
            }}
            className="p-3 rounded-full bg-green-600 hover:bg-green-700"
            title="Reinitialize Connection"
          >
            <span className="text-white text-xs">RST</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-full bg-white"
          >
            {isFullscreen ? (
              <Minimize2 className="w-6 h-6 text-gray-800" />
            ) : (
              <Maximize2 className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-20 right-4 bg-white rounded-lg p-4 shadow-lg">
            <h3 className="font-semibold mb-2">Settings</h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-gray-600">
                  Connection State:
                </label>
                <p className="text-sm font-medium">
                  {connectionStates[connectionState]}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">ICE State:</label>
                <p className="text-sm font-medium">
                  {iceConnectionStates[iceConnectionState]}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">User Type:</label>
                <p className="text-sm font-medium capitalize">{userType}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Room ID:</label>
                <p className="text-sm font-medium">{roomId?.slice(0, 8)}...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
