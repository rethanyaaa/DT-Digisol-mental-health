 import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import zentraImg from '../assets/girl.png'; // update with correct path
import BookAppointmentCTA from '../components/BookAppointment';
import CreateAccountBenefits from '../components/CreateAccount';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonial';

const Home = () => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const handleAssessmentClick = () => {
    if (!token) {
      // If not logged in, navigate to signup
      navigate('/login?type=login');
    } else {
      // If logged in, navigate to assessments page
      navigate('/assessments');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#efdcf8ff',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      {/* Banner Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        padding: '3rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)',
        boxShadow: '0 10px 25px rgba(167, 139, 250, 0.3)',
        color: 'white',
        marginBottom: '2rem'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Welcome to Mental Health <span style={{ color: '#fef08a' }}>Dashboard</span>
          </h1>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '2rem',
            maxWidth: '600px'
          }}>
            Take the first step towards better mental wellbeing with our personalized assessment tools and professional support.
          </p>
          <button 
            onClick={handleAssessmentClick}
            style={{
              backgroundColor: '#fef08a',
              color: '#7c3aed',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)'
              }
            }}
          >
            Start Your Assessment
          </button>
        </div>
        
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img
            src={zentraImg}
            alt="Mental Health Illustration"
            style={{ 
              maxWidth: '90%', 
              height: 'auto',
              filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))',
              animation: 'float 3s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* Additional content */}
      <BookAppointmentCTA/>
      <CreateAccountBenefits/>
      <HowItWorks/>
      <Testimonials/>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </div>
  );
};

export default Home;  
