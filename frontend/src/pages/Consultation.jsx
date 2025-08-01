import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Video,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
} from "lucide-react";
import axios from "axios";

const Consultation = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [consultationData, setConsultationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateConsultation();
  }, [roomId, token]);

  const validateConsultation = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!roomId || !token) {
        setError("Invalid consultation link. Missing room ID or token.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/consultation/details/${roomId}?token=${token}`
      );

      if (response.data.success) {
        setConsultationData(response.data.data);
        setIsValid(true);
      } else {
        setError(response.data.message || "Invalid consultation link");
      }
    } catch (error) {
      console.error("Error validating consultation:", error);
      setError(
        error.response?.data?.message ||
          "Failed to validate consultation link. Please check your email for the correct link."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = () => {
    // Navigate to waiting room with token
    navigate(`/waiting-room/${roomId}?token=${token}`);
  };

  const handleDeviceTest = () => {
    // Navigate to device test page
    navigate(`/device-test?roomId=${roomId}&token=${token}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating consultation link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Consultation Link Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </button>
            <button
              onClick={() => (window.location.href = "/my-appointments")}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              View My Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isValid || !consultationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Invalid Consultation
          </h2>
          <p className="text-gray-600 mb-6">
            This consultation link is invalid or has expired.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const { consultation, appointment } = consultationData;

  // Format appointment date and time
  const appointmentDate = new Date(
    appointment.slotDate.split("/").reverse().join("-")
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Video Consultation Ready
            </h1>
            <p className="text-gray-600">
              Your consultation link is valid and ready to use
            </p>
          </div>
        </div>

        {/* Consultation Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Appointment Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Date
                </label>
                <p className="text-gray-800">{appointmentDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Time
                </label>
                <p className="text-gray-800">{appointment.slotTime}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Consultation Type
                </label>
                <p className="text-gray-800 flex items-center">
                  <Video className="h-4 w-4 mr-1" />
                  Video Consultation
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Room ID
                </label>
                <p className="text-gray-800 font-mono text-sm">{roomId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="text-gray-800 capitalize">
                  {consultation.status}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Expires
                </label>
                <p className="text-gray-800">
                  {new Date(consultation.expiresAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Get Started
          </h2>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Step 1: Test Your Devices (Recommended)
              </h3>
              <p className="text-blue-700 mb-3">
                Ensure your camera, microphone, and speakers are working
                properly before joining the consultation.
              </p>
              <button
                onClick={handleDeviceTest}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test Devices
              </button>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Step 2: Join Consultation
              </h3>
              <p className="text-green-700 mb-3">
                Enter the waiting room and wait for your doctor to join the
                consultation.
              </p>
              <button
                onClick={handleStartConsultation}
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
              >
                Join Consultation
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Important Notes
            </h3>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Make sure you have a stable internet connection</li>
              <li>• Allow camera and microphone permissions when prompted</li>
              <li>• Join a few minutes before your scheduled time</li>
              <li>• Have your medical information ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
