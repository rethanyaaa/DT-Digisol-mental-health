 import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { motion } from "framer-motion";
import { 
  FaUserMd, 
  FaStar, 
  FaCalendarAlt, 
  FaRupeeSign,
  FaHeart,
  FaGlobe,
  FaMobileAlt,
  FaShieldAlt,
  FaChartLine,
  FaHandsHelping,
  FaLeaf,
  FaBalanceScale,
  FaLightbulb
} from 'react-icons/fa';
import { GiMeditation, GiBrain, GiHealthNormal } from 'react-icons/gi';
import { RiTeamFill } from 'react-icons/ri';

const OurTeam = () => {
  const { doctors } = useContext(AppContext);

  // Stats data
  const stats = [
    { value: "5000+", label: "Patients Helped", icon: <FaHeart className="text-2xl" /> },
    { value: "100+", label: "Years Combined", icon: <FaCalendarAlt className="text-2xl" /> },
    { value: "98%", label: "Satisfaction Rate", icon: <FaStar className="text-2xl" /> },
    { value: "24/7", label: "Support Available", icon: <FaShieldAlt className="text-2xl" /> }
  ];

  return (
    <div className="min-h-screen px-6 md:px-12 py-12 bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4"
        >
          Meet Our Compassionate Healthcare Team
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-600 mb-8"
        >
          Our dedicated professionals bring together decades of experience, cutting-edge knowledge, 
          and a patient-centered approach to provide the best possible care for your mental health needs.
        </motion.p>
        
        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-indigo-600 mb-3 flex justify-center">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Our Approach Section */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">Our Therapeutic Approach</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <GiBrain className="text-indigo-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Evidence-Based Therapies</h3>
            <p className="text-gray-600">
              We utilize scientifically validated treatment methods tailored to each individual's needs.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserMd className="text-indigo-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Personalized Care</h3>
            <p className="text-gray-600">
              Every treatment plan is customized to address your unique circumstances and goals.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <GiHealthNormal className="text-indigo-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Holistic Healing</h3>
            <p className="text-gray-600">
              Addressing mind, body, and spirit for comprehensive mental wellness.
            </p>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-800 mb-2 text-center">Our Expert Practitioners</h2>
        <p className="text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Each of our professionals brings unique expertise and a shared commitment to your mental well-being.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  src={doctor.image}
                  alt={doctor.name}
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                  doctor.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {doctor.available ? 'Available' : 'Not Available'}
                </div>
              </div>
              
              {/* Doctor Info */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-indigo-600 font-medium">{doctor.speciality}</p>
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`${i < 4 ? 'text-yellow-500' : 'text-gray-300'} mr-1`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(120 reviews)</span>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {doctor.bio || `Specialized in ${doctor.speciality} with ${doctor.experience} years of experience helping patients achieve better mental health.`}
                  </p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FaRupeeSign className="text-gray-500 mr-1" />
                      <span className="font-bold text-indigo-700">
                        {doctor.fees} / session
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-indigo-600 rounded-2xl p-12 my-16 max-w-7xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="text-center mb-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto">
            These principles guide every interaction with our patients and team members.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              icon: <FaHandsHelping className="text-2xl" />,
              title: "Compassion",
              description: "Meeting every client with empathy and understanding"
            },
            {
              icon: <FaBalanceScale className="text-2xl" />,
              title: "Integrity",
              description: "Ethical practice in all our interactions"
            },
            {
              icon: <FaLightbulb className="text-2xl" />,
              title: "Innovation",
              description: "Continually evolving our therapeutic approaches"
            },
            {
              icon: <FaGlobe className="text-2xl" />,
              title: "Accessibility",
              description: "Breaking down barriers to mental healthcare"
            },
            {
              icon: <RiTeamFill className="text-2xl" />,
              title: "Collaboration",
              description: "Team-based care for comprehensive treatment"
            }
          ].map((value, index) => (
            <div 
              key={index} 
              className="bg-white bg-opacity-10 rounded-xl p-6 text-center text-white hover:bg-opacity-15 transition-all hover:-translate-y-1"
            >
              <div className="bg-white bg-opacity-15 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-indigo-100">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Healing Journey?</h2>
        <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
          Our team is here to support you every step of the way. Schedule your first consultation today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
            Book an Appointment
          </button>
          <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
            Meet Our Therapists
          </button>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;