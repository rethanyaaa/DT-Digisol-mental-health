 import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCalendarAlt, FaUserMd, FaClipboardCheck } from 'react-icons/fa';
import { motion } from "framer-motion";
import BookAppointmentCTA from '../components/BookAppointment';

const Contact = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const handleAssessmentClick = () => {
    if (!token) {
      navigate('/login?type=login');
    } else {
      navigate('/assessments');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto text-center mb-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl p-8 sm:p-12 shadow-xl"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md mb-6"
        >
          <FaMapMarkerAlt className="text-purple-500 text-2xl mr-3" />
          <span className="text-purple-800 text-xl font-bold">We're Here For You</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Contact <span className="text-purple-600">Mood Mantra</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Reach out to our compassionate team - we're here to support your mental wellness journey every step of the way.
        </p>
      </motion.div>

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Left Column - Contact Form & Image */}
          <motion.div 
            className="lg:w-1/2 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Contact Form */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="h-3 bg-purple-600"></div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-purple-100 mr-4 flex-shrink-0">
                    <FaEnvelope className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Send Us a Message</h3>
                </div>
                
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                    <select 
                      id="subject" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="therapy">Therapy Inquiry</option>
                      <option value="appointment">Appointment Booking</option>
                      <option value="emergency">Emergency Support</option>
                      <option value="general">General Question</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                    <textarea 
                      id="message" 
                      rows="5" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md"
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Location Image */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-2xl shadow-lg"
            >
              <img
                className="w-full h-auto"
                src={assets.contact_image}
                alt="Supportive therapist talking to client"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">Our Healing Space</h3>
                  <p className="opacity-90">A welcoming environment designed for your comfort and peace</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Info */}
          <motion.div 
            className="lg:w-1/2 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Contact Info Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="h-3 bg-indigo-600"></div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-indigo-100 mr-4 flex-shrink-0">
                    <FaMapMarkerAlt className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Our Office</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  50709 Wilims Station, <br />
                  Suite 350, Washington, USA
                </p>
                
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>
                
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-purple-100 mr-4 flex-shrink-0">
                    <FaPhone className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Contact Details</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                      <FaPhone className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">General Inquiries</p>
                      <p className="text-gray-600">(415) 555-0132</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                      <FaEnvelope className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Email</p>
                      <p className="text-gray-600">support@moodmantra.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-red-100 p-3 rounded-lg mr-4">
                      <FaPhone className="text-red-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Emergency Support</p>
                      <p className="text-gray-600">(415) 555-0199</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hours Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="h-3 bg-amber-500"></div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-amber-100 mr-4 flex-shrink-0">
                    <FaClock className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Office Hours</h3>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Monday - Friday</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">9:00 AM - 7:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Saturday</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center py-3">
                    <span className="font-medium text-gray-700">Sunday</span>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">Closed</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Emergency Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Need Immediate Help?</h3>
              </div>
              <p className="mb-4 opacity-90">
                If you're in crisis or experiencing suicidal thoughts, please contact emergency services immediately.
              </p>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-purple-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-all shadow-md"
              >
                Emergency Contacts
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <div className="mt-20">
          <BookAppointmentCTA />
        </div>
      </div>
    </div>
  );
};

export default Contact;