 import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; // Make sure to import your AppContext
import { motion } from "framer-motion";
const BookAppointmentCTA = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext); // Get token from context

  const handleAssessmentClick = () => {
    if (!token) {
      // If not logged in, navigate to login (you can change to signup if preferred)
      navigate('/login?type=login');
    } else {
      // If logged in, navigate to assessments page
      navigate('/assessments');
    }
  };

  return (
      <div style={{
          background: 'linear-gradient(to right, #7c3aed, #6d28d9)',
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center',
          color: 'white',
          maxWidth: '1200px',
          margin: '0 auto',
          boxShadow: '0 10px 25px rgba(124, 58, 237, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ 
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            Ready to Begin Your Healing Journey?
          </h2>
          
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '600px',
            margin: '0 auto 2rem auto',
            lineHeight: '1.6',
            fontSize: '1.1rem'
          }}>
            Our team is here to support you every step of the way. Schedule your
            first consultation today.
          </p>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            <motion.button
             onClick={() => navigate('/doctors')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'white',
                color: '#7c3aed',
                fontWeight: '600',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontSize: '1rem'
              }}
            >
              Book an Appointment
            </motion.button>
            
            <motion.button
             onClick={handleAssessmentClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'transparent',
                color: 'white',
                fontWeight: '600',
                borderRadius: '12px',
                border: '2px solid white',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Take Assessment
            </motion.button>
          </div>
        </div>
  );
};

export default BookAppointmentCTA;