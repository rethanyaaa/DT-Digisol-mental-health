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
        padding: '1rem',
      }}
    >
      {/* Banner Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: '1.5rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)',
        boxShadow: '0 10px 25px rgba(167, 139, 250, 0.3)',
        color: 'white',
        marginBottom: '2rem',
        textAlign: 'center',
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          textAlign: 'left',
          padding: '3rem',
        }
      }}>
        <div style={{ 
          flex: 1,
          '@media (min-width: 768px)': {
            paddingRight: '2rem'
          }
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1rem',
            lineHeight: '1.2',
            '@media (min-width: 768px)': {
              fontSize: '3rem'
            }
          }}>
            Welcome to Mental Health <span style={{ color: '#fef08a' }}>Dashboard</span>
          </h1>
          <p style={{
            fontSize: '1rem',
            marginBottom: '2rem',
            maxWidth: '600px',
            '@media (min-width: 768px)': {
              fontSize: '1.2rem'
            }
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
        
        <div style={{ 
          flex: 1, 
          textAlign: 'center',
          maxWidth: '100%',
          '@media (min-width: 768px)': {
            maxWidth: '50%'
          }
        }}>
          <img
            src={zentraImg}
            alt="Mental Health Illustration"
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))',
              animation: 'float 3s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* Additional content */}
      <div style={{
        padding: '0 1rem',
        '@media (min-width: 768px)': {
          padding: '0 2rem'
        }
      }}>
        <BookAppointmentCTA/>
        <CreateAccountBenefits/>
        <HowItWorks/>
        <Testimonials/>
      </div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          
          @media (max-width: 768px) {
            .banner-content {
              flex-direction: column;
              text-align: center;
            }
            
            .banner-text {
              padding-right: 0;
            }
            
            .banner-image {
              max-width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
