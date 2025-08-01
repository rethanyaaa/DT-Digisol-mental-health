import nodemailer from "nodemailer";
import { formatSystemRequirementsForEmail } from "../utils/consultationUtils.js";

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Generate consultation email HTML template
const generateConsultationEmailHTML = (consultationData) => {
  const {
    patientName,
    doctorName,
    appointmentDate,
    appointmentTime,
    consultationLink,
    testLink,
    roomId,
  } = consultationData;

  const systemRequirements = formatSystemRequirementsForEmail();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Consultation Details</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #4f46e5;
            margin: 0;
            font-size: 28px;
        }
        .appointment-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .consultation-link {
            background-color: #4f46e5;
            color: white;
            padding: 15px 25px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            margin: 15px 0;
            font-weight: bold;
            text-align: center;
        }
        .test-link {
            background-color: #10b981;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
            margin: 10px 0;
            font-weight: bold;
        }
        .requirements {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .requirements h3 {
            color: #856404;
            margin-top: 0;
        }
        .requirements pre {
            white-space: pre-wrap;
            font-family: inherit;
            margin: 0;
            color: #856404;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .room-id {
            background-color: #e9ecef;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            margin: 10px 0;
        }
        .warning {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎥 Video Consultation Details</h1>
            <p>Your video consultation is ready!</p>
        </div>

        <div class="appointment-details">
            <h3>📅 Appointment Information</h3>
            <p><strong>Patient:</strong> ${patientName}</p>
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Room ID:</strong> <span class="room-id">${roomId}</span></p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${consultationLink}" class="consultation-link">
                🚀 Join Video Consultation
            </a>
        </div>

        <div style="text-align: center; margin: 20px 0;">
            <a href="${testLink}" class="test-link">
                🧪 Test Audio/Video
            </a>
            <p style="font-size: 14px; color: #666; margin-top: 10px;">
                We recommend testing your devices before the consultation
            </p>
        </div>

        <div class="warning">
            <strong>⚠️ Important:</strong> Please join the consultation 5 minutes before your scheduled time to ensure everything is working properly.
        </div>

        <div class="requirements">
            <h3>💻 System Requirements</h3>
            <pre>${systemRequirements}</pre>
        </div>

        <div style="margin: 30px 0;">
            <h3>📋 Before Your Consultation</h3>
            <ul>
                <li>Test your camera and microphone using the test link above</li>
                <li>Ensure you have a stable internet connection</li>
                <li>Find a quiet, well-lit location</li>
                <li>Have your medical information ready</li>
                <li>Close other applications that might use your camera/microphone</li>
            </ul>
        </div>

        <div class="footer">
            <p>If you have any technical issues, please contact our support team.</p>
            <p>© 2024 Mental Health Dashboard. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;
};

// Generate consultation email text template
const generateConsultationEmailText = (consultationData) => {
  const {
    patientName,
    doctorName,
    appointmentDate,
    appointmentTime,
    consultationLink,
    testLink,
    roomId,
  } = consultationData;

  const systemRequirements = formatSystemRequirementsForEmail();

  return `
Video Consultation Details

Your video consultation is ready!

APPOINTMENT INFORMATION:
Patient: ${patientName}
Doctor: ${doctorName}
Date: ${appointmentDate}
Time: ${appointmentTime}
Room ID: ${roomId}

JOIN CONSULTATION:
${consultationLink}

TEST YOUR DEVICES:
${testLink}

SYSTEM REQUIREMENTS:
${systemRequirements}

BEFORE YOUR CONSULTATION:
• Test your camera and microphone using the test link above
• Ensure you have a stable internet connection
• Find a quiet, well-lit location
• Have your medical information ready
• Close other applications that might use your camera/microphone

IMPORTANT: Please join the consultation 5 minutes before your scheduled time to ensure everything is working properly.

If you have any technical issues, please contact our support team.

© 2024 Mental Health Dashboard. All rights reserved.
  `.trim();
};

// Send consultation email
export const sendConsultationEmail = async (consultationData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Mental Health Dashboard" <${process.env.SMTP_USER}>`,
      to: consultationData.patientEmail,
      subject: `Video Consultation Details - ${consultationData.appointmentDate}`,
      text: generateConsultationEmailText(consultationData),
      html: generateConsultationEmailHTML(consultationData),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Consultation email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending consultation email:", error);
    throw new Error("Failed to send consultation email");
  }
};

// Send reminder email
export const sendConsultationReminder = async (consultationData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Mental Health Dashboard" <${process.env.SMTP_USER}>`,
      to: consultationData.patientEmail,
      subject: `Reminder: Your video consultation starts in 30 minutes`,
      text: `Your video consultation with ${consultationData.doctorName} starts in 30 minutes. Please join using this link: ${consultationData.consultationLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reminder: Video Consultation</h2>
          <p>Your video consultation with <strong>${consultationData.doctorName}</strong> starts in 30 minutes.</p>
          <p><strong>Time:</strong> ${consultationData.appointmentTime}</p>
          <a href="${consultationData.consultationLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Join Consultation
          </a>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Reminder email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending reminder email:", error);
    throw new Error("Failed to send reminder email");
  }
};
