import React from 'react';
import { FaHeart, FaHandsHelping, FaLeaf } from 'react-icons/fa';

const WelcomeMessage = () => {
  return (
    <div style={{
      backgroundColor: '#f9fafb',
      borderRadius: '20px',
      padding: '3rem',
      margin: '3rem 0',
      borderLeft: '6px solid #7c3aed',
      boxShadow: '0 5px 15px rgba(124, 58, 237, 0.1)',
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
        <h2 style={{
          color: '#7c3aed',
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <FaHeart style={{ color: '#ef4444' }} />
          Welcome to Mood Mantra – Your Safe Space for Healing & Growth
        </h2>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            In today's fast-paced world, our mental health is often overlooked, buried beneath responsibilities, expectations, and daily struggles. But just like physical health, our emotional well-being deserves care, attention, and timely support.
          </p>

          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            If you've been feeling overwhelmed, anxious, emotionally drained, or simply unheard, know that you are not alone. Seeking help is not a sign of weakness—it is a step toward strength, clarity, and a healthier mind.
          </p>
        </div>

        <h3 style={{
          color: '#7c3aed',
          fontSize: '1.8rem',
          fontWeight: '600',
          margin: '2rem 0 1rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem'
        }}>
          <FaHandsHelping style={{ color: '#f59e0b' }} />
          Why is timely counseling important?
        </h3>

        <div style={{
          backgroundColor: '#f5f3ff',
          borderRadius: '15px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
            Many emotional struggles start small—stress, self-doubt, relationship conflicts, or work pressure. When left unaddressed, these can build up, leading to anxiety, depression, or other serious disorders. The good news? Early intervention through talk therapy can prevent this.
          </p>
          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
            Just as we visit a doctor for a minor cold before it turns into a severe illness, counseling helps the mind recover before emotional distress deepens.
          </p>
        </div>

        <div style={{
          backgroundColor: '#fef3c7',
          borderRadius: '15px',
          padding: '2rem',
          borderLeft: '4px solid #fcd34d'
        }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1rem', fontWeight: '500' }}>
            At Mood Mantra, we provide professional counseling and therapy services through compassionate conversations that help untangle your thoughts, ease emotional burdens, and empower you to regain control over your life.
          </p>
          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
            With the right guidance, a safe space to express yourself, and personalized support, you can heal, grow, and thrive.
          </p>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: '#7c3aed',
          borderRadius: '15px',
          color: 'white'
        }}>
          <p style={{ fontSize: '1.3rem', lineHeight: '1.6', marginBottom: '0' }}>
            <FaLeaf style={{ marginRight: '0.5rem' }} />
            Your mental health matters. Your feelings are valid. Your happiness is possible. 
            Let's take the first step together—because you deserve a mind at peace and a life full of meaning.
          </p>
          
          <p style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: '#fcd34d' }}>🧡 We are here for you.</span> Let's talk.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;