 import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import zentraImg from '../assets/girl.png';
import BookAppointmentCTA from '../components/BookAppointment';
import CreateAccountBenefits from '../components/CreateAccount';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonial';
import WelcomeMessage from '../components/WelcomeMessage';

const Home = () => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const handleAssessmentClick = () => {
    if (!token) {
      navigate('/login?type=login');
    } else {
      navigate('/doctors');
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Welcome to <span className="brand-highlight">MOOD MANTRA</span>
            </h1>
            <p className="hero-subtitle">
              Your journey to mental wellness begins here. Personalized care, professional support, 
              and a community that understands.
            </p>
            <div className="hero-cta">
              <button 
                onClick={handleAssessmentClick}
                className="primary-button"
              >
                Book Your Appointment
              </button>
              <button className="secondary-button">
                Learn More
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support Available</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img
              src={zentraImg}
              alt="Mental Health Illustration"
              className="floating-image"
            />
            <div className="image-decoration"></div>
          </div>
        </div>
        <div className="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#fff"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#fff"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#fff"></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        <WelcomeMessage />
        {/* <HowItWorks /> */}
        <CreateAccountBenefits />
        <Testimonials />
        <BookAppointmentCTA />
      </div>

      {/* Floating Action Button */}
      <button className="fab" onClick={handleAssessmentClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>

      {/* Global Styles */}
      <style jsx>{`
        .home-container {
          background-color: #f9f5ff;
          min-height: 100vh;
          overflow-x: hidden;
        }
        
        .hero-section {
          // background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
          color: white;
          padding: 4rem 2rem;
          position: relative;
        }
        
        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 3rem;
          padding-bottom: 70px
        }
        
        .hero-text {
          flex: 1;
          z-index: 2;
           color: #7c3aed;
        }
        
        .hero-text h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        
        .brand-highlight {
          color: #7c3aed;
          position: relative;
          display: inline-block;
        }
        
        .brand-highlight:after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 0;
          width: 100%;
          height: 10px;
          
          z-index: -1;
          border-radius: 4px;
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
          max-width: 600px;
          line-height: 1.6;
          opacity: 0.9;
        }
        
        .hero-cta {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .primary-button {
          background-color: #fcd34d;
          color: #7c3aed;
          border: none;
          padding: 0.8rem 1.8rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(252, 211, 77, 0.3);
        }
        
        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(252, 211, 77, 0.4);
        }
        
        .secondary-button {
          background-color: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 0.8rem 1.8rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .secondary-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .hero-stats {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
          color: #7c3aed
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          color: #7c3aed
        }
        
        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
         color: #7c3aed
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }
        
        .hero-image {
          flex: 1;
          position: relative;
          z-index: 1;
        }
        
        .floating-image {
          max-width: 70%;
          height: auto;
          border-radius: 20px;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.2));
          animation: float 6s ease-in-out infinite;
        }
        
        .image-decoration {
          position: absolute;
          width: 300px;
          height: 300px;
          background: rgba(252, 211, 77, 0.1);
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          animation: morph 8s ease-in-out infinite;
        }
        
        .wave-divider {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          transform: rotate(180deg);
        }
        
        .wave-divider svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 120px;
        }
        
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        
        .fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
          transition: all 0.3s ease;
          z-index: 100;
        }
        
        .fab:hover {
          transform: scale(1.1) translateY(-5px);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes morph {
          0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          50% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        }
        
        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
          }
          
          .hero-cta {
            justify-content: center;
          }
          
          .hero-stats {
            justify-content: center;
          }
          
          .hero-text h1 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;