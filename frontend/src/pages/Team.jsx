 import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
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
  FaLightbulb,
} from "react-icons/fa";
import { GiMeditation, GiBrain, GiHealthNormal } from "react-icons/gi";
import { RiTeamFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import BookAppointmentCTA from "../components/BookAppointment";

const OurTeam = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Stats data
  const stats = [
    {
      value: "5000+",
      label: "Patients Helped",
      icon: <FaHeart className="text-2xl" />,
    },
    {
      value: "100+",
      label: "Years Combined",
      icon: <FaCalendarAlt className="text-2xl" />,
    },
    {
      value: "98%",
      label: "Satisfaction Rate",
      icon: <FaStar className="text-2xl" />,
    },
    {
      value: "24/7",
      label: "Support Available",
      icon: <FaShieldAlt className="text-2xl" />,
    },
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '3rem',
      backgroundColor: '#f9fafb',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        backgroundColor: 'rgba(124, 58, 237, 0.05)',
        zIndex: 0
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '-30px',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        backgroundColor: 'rgba(252, 211, 77, 0.05)',
        zIndex: 0
      }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '4rem',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              color: '#7c3aed',
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}
          >
            <RiTeamFill />
            Meet Our Compassionate Team
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.7',
              color: '#4b5563',
              marginBottom: '2rem'
            }}
          >
            Our dedicated professionals bring together decades of experience,
            cutting-edge knowledge, and a patient-centered approach to provide the
            best possible care for your mental health needs.
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '15px',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)',
                  transition: 'box-shadow 0.3s ease'
                }}
              >
                <div style={{ 
                  color: '#7c3aed',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {stat.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  textAlign: 'center',
                  marginBottom: '0.25rem'
                }}>{stat.value}</h3>
                <p style={{ 
                  color: '#6b7280',
                  textAlign: 'center'
                }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Our Approach Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '2.5rem',
          marginBottom: '4rem',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
          borderLeft: '6px solid #7c3aed'
        }}>
          <h2 style={{
            color: '#7c3aed',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '2rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem'
          }}>
            <FaHandsHelping style={{ color: '#f59e0b' }} />
            Our Therapeutic Approach
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                backgroundColor: '#f5f3ff',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}>
                <GiBrain style={{ color: '#7c3aed', fontSize: '1.5rem' }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                color: '#1f2937'
              }}>
                Evidence-Based Therapies
              </h3>
              <p style={{ 
                color: '#6b7280',
                lineHeight: '1.6'
              }}>
                We utilize scientifically validated treatment methods tailored to
                each individual's needs.
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                backgroundColor: '#f5f3ff',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}>
                <FaUserMd style={{ color: '#7c3aed', fontSize: '1.5rem' }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                color: '#1f2937'
              }}>
                Personalized Care
              </h3>
              <p style={{ 
                color: '#6b7280',
                lineHeight: '1.6'
              }}>
                Every treatment plan is customized to address your unique
                circumstances and goals.
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                backgroundColor: '#f5f3ff',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}>
                <GiHealthNormal style={{ color: '#7c3aed', fontSize: '1.5rem' }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                color: '#1f2937'
              }}>
                Holistic Healing
              </h3>
              <p style={{ 
                color: '#6b7280',
                lineHeight: '1.6'
              }}>
                Addressing mind, body, and spirit for comprehensive mental
                wellness.
              </p>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div style={{ 
          maxWidth: '1400px',
          margin: '0 auto 4rem auto'
        }}>
          <h2 style={{
            color: '#7c3aed',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            Our Expert Practitioners
          </h2>
          
          <p style={{ 
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.6'
          }}>
            Each of our professionals brings unique expertise and a shared
            commitment to your mental well-being.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {doctors.map((doctor, index) => (
              <motion.div
               onClick={() => navigate(`/appointment/${doctor._id}`)}
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div style={{ 
                  position: 'relative',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid white',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                }}>
                  <img
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    src={doctor.image}
                    alt={doctor.name}
                  />
                </div>
                <h3 style={{
                  marginTop: '1rem',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>{doctor.name}</h3>
                <p style={{
                  color: '#7c3aed',
                  fontSize: '0.875rem'
                }}>{doctor.specialization}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div style={{
          backgroundColor: '#7c3aed',
          borderRadius: '20px',
          padding: '3rem',
          marginBottom: '4rem',
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          background: 'linear-gradient(to right, #7c3aed, #6d28d9)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            textAlign: 'center',
            marginBottom: '3rem',
            color: 'white',
            position: 'relative',
            zIndex: 1
          }}>
            <h2 style={{ 
              fontSize: '2rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Our Core Values
            </h2>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              These principles guide every interaction with our patients and team
              members.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            {[
              {
                icon: <FaHandsHelping style={{ fontSize: '1.5rem' }} />,
                title: "Compassion",
                description: "Meeting every client with empathy and understanding",
              },
              {
                icon: <FaBalanceScale style={{ fontSize: '1.5rem' }} />,
                title: "Integrity",
                description: "Ethical practice in all our interactions",
              },
              {
                icon: <FaLightbulb style={{ fontSize: '1.5rem' }} />,
                title: "Innovation",
                description: "Continually evolving our therapeutic approaches",
              },
              {
                icon: <FaGlobe style={{ fontSize: '1.5rem' }} />,
                title: "Accessibility",
                description: "Breaking down barriers to mental healthcare",
              },
              // {
              //   icon: <RiTeamFill style={{ fontSize: '1.5rem' }} />,
              //   title: "Collaboration",
              //   description: "Team-based care for comprehensive treatment",
              // },
            ].map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(5px)'
                }}
              >
                <div style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}>
                  {value.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>{value.title}</h3>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <BookAppointmentCTA />
      </div>
    </div>
  );
};

export default OurTeam;