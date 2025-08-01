import { AdminContext } from "@/context/AdminContext";
import { DoctorContext } from "@/context/DoctorContext";
import {
  CheckCheck,
  LayoutDashboard,
  List,
  Menu,
  SquarePlus,
  X,
  Users,
  FileText,
} from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken, backendUrl } = useContext(DoctorContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [waitingPatientsCount, setWaitingPatientsCount] = useState(0);
  const sidebarRef = useRef(null);

  // Fetch waiting patients count for doctor
  const fetchWaitingPatientsCount = async () => {
    if (!dToken) return;

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        {
          headers: { dToken },
        }
      );

      if (data.success) {
        const videoConsultations = data.appointments.filter(
          (appointment) =>
            appointment.consultationType === "video" &&
            appointment.payment &&
            !appointment.cancelled &&
            !appointment.isCompleted
        );

        // For now, we'll show the count of video consultations
        // In a real implementation, you'd want to check actual waiting room status
        setWaitingPatientsCount(videoConsultations.length);
      }
    } catch (error) {
      console.error("Error fetching waiting patients count:", error);
    }
  };

  // Handle clicks outside sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (window.innerWidth < 768) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch waiting patients count when doctor token changes
  useEffect(() => {
    if (dToken) {
      fetchWaitingPatientsCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchWaitingPatientsCount, 30000);
      return () => clearInterval(interval);
    }
  }, [dToken]);

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* mobile menu toggle button */}
      <button
        onClick={toggleMenu}
        className="pl-1 pr-1.5 py-1 rounded-r bg-primary text-white sm:hidden fixed z-50 mt-4"
      >
        {!isMenuOpen ? <Menu size={24} /> : <X size={24} />}
      </button>

      {/* overlay on mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 sm:hidden z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* main side bar */}
      <div
        ref={sidebarRef}
        className={`min-h-fit sm:min-h-screen bg-white rounded-r-md sm:rounded-none sm:border-r md:block fixed md:static min-w-64 z-40 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        {/* admin panel sidebar */}
        {aToken && (
          <ul className="mt-16 sm:mt-2">
            <NavLink
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center select-none bg-gray-50 gap-3 py-3.5 px-3 md:px-6 m-2 rounded-[5px] md:min-w-64 cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-100"
                }`
              }
              to={"/admin-dashboard"}
            >
              <LayoutDashboard size={18} />
              <p>Dashboard</p>
            </NavLink>
            <NavLink
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center select-none bg-gray-50 gap-3 py-3.5 px-3 md:px-6 m-2 rounded-[5px] md:min-w-64 cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-100"
                }`
              }
              to={"/all-appointments"}
            >
              <CheckCheck size={18} />
              <p>Appointments</p>
            </NavLink>
            <NavLink
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center select-none bg-gray-50 gap-3 py-3.5 px-3 md:px-6 m-2 rounded-[5px] md:min-w-64 cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-100"
                }`
              }
              to={"/doctor-list"}
            >
              <List size={18} />
              <p>Doctors List</p>
            </NavLink>
            <NavLink
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center select-none bg-gray-50 gap-3 py-3.5 px-3 md:px-6 m-2 rounded-[5px] md:min-w-64 cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-100"
                }`
              }
              to={"/add-doctor"}
            >
              <SquarePlus size={18} />
              <p>Add Doctor</p>
            </NavLink>
            <NavLink
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center select-none bg-gray-50 gap-3 py-3.5 px-3 md:px-6 m-2 rounded-[5px] md:min-w-64 cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-100"
                }`
              }
              to={"/patients"}
            >
              <Users size={18} />
              <p>Patients</p>
            </NavLink>
          </ul>
        )}
        {/* doctor panel sidebar */}
        {dToken && (
          <ul className="mt-16 sm:mt-2">
            <NavLink
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center select-none bg-gray-50 gap-3 py-3.5 px-3 md:px-6 m-2 rounded-[5px] md:min-w-64 cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-100"
                }`
              }
              to={"/doctor-dashboard"}
            >
              <LayoutDashboard size={18} />
              <p>Dashboard</p>
            </NavLink>
            <NavLink
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center select-none bg-gray-50 gap-3 py-3.5 px-3 md:px-6 m-2 rounded-[5px] md:min-w-64 cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-100"
                }`
              }
              to={"/doctor-appointments"}
            >
              <CheckCheck size={18} />
              <p>Appointments</p>
            </NavLink>
            <NavLink
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center select-none bg-gray-50 gap-3 py-3.5 px-3 md:px-6 m-2 rounded-[5px] md:min-w-64 cursor-pointer transition-all duration-200 ease-in-out relative ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-100"
                }`
              }
              to={"/doctor-waiting-room"}
            >
              <Users size={18} />
              <p>Waiting Room</p>
              {waitingPatientsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {waitingPatientsCount > 9 ? "9+" : waitingPatientsCount}
                </span>
              )}
            </NavLink>
            <NavLink
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center select-none bg-gray-50 gap-3 py-3.5 px-3 md:px-6 m-2 rounded-[5px] md:min-w-64 cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-100"
                }`
              }
              to={"/consultation-notes"}
            >
              <FileText size={18} />
              <p>Consultation Notes</p>
            </NavLink>
            <NavLink
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center select-none bg-gray-50 gap-3 py-3.5 px-3 md:px-6 m-2 rounded-[5px] md:min-w-64 cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-100"
                }`
              }
              to={"/doctor-profile"}
            >
              <List size={18} />
              <p>Profile</p>
            </NavLink>
          </ul>
        )}
      </div>
    </>
  );
};

export default Sidebar;
