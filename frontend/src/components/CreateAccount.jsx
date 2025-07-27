 import React, { useContext } from 'react';
import { 
  FaLeaf, 
  FaHeart, 
  FaGlobe, 
  FaLanguage, 
  FaBalanceScale, 
  FaHandsHelping, 
  FaClock, 
  FaUserShield,
  FaArrowRight
} from 'react-icons/fa';
import { GiBrain, GiMeditation } from 'react-icons/gi';
import { MdOutlineSelfImprovement, MdFamilyRestroom, MdWork } from 'react-icons/md';
import { IoMdPeople } from 'react-icons/io';
import { RiMentalHealthLine, RiTeamLine } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function CreateAccount() {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  
  const handleAssessmentClick = () => {
    if (!token) {
      navigate('/login?type=login');
    } else {
      navigate('/assessments');
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: <FaLeaf className="text-emerald-500 text-2xl" />,
      title: "Personalized Care",
      content: "Every session is tailored to your unique needs and goals for maximum effectiveness.",
      bg: "bg-emerald-50"
    },
    {
      icon: <FaHeart className="text-pink-500 text-2xl" />,
      title: "Confidential Space",
      content: "A safe, non-judgmental place to express yourself freely with complete privacy.",
      bg: "bg-pink-50"
    },
    {
      icon: <FaLanguage className="text-blue-500 text-2xl" />,
      title: "Multilingual Support",
      content: "Therapy in multiple languages to ensure comfort for diverse clients.",
      bg: "bg-blue-50"
    },
    {
      icon: <FaGlobe className="text-indigo-500 text-2xl" />,
      title: "Global Reach",
      content: "Online counseling accessible from anywhere with flexible scheduling across timezones.",
      bg: "bg-indigo-50"
    },
    {
      icon: <FaBalanceScale className="text-amber-500 text-2xl" />,
      title: "Holistic Approach",
      content: "Blending modern psychology with mindfulness and wellness techniques.",
      bg: "bg-amber-50"
    },
    {
      icon: <FaHandsHelping className="text-teal-500 text-2xl" />,
      title: "Expert Therapists",
      content: "Licensed professionals with diverse specialties and years of experience.",
      bg: "bg-teal-50"
    },
    {
      icon: <FaClock className="text-sky-500 text-2xl" />,
      title: "Flexible Scheduling",
      content: "Book sessions at your convenience, including evenings and weekends.",
      bg: "bg-sky-50"
    },
    {
      icon: <FaUserShield className="text-red-500 text-2xl" />,
      title: "Secure Platform",
      content: "End-to-end encrypted video calls and HIPAA compliant data protection.",
      bg: "bg-red-50"
    }
  ];

  const benefits = [
    {
      icon: <GiBrain className="text-purple-600" />,
      text: "Individuals struggling with stress, anxiety, or depression"
    },
    {
      icon: <IoMdPeople className="text-purple-600" />,
      text: "Couples looking to improve communication and relationships"
    },
    {
      icon: <MdOutlineSelfImprovement className="text-purple-600" />,
      text: "Professionals facing burnout or career dilemmas"
    },
    {
      icon: <GiBrain className="text-purple-600" />,
      text: "Those experiencing grief, trauma, or emotional distress"
    },
    {
      icon: <MdFamilyRestroom className="text-purple-600" />,
      text: "Families navigating conflicts or parenting challenges"
    },
    {
      icon: <RiTeamLine className="text-purple-600" />,
      text: "Teams needing workplace mental health support"
    },
    {
      icon: <MdWork className="text-purple-600" />,
      text: "Students dealing with academic pressure"
    },
    {
      icon: <GiMeditation className="text-purple-600" />,
      text: "Anyone seeking personal growth and self-discovery"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-xl"
      >
        {/* Header */}
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center bg-purple-100 px-6 py-2 rounded-full mb-6"
          >
            <RiMentalHealthLine className="text-purple-600 text-2xl mr-3" />
            <span className="text-purple-800 text-xl font-bold">Why Choose Us</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Makes <span className="text-purple-600">Mood Mantra</span> Special?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine clinical excellence with compassionate care to create transformative mental health experiences.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={featureVariants}
              whileHover={{ y: -5 }}
              className={`${feature.bg} rounded-xl p-6 shadow-md hover:shadow-lg transition-all`}
            >
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.content}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Who Can Benefit Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-8 sm:p-10 mb-16"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center bg-white/80 px-6 py-2 rounded-full mb-4"
            >
              <GiBrain className="text-purple-600 text-2xl mr-3" />
              <span className="text-purple-800 text-xl font-bold">Who Can Benefit?</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              We Support <span className="text-purple-600">Diverse Needs</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our services are designed to help individuals from all walks of life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -3 }}
                className="bg-white/80 rounded-xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-2 rounded-lg bg-purple-100 mt-1">
                  {benefit.icon}
                </div>
                <p className="text-gray-700">{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            At Mood Mantra, we believe that mental health is a journey, not a destination. 
            <span className="block font-medium text-purple-600 mt-2 not-italic">
              Take the first step today towards healing and self-discovery.
            </span>
          </motion.p>

          <motion.button
            onClick={handleAssessmentClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center mx-auto"
          >
            Get Started Today
            <FaArrowRight className="ml-2" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CreateAccount;