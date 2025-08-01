import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import {
  Video,
  MessageSquare,
  Phone,
  Clock,
  User,
  Check,
  X,
  AlertTriangle,
  Settings,
  RefreshCw,
  Send,
  Users,
  Calendar,
  Bell,
} from "lucide-react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";
import VideoCall from "../../components/VideoConsultation/VideoCall"; // Add this import
import PostConsultationForm from "../../components/PostConsultationForm"; // Add this import

const DoctorWaitingRoom = () => {
  const navigate = useNavigate();
  const { dToken, backendUrl, completeVideoAppointment } =
    useContext(DoctorContext);

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [waitingRooms, setWaitingRooms] = useState([]); // List of rooms doctor is managing
  const [selectedRoom, setSelectedRoom] = useState(null); // Currently selected room for detailed view
  const [messages, setMessages] = useState([]); // Chat messages for selected room
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [notifications, setNotifications] = useState([]); // Notifications for patient joins/leaves/tests
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]); // Doctor's appointments
  const [isLoading, setIsLoading] = useState(true);
  const [isInVideoCall, setIsInVideoCall] = useState(false); // Add this state
  const [currentCallRoom, setCurrentCallRoom] = useState(null); // Add this state
  const [currentCallAppointmentId, setCurrentCallAppointmentId] =
    useState(null); // Add this state
  const [roomToAppointmentMap, setRoomToAppointmentMap] = useState(new Map()); // Add this state
  const [showPostConsultationForm, setShowPostConsultationForm] =
    useState(false); // Add this state
  const messagesEndRef = useRef(null);

  // Fetch doctor's appointments
  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        {
          headers: { dToken },
        }
      );

      if (data.success) {
        setAppointments(data.appointments);
        console.log("Doctor appointments:", data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    }
  };

  // Get video consultations that need waiting rooms
  const getVideoConsultations = () => {
    return appointments.filter(
      (appointment) =>
        appointment.consultationType === "video" &&
        appointment.payment &&
        !appointment.cancelled &&
        !appointment.isCompleted
    );
  };

  // Join waiting rooms for video consultations
  const joinWaitingRoomsForConsultations = async () => {
    const videoConsultations = getVideoConsultations();
    console.log("Video consultations found:", videoConsultations.length);

    for (const appointment of videoConsultations) {
      try {
        console.log(`Processing appointment: ${appointment._id}`);

        // Get consultation details for this appointment
        const consultationResponse = await axios.get(
          `${backendUrl}/api/consultation/appointment/${appointment._id}`,
          { headers: { dToken } }
        );

        console.log("Consultation response:", consultationResponse.data);

        // Use optional chaining to safely check the response
        if (
          consultationResponse.data?.success &&
          consultationResponse.data.data?.length > 0
        ) {
          const consultation = consultationResponse.data.data[0];

          console.log(
            `Found consultation for appointment ${appointment._id}:`,
            consultation
          );

          // Join the waiting room
          if (socket) {
            console.log(`Emitting join-waiting-room with data:`, {
              roomId: consultation.roomId,
              appointmentId: appointment._id,
            });

            socket.emit("join-waiting-room", {
              roomId: consultation.roomId,
              appointmentId: appointment._id,
            });

            // Store the mapping between room ID and appointment ID
            setRoomToAppointmentMap(
              (prev) => new Map(prev.set(consultation.roomId, appointment._id))
            );

            console.log(
              `Joining waiting room for appointment ${appointment._id}: ${consultation.roomId}`
            );

            // Add a small delay to ensure the join event is processed
            await new Promise((resolve) => setTimeout(resolve, 100));
          } else {
            console.log("Socket not available for joining waiting room");
          }
        } else {
          console.log(
            `No consultation found for appointment ${appointment._id}`
          );
          console.log("Response structure:", consultationResponse.data);
        }
      } catch (error) {
        console.error(
          `Error joining waiting room for appointment ${appointment._id}:`,
          error
        );
        if (error.response) {
          console.error("Error response:", error.response.data);
        }
      }
    }
  };

  useEffect(() => {
    if (!dToken) {
      navigate("/login");
      return;
    }

    const initializeData = async () => {
      setIsLoading(true);
      await fetchAppointments();
      setIsLoading(false);
    };

    initializeData();
  }, [dToken]);

  useEffect(() => {
    if (!dToken) {
      navigate("/login");
      return;
    }

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dToken]);

  useEffect(() => {
    if (socket && isConnected && appointments.length > 0) {
      joinWaitingRoomsForConsultations();
    }
  }, [socket, isConnected, appointments]);

  // Periodic check to ensure doctor stays in waiting rooms
  useEffect(() => {
    if (socket && isConnected && appointments.length > 0) {
      const interval = setInterval(() => {
        console.log("Periodic check: Ensuring doctor is in waiting rooms");
        joinWaitingRoomsForConsultations();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [socket, isConnected, appointments]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeSocket = () => {
    console.log(
      "Initializing socket with token:",
      dToken ? "present" : "missing"
    );
    console.log("Backend URL:", backendUrl);
    console.log("Token length:", dToken ? dToken.length : 0);
    console.log(
      "Token preview:",
      dToken ? `${dToken.substring(0, 20)}...` : "none"
    );

    if (!dToken) {
      console.error("No doctor token available for socket connection");
      setError("No authentication token available");
      return;
    }

    if (!backendUrl) {
      console.error("No backend URL available for socket connection");
      setError("No backend URL available");
      return;
    }

    const socketInstance = io(backendUrl, {
      auth: {
        token: dToken,
        userType: "doctor",
      },
      transports: ["websocket", "polling"], // Add explicit transports
      timeout: 20000, // Add timeout
      forceNew: true, // Force new connection
    });

    socketInstance.on("connect", () => {
      console.log("Doctor connected to Socket.IO server");
      console.log("Socket ID:", socketInstance.id);
      console.log("Socket connected:", socketInstance.connected);
      console.log("Socket transport:", socketInstance.io.engine.transport.name);
      setIsConnected(true);
      setError(null); // Clear any previous errors
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      console.error("Error details:", {
        message: error.message,
        description: error.description,
        context: error.context,
        type: error.type,
      });
      setError(`Connection error: ${error.message}`);
      setIsConnected(false);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Doctor disconnected from Socket.IO server");
      console.log("Disconnect reason:", reason);
      setIsConnected(false);
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error event:", error);
      setError(`Socket error: ${error.message || error}`);
    });

    socketInstance.on("patient-joined-waiting-room", (data) => {
      console.log("Doctor received patient-joined-waiting-room event:", data);
      handlePatientJoined(data);
      // Show toast notification
      toast.info(`Patient joined waiting room ${data.roomId.slice(0, 8)}...`);
    });

    socketInstance.on("patient-left-waiting-room", (data) => {
      console.log("Doctor received patient-left-waiting-room event:", data);
      handlePatientLeft(data);
      toast.info(`Patient left waiting room ${data.roomId.slice(0, 8)}...`);
    });

    socketInstance.on("patient-device-test-completed", (data) => {
      console.log("Doctor received patient-device-test-completed event:", data);
      handleDeviceTestCompleted(data);
      toast.success(
        `Patient completed device test in room ${data.roomId.slice(0, 8)}...`
      );
    });

    socketInstance.on("patient-ready-status-changed", (data) => {
      console.log("Doctor received patient-ready-status-changed event:", data);
      handlePatientReadyStatusChanged(data);
      toast.info(
        `Patient is ${
          data.ready ? "ready" : "not ready"
        } in room ${data.roomId.slice(0, 8)}...`
      );
    });

    socketInstance.on("waiting-room-message", (message) => {
      console.log("Doctor received waiting-room-message event:", message);
      if (selectedRoom && message.roomId === selectedRoom.roomId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || "Unknown socket error";
      setError(errorMessage);
      toast.error(`Socket error: ${errorMessage}`);
    });

    setSocket(socketInstance);
  };

  const handlePatientJoined = (data) => {
    const { roomId, patient, appointment } = data;

    setWaitingRooms((prev) => {
      const existingRoomIndex = prev.findIndex(
        (room) => room.roomId === roomId
      );

      if (existingRoomIndex >= 0) {
        // Update existing room
        const updatedRooms = [...prev];
        const existingRoom = updatedRooms[existingRoomIndex];

        // Check if patient already exists
        const existingPatientIndex = existingRoom.patients.findIndex(
          (p) => p.userId === patient.userId
        );

        if (existingPatientIndex >= 0) {
          existingRoom.patients[existingPatientIndex] = {
            ...patient,
            appointment,
          };
        } else {
          existingRoom.patients.push({ ...patient, appointment });
        }

        return updatedRooms;
      } else {
        // Create new room
        return [
          ...prev,
          {
            roomId,
            patients: [{ ...patient, appointment }],
            messages: [],
          },
        ];
      }
    });

    addNotification(
      `Patient joined waiting room ${roomId.slice(0, 8)}...`,
      "info"
    );
  };

  const handlePatientLeft = (data) => {
    const { roomId, patientId, remainingPatients } = data;

    setWaitingRooms((prev) => {
      const roomIndex = prev.findIndex((room) => room.roomId === roomId);

      if (roomIndex >= 0) {
        const updatedRooms = [...prev];
        const room = updatedRooms[roomIndex];

        room.patients = room.patients.filter((p) => p.userId !== patientId);

        // Remove room if no patients left
        if (room.patients.length === 0) {
          return updatedRooms.filter((r) => r.roomId !== roomId);
        }

        return updatedRooms;
      }

      return prev;
    });

    addNotification(
      `Patient left waiting room ${roomId.slice(0, 8)}...`,
      "info"
    );
  };

  const handleDeviceTestCompleted = (data) => {
    const { roomId, patientId, results, ready } = data;

    setWaitingRooms((prev) => {
      const roomIndex = prev.findIndex((room) => room.roomId === roomId);

      if (roomIndex >= 0) {
        const updatedRooms = [...prev];
        const room = updatedRooms[roomIndex];
        const patientIndex = room.patients.findIndex(
          (p) => p.userId === patientId
        );

        if (patientIndex >= 0) {
          room.patients[patientIndex] = {
            ...room.patients[patientIndex],
            deviceTestCompleted: true,
            deviceTestResults: results,
            ready,
          };
        }

        return updatedRooms;
      }

      return prev;
    });

    addNotification(
      `Patient ${patientId.slice(0, 8)}... completed device test`,
      "success"
    );
  };

  const handlePatientReadyStatusChanged = (data) => {
    const { roomId, patientId, ready } = data;

    setWaitingRooms((prev) => {
      const roomIndex = prev.findIndex((room) => room.roomId === roomId);

      if (roomIndex >= 0) {
        const updatedRooms = [...prev];
        const room = updatedRooms[roomIndex];
        const patientIndex = room.patients.findIndex(
          (p) => p.userId === patientId
        );

        if (patientIndex >= 0) {
          room.patients[patientIndex] = {
            ...room.patients[patientIndex],
            ready,
          };
        }

        return updatedRooms;
      }

      return prev;
    });

    addNotification(
      `Patient ${patientId.slice(0, 8)}... is ${ready ? "ready" : "not ready"}`,
      "info"
    );
  };

  const addNotification = (message, type = "info") => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    };

    setNotifications((prev) => [notification, ...prev.slice(0, 9)]); // Keep last 10 notifications
  };

  const joinWaitingRoom = (roomId) => {
    if (socket) {
      socket.emit("join-waiting-room", { roomId });

      const room = waitingRooms.find((r) => r.roomId === roomId);
      if (room) {
        setSelectedRoom(room);
        setMessages(room.messages || []);
      }
    }
  };

  const startConsultation = (patientId) => {
    if (socket && selectedRoom) {
      socket.emit("start-consultation", {
        roomId: selectedRoom.roomId,
        patientId,
      });

      // Navigate to consultation page
      navigate(`/consultation/${selectedRoom.roomId}?patientId=${patientId}`);
    }
  };

  const sendMessage = () => {
    if (socket && selectedRoom && newMessage.trim()) {
      socket.emit("waiting-room-message", {
        roomId: selectedRoom.roomId,
        message: newMessage.trim(),
      });

      setNewMessage("");
    }
  };

  // Add video call handlers
  const startVideoCall = (roomId) => {
    console.log("Starting video call for room:", roomId);
    console.log("Current waiting rooms:", waitingRooms);
    console.log("Current socket state:", socket ? "connected" : "disconnected");

    // Check if we have a valid room
    const room = waitingRooms.find((r) => r.roomId === roomId);
    if (!room) {
      console.error("Room not found:", roomId);
      toast.error("Room not found. Please refresh and try again.");
      return;
    }

    // Check if there are patients in the room
    if (!room.patients || room.patients.length === 0) {
      console.error("No patients in room:", roomId);
      toast.error("No patients available for video call.");
      return;
    }

    console.log("Room found:", room);
    console.log("Patients in room:", room.patients);

    // Get the appointment ID for this room
    const appointmentId = roomToAppointmentMap.get(roomId);
    if (!appointmentId) {
      console.error("No appointment ID found for room:", roomId);
      toast.error(
        "Could not find appointment details. Please refresh and try again."
      );
      return;
    }

    setCurrentCallRoom(roomId);
    setCurrentCallAppointmentId(appointmentId);
    setIsInVideoCall(true);

    // Notify the patient that doctor wants to start video call
    if (socket) {
      socket.emit("doctor-start-video-call", {
        roomId: roomId,
        doctorId: "doctor", // You might want to get actual doctor ID
      });
      console.log("Emitted doctor-start-video-call event");
    } else {
      console.error("Socket not available for video call");
      toast.error("Connection lost. Please refresh the page.");
    }
  };

  const endVideoCall = async () => {
    if (currentCallAppointmentId && currentCallRoom) {
      try {
        // Complete the appointment via video call
        const success = await completeVideoAppointment(
          currentCallAppointmentId,
          currentCallRoom
        );

        if (success) {
          // Show post-consultation form instead of navigating immediately
          console.log(
            "Video call completed successfully, showing post-consultation form"
          );
          console.log("Current appointment ID:", currentCallAppointmentId);
          setShowPostConsultationForm(true);
          // Don't reset currentCallAppointmentId here - keep it for the form
          setIsInVideoCall(false);
          setCurrentCallRoom(null);
          return; // Exit early to keep the appointment ID
        }
      } catch (error) {
        console.error("Error completing video appointment:", error);
        toast.error("Failed to complete appointment. Please try again.");
      }
    }

    // Only reset if we're not showing the form
    setIsInVideoCall(false);
    setCurrentCallRoom(null);
    setCurrentCallAppointmentId(null);
  };

  const handlePostConsultationComplete = (consultationNotes) => {
    setShowPostConsultationForm(false);
    setCurrentCallAppointmentId(null); // Reset the appointment ID after form completion
    toast.success("Consultation completed successfully!");
    navigate("/doctor-appointments");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-green-500" />;
      case "error":
        return <X className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    await fetchAppointments();
    if (socket && isConnected) {
      joinWaitingRoomsForConsultations();
    }
    setIsLoading(false);
  };

  const manuallyJoinWaitingRoom = async (roomId) => {
    if (socket) {
      console.log(`Manually joining waiting room: ${roomId}`);
      socket.emit("join-waiting-room", { roomId });
    } else {
      console.log("Socket not available for manual join");
    }
  };

  const testSocketConnection = async () => {
    console.log("Testing socket connection...");
    console.log("Socket instance:", socket);
    console.log("Socket connected:", socket?.connected);
    console.log("Is connected state:", isConnected);
    console.log("Backend URL:", backendUrl);
    console.log("Token available:", !!dToken);

    // Test if backend is reachable
    try {
      const response = await fetch(backendUrl);
      console.log("Backend reachable:", response.ok);
      if (!response.ok) {
        toast.error(`Backend not reachable: ${response.status}`);
        return;
      }
    } catch (error) {
      console.error("Backend not reachable:", error);
      toast.error("Backend server not reachable");
      return;
    }

    if (!socket) {
      toast.error("No socket instance available");
      return;
    }

    if (!socket.connected) {
      toast.error("Socket not connected");
      return;
    }

    toast.success("Socket connection test passed!");
  };

  const reconnectSocket = () => {
    console.log("Manually reconnecting socket...");
    if (socket) {
      socket.disconnect();
    }
    setTimeout(() => {
      initializeSocket();
      toast.info("Socket reconnection initiated");
    }, 1000);
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
            onClick={() => navigate("/doctor-dashboard")}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Doctor Waiting Room
              </h1>
              <p className="text-gray-600">
                Manage patients waiting for video consultations
              </p>
              <div className="mt-2 text-sm text-gray-500">
                <p>Video consultations: {getVideoConsultations().length}</p>
                <p>Socket connected: {isConnected ? "Yes" : "No"}</p>
                <p>Appointments loaded: {appointments.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 ${
                  isConnected ? "text-green-600" : "text-red-600"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm font-medium">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={testSocketConnection}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                title="Test Socket Connection"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={reconnectSocket}
                className="bg-yellow-600 text-white p-2 rounded-lg hover:bg-yellow-700 transition-colors"
                title="Reconnect Socket"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Debug section */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">
              Debug Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>Video Consultations:</strong>{" "}
                  {getVideoConsultations().length}
                </p>
                <p>
                  <strong>Waiting Rooms:</strong> {waitingRooms.length}
                </p>
                <p>
                  <strong>Notifications:</strong> {notifications.length}
                </p>
              </div>
              <div>
                <p>
                  <strong>Socket ID:</strong> {socket?.id || "Not connected"}
                </p>
                <p>
                  <strong>Doctor Token:</strong>{" "}
                  {dToken ? "Present" : "Missing"}
                </p>
                <p>
                  <strong>Backend URL:</strong> {backendUrl}
                </p>
                <p>
                  <strong>Show Form:</strong>{" "}
                  {showPostConsultationForm ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Current Appointment ID:</strong>{" "}
                  {currentCallAppointmentId || "None"}
                </p>
              </div>
            </div>

            {/* Test Form Button */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">
                Test Post-Consultation Form
              </h4>
              <button
                onClick={() => {
                  console.log("Test button clicked");
                  setShowPostConsultationForm(true);
                  setCurrentCallAppointmentId("test-appointment-id");
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Test Form
              </button>
            </div>

            {/* Manual join section */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">
                Manual Join Waiting Room
              </h4>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter room ID"
                  id="manualRoomId"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    const roomId =
                      document.getElementById("manualRoomId").value;
                    if (roomId) {
                      manuallyJoinWaitingRoom(roomId);
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Join
                </button>
              </div>

              {/* Manual refresh section */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-800 mb-2">
                  Manual Actions
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      console.log("Manual refresh triggered");
                      joinWaitingRoomsForConsultations();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Refresh Waiting Rooms
                  </button>
                  <button
                    onClick={() => {
                      console.log("Current waiting rooms:", waitingRooms);
                      console.log("Current appointments:", appointments);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Log State
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No notifications
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      <div className="flex items-start space-x-2">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Waiting Rooms List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Waiting Rooms ({waitingRooms.length})
              </h2>

              {waitingRooms.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No patients waiting</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Patients will appear here when they join waiting rooms for
                    your video consultations
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {waitingRooms.map((room) => (
                    <div
                      key={room.roomId}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedRoom?.roomId === room.roomId
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => joinWaitingRoom(room.roomId)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Room {room.roomId.slice(0, 8)}...
                          </h3>
                          <p className="text-sm text-gray-600">
                            {room.patients.length} patient(s) waiting
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {room.patients.length}
                          </span>
                          <Video className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Room Details */}
        {selectedRoom && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Room Details: {selectedRoom.roomId.slice(0, 8)}...
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patients List */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Patients
                </h3>
                <div className="space-y-3">
                  {selectedRoom.patients.map((patient) => (
                    <div
                      key={patient.userId}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-5 w-5 text-gray-600" />
                          <span className="font-medium">
                            {patient.isConsultationLink
                              ? "Patient (Link)"
                              : `Patient ${patient.userId.slice(0, 8)}...`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {patient.deviceTestCompleted && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                          {patient.ready && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Ready
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Joined: {formatTime(patient.joinedAt)}</p>
                        {patient.deviceTestResults && (
                          <div className="mt-2">
                            <p className="font-medium text-xs text-gray-700">
                              Device Test Results:
                            </p>
                            <div className="text-xs space-y-1">
                              <p>
                                Browser:{" "}
                                {patient.deviceTestResults.browser ? "✓" : "✗"}
                              </p>
                              <p>
                                Camera:{" "}
                                {patient.deviceTestResults.camera ? "✓" : "✗"}
                              </p>
                              <p>
                                Microphone:{" "}
                                {patient.deviceTestResults.microphone
                                  ? "✓"
                                  : "✗"}
                              </p>
                              <p>
                                Speakers:{" "}
                                {patient.deviceTestResults.speakers ? "✓" : "✗"}
                              </p>
                              <p>
                                Network:{" "}
                                {patient.deviceTestResults.network ? "✓" : "✗"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => startConsultation(patient.userId)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Start Consultation
                        </button>
                        <button
                          onClick={() => startVideoCall(selectedRoom.roomId)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Start Video Call
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-800">Chat</h3>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
                </div>

                {showChat && (
                  <div className="border border-gray-200 rounded-lg h-64 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-2 rounded-lg ${
                            message.userType === "doctor"
                              ? "bg-blue-100 ml-8"
                              : "bg-gray-100 mr-8"
                          }`}
                        >
                          <p className="text-sm text-gray-800">
                            {message.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t border-gray-200 p-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={sendMessage}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Call Component */}
      {isInVideoCall && currentCallRoom && (
        <VideoCall
          socket={socket}
          roomId={currentCallRoom}
          userType="doctor"
          onEndCall={endVideoCall}
        />
      )}

      {/* Post Consultation Form */}
      {showPostConsultationForm && currentCallAppointmentId && (
        <>
          {console.log(
            "Rendering PostConsultationForm with appointment ID:",
            currentCallAppointmentId
          )}
          <PostConsultationForm
            appointmentId={currentCallAppointmentId}
            onClose={() => {
              setShowPostConsultationForm(false);
              setCurrentCallAppointmentId(null);
            }}
            onComplete={handlePostConsultationComplete}
          />
        </>
      )}
    </div>
  );
};

export default DoctorWaitingRoom;
