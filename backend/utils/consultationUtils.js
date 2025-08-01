import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

// Generate unique consultation room ID
export const generateConsultationRoomId = () => {
  return uuidv4();
};

// Generate secure consultation token
export const generateConsultationToken = (appointmentId, roomId) => {
  const payload = `${appointmentId}:${roomId}:${Date.now()}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
};

// Create consultation link
export const createConsultationLink = (roomId, token, baseUrl) => {
  return `${baseUrl}/consultation/${roomId}?token=${token}`;
};

// Validate consultation token
export const validateConsultationToken = (token, appointmentId, roomId) => {
  // In a real implementation, you'd want to store and validate tokens
  // For now, we'll use a simple hash validation
  const expectedPayload = `${appointmentId}:${roomId}`;
  const expectedToken = crypto
    .createHash("sha256")
    .update(expectedPayload)
    .digest("hex");
  return token === expectedToken;
};

// Generate system requirements info
export const getSystemRequirements = () => {
  return {
    browser: {
      chrome: "Version 60 or higher",
      firefox: "Version 55 or higher",
      safari: "Version 11 or higher",
      edge: "Version 79 or higher",
    },
    network: "Stable internet connection (minimum 1 Mbps)",
    hardware: {
      camera: "HD camera (720p or higher recommended)",
      microphone: "Built-in or external microphone",
      speakers: "Built-in or external speakers/headphones",
    },
    permissions: "Camera and microphone access required",
  };
};

// Format system requirements for email
export const formatSystemRequirementsForEmail = () => {
  const requirements = getSystemRequirements();

  return `
System Requirements:

🌐 Browser Requirements:
• Chrome: ${requirements.browser.chrome}
• Firefox: ${requirements.browser.firefox}
• Safari: ${requirements.browser.safari}
• Edge: ${requirements.browser.edge}

📡 Network: ${requirements.network}

💻 Hardware Requirements:
• Camera: ${requirements.hardware.camera}
• Microphone: ${requirements.hardware.microphone}
• Speakers: ${requirements.hardware.speakers}

🔐 Permissions: ${requirements.permissions}
  `.trim();
};
