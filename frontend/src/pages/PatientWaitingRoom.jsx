import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MessageSquare,
  X,
  Check,
  Clock,
  User,
  AlertTriangle,
  Settings,
  RefreshCw,
  Send,
  Phone,
  PhoneOff,
} from "lucide-react";
import {
  getUserMedia,
  isVideoConsultationSupported,
} from "../utils/webrtcUtils";
import { AppContext } from "../context/AppContext";
import VideoCall from "../components/VideoConsultation/VideoCall"; // Add this import

const PatientWaitingRoom = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token: authToken, backendUrl } = useContext(AppContext);

  // Get consultation token from URL if available
  const consultationToken = searchParams.get("token");

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [waitingRoomInfo, setWaitingRoomInfo] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [deviceTestResults, setDeviceTestResults] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [consultationStarting, setConsultationStarting] = useState(false);
  const [error, setError] = useState(null);
  const [consultationValidated, setConsultationValidated] = useState(false);
  const [isInVideoCall, setIsInVideoCall] = useState(false); // Add this state

  const videoRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomId) {
      navigate("/login");
      return;
    }

    // If we have a consultation token, validate it first
    if (consultationToken) {
      validateConsultation();
    } else if (!authToken) {
      // If no consultation token and no auth token, redirect to login
      navigate("/login");
      return;
    } else {
      // If we have auth token, proceed directly
      setConsultationValidated(true);
      initializeSocket();
      initializeMedia();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [roomId, consultationToken, authToken]);

  useEffect(() => {
    if (consultationValidated && !socket) {
      initializeSocket();
      initializeMedia();
    }
  }, [consultationValidated]);

  const validateConsultation = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/consultation/details/${roomId}?token=${consultationToken}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConsultationValidated(true);
        } else {
          setError(data.message || "Invalid consultation link");
        }
      } else {
        setError("Failed to validate consultation link");
      }
    } catch (error) {
      console.error("Error validating consultation:", error);
      setError("Failed to validate consultation link");
    }
  };

  useEffect(() => {
    if (localStream && videoRef.current) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeSocket = () => {
    // Use consultation token if available, otherwise use auth token
    const tokenToUse = consultationToken || authToken;

    const socketInstance = io(backendUrl, {
      auth: {
        token: tokenToUse,
        userType: "patient",
        consultationToken: consultationToken, // Pass consultation token for validation
      },
    });

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setIsConnected(true);

      // Join waiting room
      const joinData = { roomId };
      if (searchParams.get("appointmentId")) {
        joinData.appointmentId = searchParams.get("appointmentId");
      }
      socketInstance.emit("join-waiting-room", joinData);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    socketInstance.on("waiting-room-joined", (data) => {
      console.log("Joined waiting room:", data);
      setWaitingRoomInfo(data);
      setMessages(data.messages || []);
    });

    socketInstance.on("doctor-joined-waiting-room", (data) => {
      console.log("Doctor joined waiting room:", data);
      setWaitingRoomInfo((prev) => ({
        ...prev,
        doctorOnline: true,
        doctor: data.doctor,
      }));
    });

    socketInstance.on("doctor-left-waiting-room", (data) => {
      console.log("Doctor left waiting room:", data);
      setWaitingRoomInfo((prev) => ({
        ...prev,
        doctorOnline: false,
        doctor: null,
      }));
    });

    socketInstance.on("waiting-room-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on("doctor-joining-consultation", (data) => {
      console.log("Doctor joining consultation:", data);
      setConsultationStarting(true);

      // Navigate to consultation after a short delay
      setTimeout(() => {
        navigate(`/consultation/${roomId}`);
      }, 2000);
    });

    socketInstance.on("consultation-starting", (data) => {
      console.log("Consultation starting:", data);
      setConsultationStarting(true);

      // Navigate to consultation
      navigate(`/consultation/${roomId}`);
    });

    socketInstance.on("doctor-wants-video-call", (data) => {
      console.log("Doctor wants to start video call:", data);
      // Automatically start video call when doctor requests it
      startVideoCall();
    });

    socketInstance.on("doctor-ended-video-call", (data) => {
      console.log("Doctor ended video call:", data);
      // End the video call and navigate to appointments
      if (isInVideoCall) {
        endVideoCall();
      } else {
        // If not in video call, just navigate to appointments
        navigate("/my-appointments");
      }
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
      setError(error.message);
    });

    setSocket(socketInstance);
  };

  const initializeMedia = async () => {
    try {
      if (!isVideoConsultationSupported()) {
        setError("Your browser does not support video consultation");
        return;
      }

      const stream = await getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setError("Failed to access camera/microphone. Please check permissions.");
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      socket.emit("waiting-room-message", {
        roomId,
        message: newMessage.trim(),
      });
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const runDeviceTest = async () => {
    try {
      // Simple device test - check if camera and microphone are working
      const testResults = {
        camera: isVideoEnabled && localStream?.getVideoTracks().length > 0,
        microphone: isAudioEnabled && localStream?.getAudioTracks().length > 0,
        browser: isVideoConsultationSupported(),
        timestamp: new Date().toISOString(),
      };

      testResults.allTestsPassed =
        testResults.camera && testResults.microphone && testResults.browser;

      setDeviceTestResults(testResults);

      // Send results to server
      if (socket) {
        socket.emit("device-test-results", {
          roomId,
          results: testResults,
        });
      }

      setIsReady(testResults.allTestsPassed);
    } catch (err) {
      console.error("Device test failed:", err);
      setError("Device test failed. Please check your camera and microphone.");
    }
  };

  const toggleReadyStatus = () => {
    const newReadyStatus = !isReady;
    setIsReady(newReadyStatus);

    if (socket) {
      socket.emit("patient-ready", {
        roomId,
        ready: newReadyStatus,
      });
    }
  };

  const leaveWaitingRoom = () => {
    if (socket) {
      socket.emit("leave-waiting-room", { roomId });
    }
    navigate("/my-appointments");
  };

  // Add video call handlers
  const startVideoCall = () => {
    setIsInVideoCall(true);
  };

  const endVideoCall = () => {
    setIsInVideoCall(false);
    // Navigate to MyAppointments page when video call ends
    navigate("/my-appointments");
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/my-appointments")}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? "Connected" : "Connecting..."}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Room: <span className="font-mono">{roomId}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {waitingRoomInfo?.doctorOnline && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  <User size={16} />
                  Doctor Online
                </div>
              )}
              <button
                onClick={leaveWaitingRoom}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <X size={16} />
                Leave
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Preview */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Video
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleVideo}
                    className={`p-2 rounded-lg transition-colors ${
                      isVideoEnabled
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                  >
                    {isVideoEnabled ? (
                      <Video size={20} />
                    ) : (
                      <VideoOff size={20} />
                    )}
                  </button>
                  <button
                    onClick={toggleAudio}
                    className={`p-2 rounded-lg transition-colors ${
                      isAudioEnabled
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                  >
                    {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                </div>
              </div>

              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <VideoOff className="text-white" size={48} />
                  </div>
                )}
              </div>
            </div>

            {/* Device Test */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Device Test
              </h2>

              {deviceTestResults ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`p-4 rounded-lg border-2 ${
                        deviceTestResults.camera
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {deviceTestResults.camera ? (
                          <Check className="text-green-600" size={20} />
                        ) : (
                          <X className="text-red-600" size={20} />
                        )}
                        <span className="font-medium">Camera</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {deviceTestResults.camera
                          ? "Working properly"
                          : "Issue detected"}
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-lg border-2 ${
                        deviceTestResults.microphone
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {deviceTestResults.microphone ? (
                          <Check className="text-green-600" size={20} />
                        ) : (
                          <X className="text-red-600" size={20} />
                        )}
                        <span className="font-medium">Microphone</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {deviceTestResults.microphone
                          ? "Working properly"
                          : "Issue detected"}
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-lg border-2 ${
                        deviceTestResults.browser
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {deviceTestResults.browser ? (
                          <Check className="text-green-600" size={20} />
                        ) : (
                          <X className="text-red-600" size={20} />
                        )}
                        <span className="font-medium">Browser</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {deviceTestResults.browser
                          ? "Compatible"
                          : "Not supported"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={runDeviceTest}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <RefreshCw size={16} />
                      Run Test Again
                    </button>

                    <button
                      onClick={toggleReadyStatus}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isReady
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-600 text-white hover:bg-gray-700"
                      }`}
                    >
                      {isReady ? <Check size={16} /> : <Clock size={16} />}
                      {isReady ? "Ready" : "Mark as Ready"}
                    </button>

                    {waitingRoomInfo?.doctorOnline && (
                      <button
                        onClick={startVideoCall}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Phone size={16} />
                        Start Video Call
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="text-gray-400 mx-auto mb-4" size={48} />
                  <p className="text-gray-600 mb-4">
                    Test your devices before the consultation
                  </p>
                  <button
                    onClick={runDeviceTest}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <RefreshCw size={16} />
                    Start Device Test
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Waiting Room Info */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Waiting Room
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      waitingRoomInfo?.doctorOnline
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {waitingRoomInfo?.doctorOnline
                      ? "Doctor Online"
                      : "Waiting for Doctor"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Patients waiting:</span>
                  <span className="font-medium">
                    {waitingRoomInfo?.waitingPatients || 0}
                  </span>
                </div>

                {waitingRoomInfo?.appointment && (
                  <div className="pt-4 border-t">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Appointment Details
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Date: {waitingRoomInfo.appointment.slotDate}</p>
                      <p>Time: {waitingRoomInfo.appointment.slotTime}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chat */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MessageSquare size={20} />
                  </button>
                </div>
              </div>

              {showChat && (
                <>
                  <div className="h-64 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.userType === "patient"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg ${
                            message.userType === "patient"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Starting Overlay */}
      {consultationStarting && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-green-600" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Consultation Starting
            </h2>
            <p className="text-gray-600 mb-4">
              Your doctor is joining the consultation...
            </p>
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}

      {/* Video Call Component */}
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

export default PatientWaitingRoom;
