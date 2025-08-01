import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import consultationModel from "./models/consultationModel.js";
import appointmentModel from "./models/appointmentModel.js";
import userModel from "./models/userModel.js";
import doctorModel from "./models/doctorModel.js";

class SocketServer {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:5173", // Patient frontend
          "http://localhost:5174", // Admin/Doctor frontend
          "http://localhost:5175", // Patient frontend (alternative port)
          "http://localhost:5176", // Admin/Doctor frontend (alternative port)
          process.env.PATIENT_FRONTEND_URL,
          process.env.ADMIN_FRONTEND_URL,
        ].filter(Boolean), // Remove undefined values
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
      },
    });

    this.waitingRooms = new Map(); // roomId -> { patients: [], doctor: null, messages: [] }
    this.userSockets = new Map(); // userId -> socketId
    this.socketUsers = new Map(); // socketId -> { userId, userType, roomId }
    this.pendingNotifications = new Map(); // roomId -> [notifications] - Store notifications for doctors who haven't joined yet

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const consultationToken = socket.handshake.auth.consultationToken;
        const userType = socket.handshake.auth.userType;

        if (!token) {
          return next(new Error("Authentication error: No token provided"));
        }

        if (userType === "patient" && consultationToken) {
          // For patients with consultation token, validate the consultation
          try {
            const consultation = await consultationModel.findOne({
              token: consultationToken,
            });

            if (!consultation) {
              return next(
                new Error("Authentication error: Invalid consultation token")
              );
            }

            if (consultation.isExpired()) {
              return next(
                new Error("Authentication error: Consultation has expired")
              );
            }

            // Set consultation info on socket
            socket.consultationId = consultation._id;
            socket.appointmentId = consultation.appointmentId;
            socket.roomId = consultation.roomId;
            socket.userType = "patient";

            // For consultation links, we don't have a specific user ID
            // We'll use the consultation ID as a temporary identifier
            socket.userId = `consultation_${consultation._id}`;

            next();
          } catch (error) {
            return next(
              new Error("Authentication error: Failed to validate consultation")
            );
          }
        } else {
          // Regular JWT authentication for logged-in users
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log("Decoded token:", decoded);
          console.log("User type:", userType);

          // Handle different token structures for doctors vs patients
          if (userType === "doctor") {
            socket.userId = decoded.id || decoded.doctorId || decoded._id;
          } else {
            socket.userId = decoded.id || decoded.userId || decoded._id;
          }

          socket.userType = userType;
          console.log("Set socket userId:", socket.userId);
          next();
        }
      } catch (error) {
        next(new Error("Authentication error: Invalid token"));
      }
    });
  }

  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.userId} (${socket.userType})`);

      this.userSockets.set(socket.userId, socket.id);
      this.socketUsers.set(socket.id, {
        userId: socket.userId,
        userType: socket.userType,
        roomId: null,
      });

      // Join waiting room
      socket.on("join-waiting-room", async (data) => {
        await this.handleJoinWaitingRoom(socket, data);
      });

      // Leave waiting room
      socket.on("leave-waiting-room", async (data) => {
        await this.handleLeaveWaitingRoom(socket, data);
      });

      // Join consultation room (for chat)
      socket.on("join-consultation-room", async (data) => {
        await this.handleJoinConsultationRoom(socket, data);
      });

      // Leave consultation room (for chat)
      socket.on("leave-consultation-room", async (data) => {
        await this.handleLeaveConsultationRoom(socket, data);
      });

      // Doctor joins consultation
      socket.on("doctor-join-consultation", async (data) => {
        await this.handleDoctorJoinConsultation(socket, data);
      });

      // Start consultation
      socket.on("start-consultation", async (data) => {
        await this.handleStartConsultation(socket, data);
      });

      // Device test results
      socket.on("device-test-results", async (data) => {
        await this.handleDeviceTestResults(socket, data);
      });

      // Patient ready status
      socket.on("patient-ready", async (data) => {
        await this.handlePatientReady(socket, data);
      });

      // Send message in waiting room
      socket.on("waiting-room-message", async (data) => {
        await this.handleWaitingRoomMessage(socket, data);
      });

      // WebRTC Offer
      socket.on("webrtc-offer", async (data) => {
        try {
          const { roomId, offer, userType } = data;
          console.log(`WebRTC offer from ${userType} in room ${roomId}`);

          // Broadcast offer to other participants in the room
          socket.to(roomId).emit("webrtc-offer", {
            roomId,
            offer,
            userType,
          });
        } catch (error) {
          console.error("Error handling WebRTC offer:", error);
        }
      });

      // WebRTC Answer
      socket.on("webrtc-answer", async (data) => {
        try {
          const { roomId, answer, userType } = data;
          console.log(`WebRTC answer from ${userType} in room ${roomId}`);

          // Broadcast answer to other participants in the room
          socket.to(roomId).emit("webrtc-answer", {
            roomId,
            answer,
            userType,
          });
        } catch (error) {
          console.error("Error handling WebRTC answer:", error);
        }
      });

      // ICE Candidate
      socket.on("ice-candidate", async (data) => {
        try {
          const { roomId, candidate, userType } = data;
          console.log(`ICE candidate from ${userType} in room ${roomId}`);

          // Broadcast ICE candidate to other participants in the room
          socket.to(roomId).emit("ice-candidate", {
            roomId,
            candidate,
            userType,
          });
        } catch (error) {
          console.error("Error handling ICE candidate:", error);
        }
      });

      // Chat message
      socket.on("chat-message", async (data) => {
        try {
          const { roomId, message, sender, userType, timestamp } = data;
          console.log(
            `Chat message from ${userType} in room ${roomId}: ${message}`
          );
          console.log("Chat message data:", JSON.stringify(data, null, 2));

          // Broadcast message to other participants in the room
          socket.to(roomId).emit("chat-message", {
            roomId,
            message,
            sender,
            userType,
            timestamp,
          });
          console.log(`Broadcasted chat message to room ${roomId}`);
        } catch (error) {
          console.error("Error handling chat message:", error);
        }
      });

      // Typing start indicator
      socket.on("typing-start", async (data) => {
        try {
          const { roomId, userType } = data;
          console.log(`${userType} started typing in room ${roomId}`);
          console.log("Typing start data:", JSON.stringify(data, null, 2));

          // Broadcast typing start to other participants in the room
          socket.to(roomId).emit("typing-start", {
            roomId,
            userType,
          });
          console.log(`Broadcasted typing start to room ${roomId}`);
        } catch (error) {
          console.error("Error handling typing start:", error);
        }
      });

      // Typing stop indicator
      socket.on("typing-stop", async (data) => {
        try {
          const { roomId, userType } = data;
          console.log(`${userType} stopped typing in room ${roomId}`);
          console.log("Typing stop data:", JSON.stringify(data, null, 2));

          // Broadcast typing stop to other participants in the room
          socket.to(roomId).emit("typing-stop", {
            roomId,
            userType,
          });
          console.log(`Broadcasted typing stop to room ${roomId}`);
        } catch (error) {
          console.error("Error handling typing stop:", error);
        }
      });

      // Screen share started
      socket.on("screen-share-started", async (data) => {
        try {
          const { roomId, userType, isSharing } = data;
          console.log(`${userType} started screen sharing in room ${roomId}`);
          console.log(
            "Screen share started data:",
            JSON.stringify(data, null, 2)
          );

          // Broadcast screen share started to other participants in the room
          socket.to(roomId).emit("screen-share-started", {
            roomId,
            userType,
            isSharing,
          });
          console.log(`Broadcasted screen share started to room ${roomId}`);
        } catch (error) {
          console.error("Error handling screen share started:", error);
        }
      });

      // Screen share stopped
      socket.on("screen-share-stopped", async (data) => {
        try {
          const { roomId, userType, isSharing } = data;
          console.log(`${userType} stopped screen sharing in room ${roomId}`);
          console.log(
            "Screen share stopped data:",
            JSON.stringify(data, null, 2)
          );

          // Broadcast screen share stopped to other participants in the room
          socket.to(roomId).emit("screen-share-stopped", {
            roomId,
            userType,
            isSharing,
          });
          console.log(`Broadcasted screen share stopped to room ${roomId}`);
        } catch (error) {
          console.error("Error handling screen share stopped:", error);
        }
      });

      // Doctor starts video call
      socket.on("doctor-start-video-call", async (data) => {
        try {
          const { roomId, doctorId } = data;
          console.log(
            `Doctor ${doctorId} starting video call in room ${roomId}`
          );
          console.log(
            "Available waiting rooms:",
            Array.from(this.waitingRooms.keys())
          );

          // Get waiting room info
          const waitingRoom = this.waitingRooms.get(roomId);
          if (!waitingRoom) {
            console.error("Waiting room not found:", roomId);
            console.log(
              "Available rooms:",
              Array.from(this.waitingRooms.keys())
            );
            return;
          }

          console.log("Waiting room found:", waitingRoom);
          console.log("Patients in room:", waitingRoom.patients);

          // Notify all patients in the room that doctor wants to start video call
          waitingRoom.patients.forEach((patient) => {
            const patientSocketId = this.userSockets.get(patient.userId);
            console.log(
              `Looking for patient ${patient.userId}, socket ID: ${patientSocketId}`
            );
            if (patientSocketId) {
              this.io.to(patientSocketId).emit("doctor-wants-video-call", {
                roomId,
                doctorId,
              });
              console.log(
                `Notified patient ${patient.userId} about video call`
              );
            } else {
              console.warn(
                `Patient ${patient.userId} not found in userSockets`
              );
            }
          });
        } catch (error) {
          console.error("Error handling doctor-start-video-call:", error);
        }
      });

      // Doctor ends video call
      socket.on("doctor-end-video-call", async (data) => {
        try {
          const { roomId, doctorId } = data;
          console.log(
            `Doctor ${doctorId} ending video call in room ${roomId}`
          );

          // Get waiting room info
          const waitingRoom = this.waitingRooms.get(roomId);
          if (!waitingRoom) {
            console.error("Waiting room not found:", roomId);
            return;
          }

          // Notify all patients in the room that doctor ended the video call
          waitingRoom.patients.forEach((patient) => {
            const patientSocketId = this.userSockets.get(patient.userId);
            if (patientSocketId) {
              this.io.to(patientSocketId).emit("doctor-ended-video-call", {
                roomId,
                doctorId,
              });
              console.log(
                `Notified patient ${patient.userId} that doctor ended video call`
              );
            } else {
              console.warn(
                `Patient ${patient.userId} not found in userSockets`
              );
            }
          });
        } catch (error) {
          console.error("Error handling doctor-end-video-call:", error);
        }
      });

      // Disconnect handling
      socket.on("disconnect", async () => {
        await this.handleDisconnect(socket);
      });
    });
  }

  async handleJoinWaitingRoom(socket, data) {
    try {
      const { roomId, appointmentId } = data;
      console.log(
        `User ${socket.userId} (${socket.userType}) trying to join waiting room:`,
        { roomId, appointmentId }
      );

      // For consultation-based patients, use the consultation data
      let consultation, appointment;

      if (socket.consultationId) {
        // Patient joined via consultation link
        console.log(
          `Patient joining via consultation ID: ${socket.consultationId}`
        );
        consultation = await consultationModel.findById(socket.consultationId);
        if (!consultation) {
          socket.emit("error", { message: "Consultation not found" });
          return;
        }
        appointment = await appointmentModel.findById(
          consultation.appointmentId
        );
      } else {
        // Regular user with appointmentId (could be patient or doctor)
        console.log(`Looking for consultation with roomId: ${roomId}`);
        consultation = await consultationModel.findOne({ roomId });
        if (!consultation) {
          socket.emit("error", { message: "Consultation not found" });
          return;
        }

        // For doctors, use the consultation's appointmentId, for patients use the provided appointmentId
        const targetAppointmentId =
          socket.userType === "doctor"
            ? consultation.appointmentId
            : appointmentId;
        console.log(
          `Looking for appointment with ID: ${targetAppointmentId} (userType: ${socket.userType})`
        );
        appointment = await appointmentModel.findById(targetAppointmentId);
      }

      if (!appointment) {
        socket.emit("error", { message: "Appointment not found" });
        return;
      }

      console.log(
        `Found appointment: ${appointment._id} for doctor: ${appointment.docId}`
      );

      // Check if consultation is expired
      if (consultation.isExpired()) {
        socket.emit("error", { message: "Consultation has expired" });
        return;
      }

      // Join socket room
      socket.join(roomId);
      console.log(`User ${socket.userId} joined socket room: ${roomId}`);

      // Update user info
      const userInfo = this.socketUsers.get(socket.id);
      userInfo.roomId = roomId;
      this.socketUsers.set(socket.id, userInfo);

      // Initialize waiting room if it doesn't exist
      if (!this.waitingRooms.has(roomId)) {
        this.waitingRooms.set(roomId, {
          patients: [],
          doctor: null,
          messages: [],
        });
        console.log(`Created new waiting room: ${roomId}`);
      }

      const waitingRoom = this.waitingRooms.get(roomId);
      console.log(`Current waiting room state for ${roomId}:`, {
        patients: waitingRoom.patients.length,
        doctor: waitingRoom.doctor ? waitingRoom.doctor.userId : null,
      });

      if (socket.userType === "patient") {
        // Add patient to waiting room
        const patientInfo = {
          userId: socket.userId,
          socketId: socket.id,
          joinedAt: new Date(),
          ready: false,
          deviceTestCompleted: false,
          deviceTestResults: null,
          isConsultationLink: !!socket.consultationId, // Flag to identify consultation link patients
        };

        // Check if patient already exists
        const existingPatientIndex = waitingRoom.patients.findIndex(
          (p) => p.userId === socket.userId
        );
        if (existingPatientIndex >= 0) {
          waitingRoom.patients[existingPatientIndex] = patientInfo;
        } else {
          waitingRoom.patients.push(patientInfo);
        }

        console.log(
          `Patient ${socket.userId} added to waiting room ${roomId}. Total patients: ${waitingRoom.patients.length}`
        );

        // Create notification data
        const notificationData = {
          roomId,
          patient: patientInfo,
          appointment,
          timestamp: new Date(),
        };

        // Notify doctor if online, otherwise queue the notification
        if (waitingRoom.doctor) {
          console.log(
            `Notifying doctor ${waitingRoom.doctor.userId} about patient ${socket.userId} joining`
          );
          this.io
            .to(waitingRoom.doctor.socketId)
            .emit("patient-joined-waiting-room", notificationData);
        } else {
          console.log(
            `No doctor in waiting room ${roomId}, queuing notification`
          );
          // Queue notification for when doctor joins
          if (!this.pendingNotifications.has(roomId)) {
            this.pendingNotifications.set(roomId, []);
          }
          this.pendingNotifications.get(roomId).push(notificationData);
        }

        // Send waiting room info to patient
        socket.emit("waiting-room-joined", {
          roomId,
          appointment,
          waitingPatients: waitingRoom.patients.length,
          doctorOnline: !!waitingRoom.doctor,
          messages: waitingRoom.messages,
        });

        console.log(`Patient ${socket.userId} joined waiting room ${roomId}`);
      } else if (socket.userType === "doctor") {
        // Add doctor to waiting room
        waitingRoom.doctor = {
          userId: socket.userId,
          socketId: socket.id,
          joinedAt: new Date(),
        };

        console.log(
          `Doctor ${socket.userId} added to waiting room ${roomId}. Patients waiting: ${waitingRoom.patients.length}`
        );

        // Send all pending notifications to the doctor
        if (this.pendingNotifications.has(roomId)) {
          const pendingNotifications = this.pendingNotifications.get(roomId);
          console.log(
            `Sending ${pendingNotifications.length} pending notifications to doctor for room ${roomId}`
          );
          console.log(
            "Pending notifications:",
            JSON.stringify(pendingNotifications, null, 2)
          );

          pendingNotifications.forEach((notification) => {
            if (notification.type) {
              // Handle typed notifications (device test, ready status, etc.)
              switch (notification.type) {
                case "device-test-completed":
                  this.io
                    .to(waitingRoom.doctor.socketId)
                    .emit("patient-device-test-completed", notification.data);
                  break;
                case "ready-status-changed":
                  this.io
                    .to(waitingRoom.doctor.socketId)
                    .emit("patient-ready-status-changed", notification.data);
                  break;
                default:
                  console.log(
                    `Unknown notification type: ${notification.type}`
                  );
              }
            } else {
              // Handle patient join notifications (legacy format)
              this.io
                .to(waitingRoom.doctor.socketId)
                .emit("patient-joined-waiting-room", notification);
            }
          });

          // Clear pending notifications
          this.pendingNotifications.delete(roomId);
        }

        // Notify all patients that doctor joined
        this.io.to(roomId).emit("doctor-joined-waiting-room", {
          roomId,
          doctor: waitingRoom.doctor,
          waitingPatients: waitingRoom.patients,
        });

        console.log(`Doctor ${socket.userId} joined waiting room ${roomId}`);
      }
    } catch (error) {
      console.error("Error joining waiting room:", error);
      socket.emit("error", { message: "Failed to join waiting room" });
    }
  }

  async handleLeaveWaitingRoom(socket, data) {
    try {
      const { roomId } = data;
      const userInfo = this.socketUsers.get(socket.id);

      if (!userInfo || userInfo.roomId !== roomId) {
        return;
      }

      socket.leave(roomId);

      const waitingRoom = this.waitingRooms.get(roomId);
      if (!waitingRoom) {
        return;
      }

      if (socket.userType === "patient") {
        // Remove patient from waiting room
        waitingRoom.patients = waitingRoom.patients.filter(
          (p) => p.userId !== socket.userId
        );

        // Notify doctor
        if (waitingRoom.doctor) {
          this.io
            .to(waitingRoom.doctor.socketId)
            .emit("patient-left-waiting-room", {
              roomId,
              patientId: socket.userId,
              remainingPatients: waitingRoom.patients.length,
            });
        }
      } else if (socket.userType === "doctor") {
        // Remove doctor from waiting room
        waitingRoom.doctor = null;

        // Notify all patients
        this.io.to(roomId).emit("doctor-left-waiting-room", {
          roomId,
        });
      }

      // Clean up empty waiting rooms
      if (waitingRoom.patients.length === 0 && !waitingRoom.doctor) {
        this.waitingRooms.delete(roomId);
        // Also clean up any pending notifications for this room
        this.pendingNotifications.delete(roomId);
      }

      // Update user info
      userInfo.roomId = null;
      this.socketUsers.set(socket.id, userInfo);

      console.log(`User ${socket.userId} left waiting room ${roomId}`);
    } catch (error) {
      console.error("Error leaving waiting room:", error);
    }
  }

  async handleDoctorJoinConsultation(socket, data) {
    try {
      const { roomId, patientId } = data;
      const waitingRoom = this.waitingRooms.get(roomId);

      if (!waitingRoom) {
        socket.emit("error", { message: "Waiting room not found" });
        return;
      }

      // Find patient
      const patient = waitingRoom.patients.find((p) => p.userId === patientId);
      if (!patient) {
        socket.emit("error", { message: "Patient not found" });
        return;
      }

      // Notify patient that doctor is joining
      this.io.to(patient.socketId).emit("doctor-joining-consultation", {
        roomId,
        doctorId: socket.userId,
      });

      // Update consultation status
      await consultationModel.findOneAndUpdate(
        { roomId },
        {
          status: "active",
          "participants.doctor.joined": true,
          "participants.doctor.joinedAt": new Date(),
        }
      );

      console.log(
        `Doctor ${socket.userId} joining consultation with patient ${patientId}`
      );
    } catch (error) {
      console.error("Error doctor joining consultation:", error);
      socket.emit("error", { message: "Failed to join consultation" });
    }
  }

  async handleStartConsultation(socket, data) {
    try {
      const { roomId, patientId } = data;

      // Notify patient to start consultation
      const patientSocketId = this.userSockets.get(patientId);
      if (patientSocketId) {
        this.io.to(patientSocketId).emit("consultation-starting", {
          roomId,
          doctorId: socket.userId,
        });
      }

      console.log(`Consultation starting for room ${roomId}`);
    } catch (error) {
      console.error("Error starting consultation:", error);
      socket.emit("error", { message: "Failed to start consultation" });
    }
  }

  async handleDeviceTestResults(socket, data) {
    try {
      const { roomId, results } = data;
      const waitingRoom = this.waitingRooms.get(roomId);

      if (!waitingRoom) {
        return;
      }

      // Update patient's device test results
      const patient = waitingRoom.patients.find(
        (p) => p.userId === socket.userId
      );
      if (patient) {
        patient.deviceTestCompleted = true;
        patient.deviceTestResults = results;
        patient.ready = results.allTestsPassed;

        // Create notification data
        const notificationData = {
          roomId,
          patientId: socket.userId,
          results,
          ready: patient.ready,
          timestamp: new Date(),
        };

        // Notify doctor if online, otherwise queue the notification
        if (waitingRoom.doctor) {
          this.io
            .to(waitingRoom.doctor.socketId)
            .emit("patient-device-test-completed", notificationData);
        } else {
          console.log(
            `No doctor in waiting room ${roomId}, queuing device test notification`
          );
          // Queue notification for when doctor joins
          if (!this.pendingNotifications.has(roomId)) {
            this.pendingNotifications.set(roomId, []);
          }
          this.pendingNotifications.get(roomId).push({
            type: "device-test-completed",
            data: notificationData,
          });
        }
      }

      console.log(`Device test results received for patient ${socket.userId}`);
    } catch (error) {
      console.error("Error handling device test results:", error);
    }
  }

  async handlePatientReady(socket, data) {
    try {
      const { roomId, ready } = data;
      const waitingRoom = this.waitingRooms.get(roomId);

      if (!waitingRoom) {
        return;
      }

      // Update patient's ready status
      const patient = waitingRoom.patients.find(
        (p) => p.userId === socket.userId
      );
      if (patient) {
        patient.ready = ready;

        // Create notification data
        const notificationData = {
          roomId,
          patientId: socket.userId,
          ready,
          timestamp: new Date(),
        };

        // Notify doctor if online, otherwise queue the notification
        if (waitingRoom.doctor) {
          this.io
            .to(waitingRoom.doctor.socketId)
            .emit("patient-ready-status-changed", notificationData);
        } else {
          console.log(
            `No doctor in waiting room ${roomId}, queuing ready status notification`
          );
          // Queue notification for when doctor joins
          if (!this.pendingNotifications.has(roomId)) {
            this.pendingNotifications.set(roomId, []);
          }
          this.pendingNotifications.get(roomId).push({
            type: "ready-status-changed",
            data: notificationData,
          });
        }
      }

      console.log(`Patient ${socket.userId} ready status: ${ready}`);
    } catch (error) {
      console.error("Error handling patient ready status:", error);
    }
  }

  async handleWaitingRoomMessage(socket, data) {
    try {
      const { roomId, message } = data;
      const waitingRoom = this.waitingRooms.get(roomId);

      if (!waitingRoom) {
        return;
      }

      const userInfo = this.socketUsers.get(socket.id);
      const messageData = {
        id: Date.now().toString(),
        userId: socket.userId,
        userType: socket.userType,
        message,
        timestamp: new Date(),
      };

      // Store message
      waitingRoom.messages.push(messageData);

      // Broadcast to all users in the room
      this.io.to(roomId).emit("waiting-room-message", messageData);

      console.log(`Message sent in waiting room ${roomId}: ${message}`);
    } catch (error) {
      console.error("Error handling waiting room message:", error);
    }
  }

  async handleDisconnect(socket) {
    try {
      const userInfo = this.socketUsers.get(socket.id);
      if (!userInfo) {
        return;
      }

      // Leave waiting room if in one
      if (userInfo.roomId) {
        await this.handleLeaveWaitingRoom(socket, { roomId: userInfo.roomId });
      }

      // Clean up user mappings
      this.userSockets.delete(socket.userId);
      this.socketUsers.delete(socket.id);

      console.log(`User disconnected: ${socket.userId}`);
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  }

  // Get waiting room info
  getWaitingRoomInfo(roomId) {
    return this.waitingRooms.get(roomId);
  }

  // Get all waiting rooms for a doctor
  getDoctorWaitingRooms(doctorId) {
    const waitingRooms = [];
    for (const [roomId, room] of this.waitingRooms.entries()) {
      if (room.doctor && room.doctor.userId === doctorId) {
        waitingRooms.push({
          roomId,
          ...room,
        });
      }
    }
    return waitingRooms;
  }

  async handleJoinConsultationRoom(socket, data) {
    try {
      const { roomId } = data;
      console.log(
        `User ${socket.userId} (${socket.userType}) joining consultation room: ${roomId}`
      );

      // Join socket room
      socket.join(roomId);

      // Update user info
      const userInfo = this.socketUsers.get(socket.id);
      userInfo.roomId = roomId;
      this.socketUsers.set(socket.id, userInfo);

      // Notify other participants that user joined
      socket.to(roomId).emit("user-joined", {
        roomId,
        userType: socket.userType,
        userId: socket.userId,
        timestamp: new Date(),
      });

      console.log(`User ${socket.userId} joined consultation room ${roomId}`);
    } catch (error) {
      console.error("Error joining consultation room:", error);
      socket.emit("error", { message: "Failed to join consultation room" });
    }
  }

  async handleLeaveConsultationRoom(socket, data) {
    try {
      const { roomId } = data;
      const userInfo = this.socketUsers.get(socket.id);

      if (!userInfo || userInfo.roomId !== roomId) {
        return;
      }

      // Notify other participants that user left
      socket.to(roomId).emit("user-left", {
        roomId,
        userType: socket.userType,
        userId: socket.userId,
        timestamp: new Date(),
      });

      // Leave socket room
      socket.leave(roomId);

      // Update user info
      userInfo.roomId = null;
      this.socketUsers.set(socket.id, userInfo);

      console.log(`User ${socket.userId} left consultation room ${roomId}`);
    } catch (error) {
      console.error("Error leaving consultation room:", error);
    }
  }
}

export default SocketServer;
