import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );

  const [appointments, setAppointments] = useState([]);

  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments",
        {
          headers: { dToken },
        }
      );

      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const completeVideoAppointment = async (appointmentId, roomId) => {
    try {
      console.log("completeVideoAppointment called with:", {
        appointmentId,
        roomId,
      });

      // Get doctor ID from token or context
      const decodedToken = JSON.parse(atob(dToken.split(".")[1]));
      const docId =
        decodedToken.id || decodedToken.doctorId || decodedToken._id;

      console.log("Doctor ID:", docId);

      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-video-appointment",
        { docId, appointmentId, roomId },
        { headers: { dToken } }
      );

      console.log("API response:", data);

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.log("Error in completeVideoAppointment:", error);
      toast.error(error.message);
      return false;
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dToken },
      });

      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { dToken },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Consultation Notes Functions
  const createConsultationNotes = async (notesData) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/consultation-notes/create",
        notesData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        return { success: true, data: data.data };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const getConsultationNotesByAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.get(
        backendUrl + `/api/consultation-notes/appointment/${appointmentId}`,
        { headers: { dToken } }
      );

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  };

  const updateConsultationNotes = async (notesId, updateData) => {
    try {
      const { data } = await axios.put(
        backendUrl + `/api/consultation-notes/${notesId}`,
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        return { success: true, data: data.data };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    completeVideoAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    createConsultationNotes,
    getConsultationNotesByAppointment,
    updateConsultationNotes,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
