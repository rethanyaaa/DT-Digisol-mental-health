import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Trash2,
  Save,
  User,
  Stethoscope,
  Pill,
  TestTube,
  X,
} from "lucide-react";
import { DoctorContext } from "../context/DoctorContext";
import { toast } from "react-toastify";

const PostConsultationForm = ({ appointmentId, onClose, onComplete }) => {
  const navigate = useNavigate();
  const {
    createConsultationNotes,
    getConsultationNotesByAppointment,
    updateConsultationNotes,
  } = useContext(DoctorContext);

  const [isLoading, setIsLoading] = useState(false);
  const [existingNotes, setExistingNotes] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form data state
  const [formData, setFormData] = useState({
    appointmentId: appointmentId,
    doctorId: "",
    patientId: "",

    // Patient Symptoms and History
    chiefComplaints: "",
    presentIllness: "",
    pastMedicalHistory: "",
    familyHistory: "",
    socialHistory: "",

    // Physical Examination
    vitalSigns: {
      bloodPressure: "",
      pulse: "",
      temperature: "",
      respiratoryRate: "",
      weight: "",
      height: "",
    },
    physicalExamination: "",

    // Diagnosis
    provisionalDiagnosis: "",
    differentialDiagnosis: [""],
    finalDiagnosis: "",

    // Treatment
    treatmentPlan: "",
    prescriptions: [],
    investigations: [],

    // Follow-up
    followUpRequired: false,
    followUpDate: "",
    followUpInstructions: "",

    // General Notes
    clinicalNotes: "",
    patientInstructions: "",
  });

  // Check for existing notes on component mount
  useEffect(() => {
    checkExistingNotes();
  }, [appointmentId]);

  const checkExistingNotes = async () => {
    try {
      const result = await getConsultationNotesByAppointment(appointmentId);
      if (result.success && result.data) {
        setExistingNotes(result.data);
        setFormData((prev) => ({
          ...prev,
          ...result.data,
          differentialDiagnosis: result.data.differentialDiagnosis || [""],
          prescriptions: result.data.prescriptions || [],
          investigations: result.data.investigations || [],
        }));
      }
    } catch (error) {
      console.error("Error checking existing notes:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.chiefComplaints.trim() !== "";
      case 2:
        return formData.provisionalDiagnosis.trim() !== "";
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      toast.error("Please fill in all required fields before proceeding.");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      // Get doctor ID from token
      const decodedToken = JSON.parse(
        atob(localStorage.getItem("dToken").split(".")[1])
      );
      const doctorId =
        decodedToken.id || decodedToken.doctorId || decodedToken._id;

      // Get appointment details to get patient ID
      const appointmentResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/doctor/appointments`,
        {
          headers: {
            dToken: localStorage.getItem("dToken"),
          },
        }
      );

      const appointmentData = await appointmentResponse.json();
      const appointment = appointmentData.appointments?.find(
        (apt) => apt._id === appointmentId
      );

      if (!appointment) {
        toast.error("Could not find appointment details");
        setIsLoading(false);
        return;
      }

      const submitData = {
        ...formData,
        doctorId,
        patientId: appointment.userId, // Add patient ID from appointment
        differentialDiagnosis: formData.differentialDiagnosis.filter(
          (d) => d.trim() !== ""
        ),
        prescriptions: formData.prescriptions.filter(
          (p) => p.medicineName.trim() !== ""
        ),
        investigations: formData.investigations.filter(
          (i) => i.testName.trim() !== ""
        ),
      };

      let result;
      if (existingNotes) {
        result = await updateConsultationNotes(existingNotes._id, submitData);
      } else {
        result = await createConsultationNotes(submitData);
      }

      if (result.success) {
        toast.success("Consultation notes saved successfully!");
        if (onComplete) {
          onComplete(result.data);
        }
        navigate("/doctor-appointments");
      } else {
        toast.error(result.message || "Failed to save consultation notes");
      }
    } catch (error) {
      console.error("Error saving consultation notes:", error);
      toast.error("An error occurred while saving the notes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Post-Consultation Form</h2>
              <p className="text-blue-100">
                Complete consultation notes and prescriptions
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Patient Symptoms & History
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chief Complaints *
                </label>
                <textarea
                  value={formData.chiefComplaints}
                  onChange={(e) =>
                    handleInputChange("chiefComplaints", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Describe the main symptoms and complaints..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provisional Diagnosis *
                </label>
                <textarea
                  value={formData.provisionalDiagnosis}
                  onChange={(e) =>
                    handleInputChange("provisionalDiagnosis", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Initial diagnosis based on symptoms..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment Plan
                </label>
                <textarea
                  value={formData.treatmentPlan}
                  onChange={(e) =>
                    handleInputChange("treatmentPlan", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Overall treatment approach and plan..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinical Notes
                </label>
                <textarea
                  value={formData.clinicalNotes}
                  onChange={(e) =>
                    handleInputChange("clinicalNotes", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Additional clinical observations and notes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Instructions
                </label>
                <textarea
                  value={formData.patientInstructions}
                  onChange={(e) =>
                    handleInputChange("patientInstructions", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Instructions for the patient..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save & Complete
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostConsultationForm;
