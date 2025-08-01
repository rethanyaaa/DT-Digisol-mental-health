import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

const ConnectionTest = ({ socket, roomId, userType }) => {
  const [tests, setTests] = useState({
    socketConnected: false,
    socketInRoom: false,
    webrtcSupported: false,
    mediaAccess: false,
    iceServers: false,
  });
  const [running, setRunning] = useState(false);

  const runTests = async () => {
    setRunning(true);
    const newTests = { ...tests };

    // Test 1: Socket Connection
    try {
      newTests.socketConnected = socket?.connected || false;
      console.log("Socket connected:", newTests.socketConnected);
    } catch (error) {
      console.error("Socket connection test failed:", error);
      newTests.socketConnected = false;
    }

    // Test 2: Socket in Room
    try {
      if (socket?.connected && roomId) {
        // Check if socket is in the room
        newTests.socketInRoom = socket.rooms?.has(roomId) || false;
        console.log("Socket in room:", newTests.socketInRoom);
      } else {
        newTests.socketInRoom = false;
      }
    } catch (error) {
      console.error("Socket room test failed:", error);
      newTests.socketInRoom = false;
    }

    // Test 3: WebRTC Support
    try {
      newTests.webrtcSupported = !!(
        window.RTCPeerConnection &&
        window.RTCSessionDescription &&
        window.RTCIceCandidate
      );
      console.log("WebRTC supported:", newTests.webrtcSupported);
    } catch (error) {
      console.error("WebRTC support test failed:", error);
      newTests.webrtcSupported = false;
    }

    // Test 4: Media Access
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      newTests.mediaAccess = !!stream;
      stream.getTracks().forEach(track => track.stop());
      console.log("Media access:", newTests.mediaAccess);
    } catch (error) {
      console.error("Media access test failed:", error);
      newTests.mediaAccess = false;
    }

    // Test 5: ICE Servers
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }
        ]
      });
      newTests.iceServers = true;
      pc.close();
      console.log("ICE servers test passed");
    } catch (error) {
      console.error("ICE servers test failed:", error);
      newTests.iceServers = false;
    }

    setTests(newTests);
    setRunning(false);
  };

  useEffect(() => {
    runTests();
  }, [socket, roomId]);

  const getTestIcon = (passed) => {
    if (passed) {
      return <CheckCircle className="text-green-500" size={20} />;
    } else {
      return <XCircle className="text-red-500" size={20} />;
    }
  };

  const getTestColor = (passed) => {
    return passed ? "text-green-700" : "text-red-700";
  };

  const allTestsPassed = Object.values(tests).every(test => test);

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Connection Test</h3>
        <button
          onClick={runTests}
          disabled={running}
          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`${running ? 'animate-spin' : ''}`} size={16} />
          {running ? "Testing..." : "Test Again"}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Socket Connected</span>
          <div className="flex items-center gap-2">
            {getTestIcon(tests.socketConnected)}
            <span className={`text-sm font-medium ${getTestColor(tests.socketConnected)}`}>
              {tests.socketConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Socket in Room</span>
          <div className="flex items-center gap-2">
            {getTestIcon(tests.socketInRoom)}
            <span className={`text-sm font-medium ${getTestColor(tests.socketInRoom)}`}>
              {tests.socketInRoom ? "In Room" : "Not in Room"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">WebRTC Support</span>
          <div className="flex items-center gap-2">
            {getTestIcon(tests.webrtcSupported)}
            <span className={`text-sm font-medium ${getTestColor(tests.webrtcSupported)}`}>
              {tests.webrtcSupported ? "Supported" : "Not Supported"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Media Access</span>
          <div className="flex items-center gap-2">
            {getTestIcon(tests.mediaAccess)}
            <span className={`text-sm font-medium ${getTestColor(tests.mediaAccess)}`}>
              {tests.mediaAccess ? "Available" : "Blocked"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">ICE Servers</span>
          <div className="flex items-center gap-2">
            {getTestIcon(tests.iceServers)}
            <span className={`text-sm font-medium ${getTestColor(tests.iceServers)}`}>
              {tests.iceServers ? "Working" : "Failed"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          {allTestsPassed ? (
            <CheckCircle className="text-green-500" size={20} />
          ) : (
            <AlertTriangle className="text-yellow-500" size={20} />
          )}
          <span className="font-medium">
            {allTestsPassed ? "All Tests Passed" : "Some Tests Failed"}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {allTestsPassed 
            ? "Your connection should work properly for video consultation."
            : "Some connection issues detected. Please check your internet connection and browser permissions."
          }
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Room ID:</strong> {roomId}</p>
        <p><strong>User Type:</strong> {userType}</p>
        <p><strong>Browser:</strong> {navigator.userAgent}</p>
      </div>
    </div>
  );
};

export default ConnectionTest; 