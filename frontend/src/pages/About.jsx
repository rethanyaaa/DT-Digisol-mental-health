 import React from 'react';
import { 
  FaGlobe, 
  FaUsers,
  FaMobileAlt,
  FaShieldAlt,
  FaHeart,
  FaChartLine,
  FaHandsHelping,
  FaLeaf,
  FaBalanceScale,
  FaLightbulb
} from 'react-icons/fa';
import { GiMeditation, GiBrain, GiHealthNormal } from 'react-icons/gi';
import { RiTeamFill } from 'react-icons/ri';
import { motion } from "framer-motion";
import BookAppointmentCTA from '../components/BookAppointment';

const About = () => {
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
          <span className="text-purple-800 text-xl font-bold">About Mood Mantra</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Healing Minds, <span className="text-purple-600">Transforming Lives</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Mood Mantra is India's most compassionate mental wellness platform, making professional therapy 
          accessible, affordable, and stigma-free for everyone. We believe in holistic healing that 
          nurtures mind, body, and soul.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Our Story */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:flex gap-8 mb-16 items-center"
        >
          <div className="flex-1 mb-8 md:mb-0">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-purple-100 mr-4">
                <GiBrain className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Journey</h2>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Founded in 2020 by psychologist Dr. Priya Sharma and tech entrepreneur Rohan Mehta, 
              Mood Mantra began as a small counseling center in Bangalore. After witnessing the 
              devastating impact of untreated mental health issues in our communities, we set out 
              to create a solution that would break down barriers to care.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Today, we've grown into a national movement with over 200 certified therapists, 
              serving more than 75,000 clients across India. Our name "Mood Mantra" reflects 
              our philosophy - that daily mental health practices (mantras) can transform 
              emotional well-being (mood).
            </p>
            <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500">
              <p className="text-purple-700 italic font-medium mb-2">
                "Mental health is not a destination, but a journey of daily practice and self-compassion."
              </p>
              <p className="text-gray-600">- Dr. Priya Sharma, Co-Founder</p>
            </div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex-1 bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "75K+", label: "Lives Impacted", color: "bg-purple-100 text-purple-700" },
                { value: "200+", label: "Certified Therapists", color: "bg-indigo-100 text-indigo-700" },
                { value: "12", label: "Regional Languages", color: "bg-blue-100 text-blue-700" },
                { value: "96%", label: "Client Satisfaction", color: "bg-green-100 text-green-700" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl text-center ${stat.color}`}
                >
                  <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Mission and Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-amber-500"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-amber-100 mr-4">
                <FaChartLine className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              To democratize mental healthcare by removing barriers of cost, convenience, and stigma through:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Affordable therapy at 60% lower cost than traditional clinics",
                "Culturally sensitive care in regional languages",
                "Preventive mental health education programs",
                "Corporate partnerships for employee wellness"
              ].map((item, index) => (
                <li key={index} className="flex items-start text-gray-600">
                  <span className="text-amber-500 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <p className="text-amber-800 italic">
                "Our goal is to make quality mental healthcare as accessible as a cup of chai."
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-emerald-500"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-emerald-100 mr-4">
                <FaGlobe className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We envision an India where mental wellness is prioritized and accessible to all:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Where mental health checkups are as routine as physical exams",
                "Where therapy is covered by insurance providers",
                "Where workplaces prioritize psychological safety",
                "Where no one suffers in silence due to stigma"
              ].map((item, index) => (
                <li key={index} className="flex items-start text-gray-600">
                  <span className="text-emerald-500 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <p className="text-emerald-800 italic">
                "We dream of an India where asking for help is seen as strength, not weakness."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Our Approach */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-purple-100 px-6 py-2 rounded-full mb-6"
          >
            <GiMeditation className="text-purple-600 text-2xl mr-3" />
            <span className="text-purple-800 text-xl font-bold">Our Methodology</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Holistic Healing Approach
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We combine evidence-based therapies with traditional wellness practices to address mind, 
            body, and spirit for complete well-being.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <GiHealthNormal size={24} />,
              title: "Clinical Excellence",
              content: "All therapists trained in CBT, DBT, and trauma-informed care with rigorous quality standards.",
              color: "bg-purple-100 text-purple-600"
            },
            {
              icon: <FaUsers size={24} />,
              title: "Cultural Competence",
              content: "Specialized understanding of Indian family dynamics, workplace pressures, and societal expectations.",
              color: "bg-blue-100 text-blue-600"
            },
            {
              icon: <FaMobileAlt size={24} />,
              title: "Tech Integration",
              content: "Secure video sessions, mood tracking, and AI-powered therapist matching for optimal care.",
              color: "bg-green-100 text-green-600"
            },
            {
              icon: <FaLeaf size={24} />,
              title: "Preventive Care",
              content: "Workshops, self-help resources, and community support to maintain mental wellness.",
              color: "bg-amber-100 text-amber-600"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 sm:p-12 mb-16 text-white"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Values</h2>
            <p className="text-purple-100 max-w-2xl mx-auto">
              These principles guide every decision we make and every interaction we have.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                icon: <FaHandsHelping size={20} />,
                title: "Compassion",
                description: "We meet every client with empathy and understanding"
              },
              {
                icon: <FaBalanceScale size={20} />,
                title: "Integrity",
                description: "Ethical practice and transparency in all we do"
              },
              {
                icon: <FaLightbulb size={20} />,
                title: "Innovation",
                description: "Continually evolving to serve better"
              },
              {
                icon: <FaGlobe size={20} />,
                title: "Accessibility",
                description: "Breaking down barriers to care"
              },
              {
                icon: <FaChartLine size={20} />,
                title: "Growth",
                description: "For our clients, team, and organization"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/15 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-purple-100">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <BookAppointmentCTA />
      </div>
    </div>
  );
};

export default About;