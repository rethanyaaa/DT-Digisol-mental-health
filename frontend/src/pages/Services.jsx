 import React from 'react';
import { 
  FaComments, 
  FaClock, 
  FaClinicMedical, 
  FaUsers, 
  FaHeart, 
  FaLeaf,
  FaHandHoldingHeart,
  FaRegSmile,
  FaBrain,
  FaBalanceScale,
  FaChartLine
} from 'react-icons/fa';
import { motion } from "framer-motion";
import { GiMeditation, GiHealthNormal, GiSpellBook } from 'react-icons/gi';
import { RiMentalHealthLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import BookAppointmentCTA from '../components/BookAppointment';

const Services = () => {
  const navigate = useNavigate();
  const handleAssessmentClick = () => {
    if (!token) {
      navigate('/login?type=login');
    } else {
      navigate('/assessments');
    }
  };

  const services = [
    {
      icon: <FaComments />,
      title: "Talk Therapy & Counseling",
      description: "Personalized one-on-one sessions with licensed therapists to address emotional challenges, life transitions, and personal growth.",
      benefits: [
        "Evidence-based approaches (CBT, DBT, Psychodynamic)",
        "Confidential environment to explore feelings",
        "Personalized treatment plans",
        "Weekly or bi-weekly sessions"
      ],
      whoItsFor: "Ideal for individuals dealing with depression, life transitions, self-esteem issues, or those seeking personal development",
      color: '#7c3aed'
    },
    {
      icon: <FaClock />,
      title: "24/7 Online Therapy Support",
      description: "Immediate access to professional help through secure video, chat, or phone sessions whenever you need it.",
      benefits: [
        "No waiting lists or scheduling conflicts",
        "Therapy from the comfort of your home",
        "Emergency sessions available",
        "Same quality as in-person therapy"
      ],
      whoItsFor: "Perfect for busy professionals, students, parents, or anyone needing flexible access to mental health support",
      color: '#f59e0b'
    },
    {
      icon: <FaClinicMedical />,
      title: "Offline Counseling Centers",
      description: "Traditional face-to-face therapy in our calming, professionally designed centers across major cities.",
      benefits: [
        "Private, comfortable therapy rooms",
        "In-person connection with your therapist",
        "Access to therapeutic tools and resources",
        "Discreet locations for complete privacy"
      ],
      whoItsFor: "Those who prefer in-person interaction or need a dedicated space away from their daily environment",
      color: '#10b981'
    },
    {
      icon: <FaUsers />,
      title: "Group Therapy & Workshops",
      description: "Healing in community with others who share similar experiences, guided by expert facilitators.",
      benefits: [
        "Reduced cost compared to individual therapy",
        "Shared experiences and peer support",
        "Specialized groups (grief, addiction, parenting)",
        "Monthly workshops on mindfulness and coping skills"
      ],
      whoItsFor: "Individuals who benefit from community support or want to supplement their individual therapy",
      color: '#3b82f6'
    },
    {
      icon: <FaHeart />,
      title: "Couples & Relationship Counseling",
      description: "Expert guidance to improve communication, resolve conflicts, and strengthen emotional connections.",
      benefits: [
        "Pre-marital counseling available",
        "Conflict resolution strategies",
        "Intimacy and trust rebuilding",
        "Parenting partnership guidance"
      ],
      whoItsFor: "Couples at any stage - dating, engaged, married, or considering separation",
      color: '#ef4444'
    },
    {
      icon: <GiMeditation />,
      title: "Stress & Anxiety Management",
      description: "Proven techniques to reduce anxiety, manage stress, and cultivate emotional resilience.",
      benefits: [
        "Mindfulness and meditation training",
        "Breathing and relaxation techniques",
        "Cognitive restructuring methods",
        "Personalized stress reduction plans"
      ],
      whoItsFor: "Anyone experiencing work stress, panic attacks, social anxiety, or general overwhelm",
      color: '#8b5cf6'
    }
  ];

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
          <FaHeart className="text-pink-500 text-2xl mr-3" />
          <span className="text-purple-800 text-xl font-bold">Our Services</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Transformative <span className="text-purple-600">Mental Wellness</span> Services
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          At Mood Mantra, we offer a comprehensive range of evidence-based therapeutic services tailored to your unique needs. 
          Each program is designed by our expert clinicians to provide compassionate, effective care.
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center bg-purple-100/80 px-6 py-2 rounded-full mb-6"
          >
            <FaHandHoldingHeart className="text-red-500 text-2xl mr-3" />
            <span className="text-purple-800 text-2xl font-bold">Our Offerings</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Holistic Healing Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We combine clinical excellence with compassionate care to address your unique mental health needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="h-3" style={{ backgroundColor: service.color }}></div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div 
                    className="p-4 rounded-xl mr-4 flex-shrink-0"
                    style={{ backgroundColor: `${service.color}20` }}
                  >
                    {React.cloneElement(service.icon, { 
                      className: "w-6 h-6",
                      style: { color: service.color } 
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <div className="mb-6">
                  <h4 className="flex items-center text-sm font-semibold mb-3" style={{ color: service.color }}>
                    <FaChartLine className="mr-2" /> Key Benefits:
                  </h4>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start text-gray-600">
                        <span className="text-purple-500 mr-2">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="flex items-center text-sm font-semibold mb-2" style={{ color: service.color }}>
                    <FaUsers className="mr-2" /> Who It's For:
                  </h4>
                  <p className="text-gray-600">{service.whoItsFor}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Approach Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-20 bg-white rounded-3xl overflow-hidden shadow-xl"
        >
          <div className="md:flex">
            <div className="p-8 md:p-12 flex-1">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-purple-100 mr-4">
                  <FaBrain className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Our Unique Approach</h2>
              </div>
              <p className="text-gray-600 mb-6">
                At Mood Mantra, we don't believe in one-size-fits-all therapy. Our approach combines:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <strong className="text-gray-800">Evidence-Based Practices:</strong> Clinically proven therapies tailored to your needs
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <strong className="text-gray-800">Cultural Sensitivity:</strong> Therapists who understand Indian contexts and values
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <strong className="text-gray-800">Holistic Perspective:</strong> Addressing mind, body, and lifestyle factors
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <strong className="text-gray-800">Measurable Progress:</strong> Regular check-ins to track your improvement
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 md:p-12 flex-1">
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Initial Assessment",
                    description: "We begin with a comprehensive evaluation to understand your unique needs and goals."
                  },
                  {
                    step: 2,
                    title: "Personalized Matching",
                    description: "Our algorithm matches you with the ideal therapist based on your preferences and needs."
                  },
                  {
                    step: 3,
                    title: "Treatment Plan",
                    description: "Your therapist creates a customized roadmap for your healing journey."
                  },
                  {
                    step: 4,
                    title: "Ongoing Support",
                    description: "Regular sessions and check-ins to ensure continuous progress and adjustment."
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-start"
                  >
                    <div className="bg-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <div className="mt-20">
          <BookAppointmentCTA />
        </div>
      </div>
    </div>
  );
};

export default Services;