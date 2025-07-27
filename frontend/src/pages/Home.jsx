import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import zentraImg from "../assets/girl.png";
import BookAppointmentCTA from "../components/BookAppointment";
import CreateAccountBenefits from "../components/CreateAccount";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonial";
import WelcomeMessage from "../components/WelcomeMessage";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaUsers,
  FaClock,
  FaChartLine,
  FaRegSmile,
  FaHandHoldingHeart,
} from "react-icons/fa";

const Home = () => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const handleAssessmentClick = () => {
    if (!token) {
      navigate("/login?type=login");
    } else {
      navigate("/doctors");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-17">
          <div className="relative z-10 flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 mb-12 md:mb-0"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md mb-6"
              >
                <FaHeart className="text-pink-500 text-2xl mr-3" />
                <span className="text-purple-800 text-xl font-bold">
                  Mental Wellness
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome to <span className="text-purple-600">Mood Mantra</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Your journey to mental wellness begins here. Personalized care,
                professional support, and a community that understands.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAssessmentClick}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg shadow-purple-200 transition-all"
                >
                  Book Your Appointment
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/services")}
                  className="bg-white hover:bg-gray-50 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg shadow-purple-100 border border-purple-100 transition-all"
                >
                  Learn More
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-6"
              >
                {[
                  { number: "500+", label: "Happy Clients" },
                  { number: "98%", label: "Satisfaction Rate" },
                  { number: "24/7", label: "Support Available" },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-lg mr-3">
                      <FaRegSmile className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.number}
                      </div>
                      <div className="text-gray-600 text-sm">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 relative"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-10 -left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                ></motion.div>
                <motion.div
                  animate={{
                    y: [0, 15, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                ></motion.div>

                <motion.img
                  src={zentraImg}
                  alt="Mental Health Illustration"
                  className="relative z-10 w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                  animate={{
                    y: ["0%", "-7%", "0%"], // Moves up and down
                  }}
                  transition={{
                    duration: 9, // Slower animation (4 seconds per cycle)
                    ease: "easeInOut", // Smooth acceleration/deceleration
                    repeat: Infinity, // Loop forever
                    repeatType: "reverse", // Go back and forth
                  }}
                  whileHover={{
                    scale: 1.05, // Slightly enlarge on hover
                    transition: { duration: 0.3 }, // Quick scale transition
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-20"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill="currentColor"
              className="text-purple-50"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              fill="currentColor"
              className="text-purple-50"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill="currentColor"
              className="text-purple-50"
            ></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <WelcomeMessage />

        <CreateAccountBenefits />
        <BookAppointmentCTA />
        <Testimonials />
      </div>

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-16 h-16 bg-purple-600 text-white rounded-full shadow-xl flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleAssessmentClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </motion.button>
    </div>
  );
};

export default Home;
