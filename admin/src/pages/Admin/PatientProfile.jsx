import { AdminContext } from "@/context/AdminContext";
import { ArrowLeft, Mail, Calendar, User, Clock, Loader2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const PatientProfile = () => {
  const { patientId } = useParams();
  const { aToken, backendUrl } = useContext(AdminContext);
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/admin/patient/${patientId}`,
          { headers: { aToken } }
        );

        if (data.success) {
          setPatient(data.patient);
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (aToken && patientId) {
      fetchPatientDetails();
    }
  }, [aToken, patientId, backendUrl]);

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader2 className="size-14 animate-spin text-primary" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="m-2 w-full sm:w-[80vw] flex flex-col items-center justify-center pb-2 gap-4 sm:p-4 bg-gray-50 rounded">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Patient Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The patient you're looking for doesn't exist.
          </p>
          <Link
            to="/patients"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="m-2 w-full sm:w-[80vw] flex flex-col items-center sm:items-start justify-center pb-2 gap-4 sm:p-4 bg-gray-50 rounded">
      {/* Header */}
      <div className="w-full flex items-center gap-4">
        <Link
          to="/patients"
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Patients</span>
        </Link>
      </div>

      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl font-semibold px-1 tracking-wide text-primary select-none">
          Patient Profile
        </h1>
      </div>

      {/* Patient Information Card */}
      <div className="w-full bg-white border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img
              className="size-24 sm:size-32 aspect-square object-cover rounded-full bg-gray-700"
              src={patient.image}
              alt={`${patient.name} profile`}
            />
          </div>

          {/* Patient Details */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {patient.name}
            </h2>
            <p className="text-gray-500 mb-4">Patient ID: {patient._id}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Joined Date
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(patient.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="size-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Account Status
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="size-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Member Since
                  </p>
                  <p className="text-sm text-gray-600">
                    {Math.floor(
                      (Date.now() - new Date(patient.date).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment History */}
      <div className="w-full bg-white border rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Appointment History
        </h3>

        {patient.appointments && patient.appointments.length > 0 ? (
          <div className="space-y-4">
            {patient.appointments.map((appointment) => (
              <div key={appointment._id} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      className="size-12 aspect-square object-cover rounded-full bg-gray-700"
                      src={appointment.docId.image}
                      alt={`${appointment.docId.name} profile`}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {appointment.docId.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {appointment.docId.speciality}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.slotDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {appointment.cancelled ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Cancelled
                      </span>
                    ) : appointment.isCompleted ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Upcoming
                      </span>
                    )}

                    {appointment.payment && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No appointments found for this patient.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
