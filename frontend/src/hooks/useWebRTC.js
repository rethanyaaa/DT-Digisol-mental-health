import { useState, useRef, useCallback, useEffect } from "react";
import {
  rtcConfiguration,
  mediaConstraints,
  progressiveConstraints,
} from "../utils/webrtcConfig";

export const useWebRTC = (socket, roomId, userType) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionState, setConnectionState] = useState("new");
  const [iceConnectionState, setIceConnectionState] = useState("new");
  const [signalingState, setSignalingState] = useState("stable");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Initialize peer connection
  const initializePeerConnection = useCallback(() => {
    try {
      const pc = new RTCPeerConnection(rtcConfiguration);

      // Set up event listeners
      pc.onconnectionstatechange = () => {
        setConnectionState(pc.connectionState);
        console.log("Connection state:", pc.connectionState);
      };

      pc.oniceconnectionstatechange = () => {
        setIceConnectionState(pc.iceConnectionState);
        console.log("ICE connection state:", pc.iceConnectionState);
      };

      pc.onsignalingstatechange = () => {
        setSignalingState(pc.signalingState);
        console.log("Signaling state:", pc.signalingState);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Sending ICE candidate");
          socket.emit("ice-candidate", {
            roomId,
            candidate: event.candidate,
            userType,
          });
        }
      };

      pc.ontrack = (event) => {
        console.log("Received remote stream");
        console.log("Remote stream event:", event);
        console.log("Remote streams array:", event.streams);
        console.log("Remote stream count:", event.streams.length);

        if (event.streams && event.streams.length > 0) {
          const remoteStream = event.streams[0];
          console.log(
            "Remote stream tracks:",
            remoteStream.getTracks().map((t) => ({
              kind: t.kind,
              enabled: t.enabled,
              readyState: t.readyState,
              settings: t.getSettings(),
            }))
          );

          setRemoteStream(remoteStream);

          if (remoteVideoRef.current) {
            console.log("Setting remote video srcObject");
            remoteVideoRef.current.srcObject = remoteStream;

            // Force video element to load and play
            remoteVideoRef.current.onloadedmetadata = () => {
              console.log("Remote video loaded metadata");
              remoteVideoRef.current.play().catch((err) => {
                console.error("Error playing remote video:", err);
              });
            };

            remoteVideoRef.current.oncanplay = () => {
              console.log("Remote video can play");
            };

            remoteVideoRef.current.onerror = (err) => {
              console.error("Remote video error:", err);
            };

            // Log video quality info
            const videoTrack = remoteStream.getVideoTracks()[0];
            if (videoTrack) {
              const settings = videoTrack.getSettings();
              console.log("Remote video settings:", settings);
              console.log(
                "Remote video capabilities:",
                videoTrack.getCapabilities()
              );
              console.log("Remote video track enabled:", videoTrack.enabled);
              console.log(
                "Remote video track readyState:",
                videoTrack.readyState
              );
            }
          } else {
            console.error(
              "remoteVideoRef.current is null - cannot set srcObject"
            );
          }
        } else {
          console.error("No streams in ontrack event");
        }
      };

      peerConnectionRef.current = pc;
      return pc;
    } catch (err) {
      console.error("Error creating peer connection:", err);
      setError("Failed to create peer connection");
      return null;
    }
  }, [socket, roomId, userType]);

  // Get user media with progressive fallback
  const getUserMedia = useCallback(async () => {
    let stream = null;
    let lastError = null;

    // Try each constraint level progressively
    for (let i = 0; i < progressiveConstraints.length; i++) {
      const constraints = progressiveConstraints[i];
      try {
        console.log(`Trying constraints level ${i}:`, constraints);
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log(`Successfully got stream with level ${i} constraints`);
        break;
      } catch (error) {
        console.warn(`Level ${i} constraints failed:`, error);
        lastError = error;
        continue;
      }
    }

    if (!stream) {
      console.error("All constraint levels failed:", lastError);
      setError("Failed to access camera/microphone. Please check permissions.");
      throw lastError;
    }

    console.log("User media stream obtained:", stream);
    console.log(
      "Stream tracks:",
      stream.getTracks().map((t) => ({
        kind: t.kind,
        enabled: t.enabled,
        settings: t.getSettings(),
        capabilities: t.getCapabilities(),
      }))
    );

    // Try to improve video quality if possible
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      const capabilities = videoTrack.getCapabilities();
      const settings = videoTrack.getSettings();
      console.log("Video track capabilities:", capabilities);
      console.log("Video track current settings:", settings);

      // Try to apply better settings if available
      if (
        capabilities.width &&
        capabilities.width.values &&
        capabilities.height &&
        capabilities.height.values
      ) {
        const maxWidth = Math.max(...capabilities.width.values);
        const maxHeight = Math.max(...capabilities.height.values);
        const maxFrameRate =
          capabilities.frameRate && capabilities.frameRate.values
            ? Math.max(...capabilities.frameRate.values)
            : 30;

        // Only try to improve if current settings are lower
        const currentWidth = settings.width || 0;
        const currentHeight = settings.height || 0;
        const currentFrameRate = settings.frameRate || 0;

        if (
          maxWidth > currentWidth ||
          maxHeight > currentHeight ||
          maxFrameRate > currentFrameRate
        ) {
          try {
            await videoTrack.applyConstraints({
              width: { ideal: maxWidth },
              height: { ideal: maxHeight },
              frameRate: { ideal: maxFrameRate },
            });
            console.log("Improved video quality settings:", {
              maxWidth,
              maxHeight,
              maxFrameRate,
            });
          } catch (applyError) {
            console.warn("Could not improve video quality:", applyError);
          }
        }
      }
    }

    setLocalStream(stream);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      console.log("Set local video srcObject");
    } else {
      console.warn("localVideoRef.current is null");
    }

    // Add tracks to peer connection
    if (peerConnectionRef.current) {
      stream.getTracks().forEach((track) => {
        console.log(`Adding ${track.kind} track to peer connection:`, {
          enabled: track.enabled,
          readyState: track.readyState,
          settings: track.getSettings(),
        });
        peerConnectionRef.current.addTrack(track, stream);
        console.log("Added track to peer connection:", track.kind);
      });

      // Verify tracks were added
      const senders = peerConnectionRef.current.getSenders();
      console.log(
        "Peer connection senders:",
        senders.map((sender) => ({
          track: sender.track
            ? {
                kind: sender.track.kind,
                enabled: sender.track.enabled,
                readyState: sender.track.readyState,
              }
            : null,
          dtmfSender: !!sender.dtmfSender,
        }))
      );
    } else {
      console.warn("peerConnectionRef.current is null");
    }

    return stream;
  }, []);

  // Create and send offer (for patient)
  const createOffer = useCallback(async () => {
    if (!peerConnectionRef.current) return;

    try {
      setIsConnecting(true);
      setError(null);

      console.log("Creating offer for userType:", userType);
      console.log(
        "Peer connection state:",
        peerConnectionRef.current.connectionState
      );
      console.log(
        "Local stream tracks:",
        localStream
          ?.getTracks()
          .map((t) => ({ kind: t.kind, enabled: t.enabled }))
      );

      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      console.log("Raw offer SDP:", offer.sdp);

      // Add aggressive bandwidth constraints to SDP for maximum quality
      offer.sdp = offer.sdp.replace(/a=mid:0\r\n/g, "a=mid:0\r\nb=AS:5000\r\n");
      offer.sdp = offer.sdp.replace(/a=mid:1\r\n/g, "a=mid:1\r\nb=AS:128\r\n");

      // Force high quality codec preferences
      offer.sdp = offer.sdp.replace(
        /a=rtpmap:(\d+) H264\/\d+/g,
        "a=rtpmap:$1 H264/90000\r\na=fmtp:$1 profile-level-id=42e01f;level-asymmetry-allowed=1;packetization-mode=1"
      );

      // Add quality optimization parameters
      offer.sdp = offer.sdp.replace(
        /(m=video \d+ RTP\/SAVPF)/g,
        "$1\r\na=content:main\r\na=quality:10"
      );

      console.log("Modified offer SDP:", offer.sdp);

      await peerConnectionRef.current.setLocalDescription(offer);

      console.log("Sending offer with bandwidth constraints");
      socket.emit("webrtc-offer", {
        roomId,
        offer,
        userType,
      });
    } catch (err) {
      console.error("Error creating offer:", err);
      setError("Failed to create offer");
    }
  }, [socket, roomId, userType, localStream]);

  // Create and send answer (for doctor)
  const createAnswer = useCallback(
    async (offer) => {
      if (!peerConnectionRef.current) return;

      try {
        setIsConnecting(true);
        setError(null);

        console.log("Creating answer for userType:", userType);
        console.log("Received offer:", offer);
        console.log(
          "Peer connection state:",
          peerConnectionRef.current.connectionState
        );
        console.log(
          "Local stream tracks:",
          localStream
            ?.getTracks()
            .map((t) => ({ kind: t.kind, enabled: t.enabled }))
        );

        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );

        console.log("Remote description set successfully");

        const answer = await peerConnectionRef.current.createAnswer();
        console.log("Raw answer SDP:", answer.sdp);

        await peerConnectionRef.current.setLocalDescription(answer);
        console.log("Local description set successfully");

        console.log("Sending answer");
        socket.emit("webrtc-answer", {
          roomId,
          answer,
          userType,
        });
      } catch (err) {
        console.error("Error creating answer:", err);
        setError("Failed to create answer");
      }
    },
    [socket, roomId, userType, localStream]
  );

  // Handle incoming offer
  const handleOffer = useCallback(
    async (offer) => {
      if (!peerConnectionRef.current) return;

      try {
        console.log("Handling incoming offer for userType:", userType);
        console.log("Offer received:", offer);
        console.log(
          "Current peer connection state:",
          peerConnectionRef.current.connectionState
        );

        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        console.log("Remote description set from offer");

        await createAnswer(offer);
      } catch (err) {
        console.error("Error handling offer:", err);
        setError("Failed to handle offer");
      }
    },
    [createAnswer, userType]
  );

  // Handle incoming answer
  const handleAnswer = useCallback(
    async (answer) => {
      if (!peerConnectionRef.current) return;

      try {
        console.log("Handling incoming answer for userType:", userType);
        console.log("Answer received:", answer);
        console.log(
          "Current peer connection state:",
          peerConnectionRef.current.connectionState
        );

        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        console.log("Remote description set from answer");
      } catch (err) {
        console.error("Error handling answer:", err);
        setError("Failed to handle answer");
      }
    },
    [userType]
  );

  // Handle ICE candidate
  const handleIceCandidate = useCallback(async (candidate) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (err) {
      console.error("Error adding ICE candidate:", err);
    }
  }, []);

  // Initialize WebRTC connection
  const initializeConnection = useCallback(async () => {
    try {
      // Prevent multiple initializations
      if (peerConnectionRef.current) {
        console.log("Peer connection already exists, skipping initialization");
        return;
      }

      setError(null);

      // Initialize peer connection
      const pc = initializePeerConnection();
      if (!pc) return;

      // Get user media
      await getUserMedia();

      // If patient, create offer
      if (userType === "patient") {
        await createOffer();
      }
    } catch (err) {
      console.error("Error initializing connection:", err);
      setError("Failed to initialize connection");
    }
  }, [initializePeerConnection, getUserMedia, createOffer, userType]);

  // Cleanup
  const cleanup = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setRemoteStream(null);
    setConnectionState("new");
    setIceConnectionState("new");
    setSignalingState("stable");
    setIsConnecting(false);
    setError(null);
  }, [localStream]);

  // Monitor remote stream changes
  useEffect(() => {
    if (remoteStream) {
      console.log("Remote stream state changed:", {
        id: remoteStream.id,
        active: remoteStream.active,
        tracks: remoteStream.getTracks().map((t) => ({
          kind: t.kind,
          enabled: t.enabled,
          readyState: t.readyState,
          muted: t.muted,
        })),
      });
    } else {
      console.log("Remote stream is null");
    }
  }, [remoteStream]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleWebRTCOffer = (data) => {
      console.log("Received offer from:", data.userType);
      handleOffer(data.offer);
    };

    const handleWebRTCAnswer = (data) => {
      console.log("Received answer from:", data.userType);
      handleAnswer(data.answer);
    };

    const handleIceCandidateEvent = (data) => {
      console.log("Received ICE candidate from:", data.userType);
      handleIceCandidate(data.candidate);
    };

    socket.on("webrtc-offer", handleWebRTCOffer);
    socket.on("webrtc-answer", handleWebRTCAnswer);
    socket.on("ice-candidate", handleIceCandidateEvent);

    return () => {
      socket.off("webrtc-offer", handleWebRTCOffer);
      socket.off("webrtc-answer", handleWebRTCAnswer);
      socket.off("ice-candidate", handleIceCandidateEvent);
    };
  }, [socket, handleOffer, handleAnswer, handleIceCandidate]);

  return {
    localStream,
    remoteStream,
    connectionState,
    iceConnectionState,
    signalingState,
    isConnecting,
    error,
    localVideoRef,
    remoteVideoRef,
    initializeConnection,
    cleanup,
    createOffer,
    createAnswer,
  };
};
