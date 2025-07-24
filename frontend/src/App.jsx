 import React, { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // Added useLocation
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Assessments from "./pages/Assessments";
import Assessment from "./pages/Assessment";
import MyAssessments from "./pages/MyAssessments";
import Footer from "./components/Footer";
import ScrollToTopFloatingButton from "./components/ScrollToTopFloatingButton";
import { ToastContainer } from "react-toastify";
import WelcomeLoader from "./components/WelcomeLoader";
import AssessmentDetailedResults from "./components/AssessmentDetailedResults";

// Lazy load components
const Doctors = lazy(() => import("./pages/Doctors"));

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const [showLoader, setShowLoader] = useState(true);

  const loaderComponent = (
    <div
      id="welcome-loader"
      className="fixed inset-0 z-50 transition-opacity duration-500 ease-in-out pointer-events-none"
      style={{
        opacity: showLoader ? 1 : 0,
        backgroundColor: "white",
      }}
    >
      <WelcomeLoader />
    </div>
  );

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, 5000);
  }, []);

  return (
    <>
      {showLoader && loaderComponent}
      <div  >
        <ToastContainer
          theme="light"
          className="scale-95  sm:scale-100 sm:mt-16"
        />
        <Navbar />
        <ScrollToTop /> {/* Add this component */}
        <ScrollToTopFloatingButton />
        <Suspense fallback={loaderComponent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:speciality" element={<Doctors />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/appointment/:docId" element={<Appointment />} />

            {/* Assessment routes */}
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/assessment/:id" element={<Assessment />} />
            <Route path="/my-assessments" element={<MyAssessments />} />
            <Route
              path="/assessment-results/:id"
              element={<AssessmentDetailedResults />}
            />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </>
  );
};

export default App;