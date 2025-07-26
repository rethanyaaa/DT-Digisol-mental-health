 import React from 'react'
 import { FaLeaf, FaHeart, FaGlobe, FaLanguage, FaBalanceScale } from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import { MdOutlineSelfImprovement } from 'react-icons/md';
import { IoMdPeople } from 'react-icons/io';
import { RiMentalHealthLine } from 'react-icons/ri';

 function CreateAccount() {
   return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '3rem',
      margin: '2rem 0',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#7c3aed',
        marginBottom: '2rem'
      }}>
        What Makes <span style={{ color: '#FCD34D' }}>CHOOSE</span> US?
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {/* Features */}
        <div style={{
          backgroundColor: '#f5f3ff',
          padding: '1.5rem',
          borderRadius: '15px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <FaLeaf style={{ color: '#10b981', fontSize: '2rem', flexShrink: 0 }} />
          <div>
            <h3 style={{ color: '#7c3aed', margin: '0 0 0.5rem 0' }}>Personalized Care</h3>
            <p style={{ margin: 0 }}>Every session is tailored to your unique needs.</p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f5f3ff',
          padding: '1.5rem',
          borderRadius: '15px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <FaHeart style={{ color: '#ef4444', fontSize: '2rem', flexShrink: 0 }} />
          <div>
            <h3 style={{ color: '#7c3aed', margin: '0 0 0.5rem 0' }}>Confidential Space</h3>
            <p style={{ margin: 0 }}>A safe, non-judgmental place to express yourself freely.</p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f5f3ff',
          padding: '1.5rem',
          borderRadius: '15px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <FaLanguage style={{ color: '#3b82f6', fontSize: '2rem', flexShrink: 0 }} />
          <div>
            <h3 style={{ color: '#7c3aed', margin: '0 0 0.5rem 0' }}>Multilingual Support</h3>
            <p style={{ margin: 0 }}>Therapy in multiple languages for diverse clients.</p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f5f3ff',
          padding: '1.5rem',
          borderRadius: '15px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <FaGlobe style={{ color: '#8b5cf6', fontSize: '2rem', flexShrink: 0 }} />
          <div>
            <h3 style={{ color: '#7c3aed', margin: '0 0 0.5rem 0' }}>Global Reach</h3>
            <p style={{ margin: 0 }}>Online counseling accessible from anywhere in the world.</p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f5f3ff',
          padding: '1.5rem',
          borderRadius: '15px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <FaBalanceScale style={{ color: '#f59e0b', fontSize: '2rem', flexShrink: 0 }} />
          <div>
            <h3 style={{ color: '#7c3aed', margin: '0 0 0.5rem 0' }}>Holistic Approach</h3>
            <p style={{ margin: 0 }}>Blending modern psychology with mindfulness techniques.</p>
          </div>
        </div>
      </div>

      {/* Who Can Benefit Section */}
      <div style={{
        backgroundColor: '#fef3c7',
        padding: '2rem',
        borderRadius: '15px',
        marginTop: '2rem'
      }}>
        <h3 style={{
          textAlign: 'center',
          fontSize: '1.8rem',
          color: '#7c3aed',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <RiMentalHealthLine /> Who Can Benefit?
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <GiBrain style={{ color: '#7c3aed', fontSize: '1.5rem', marginTop: '0.2rem' }} />
            <p style={{ margin: 0 }}>Anyone struggling with stress, anxiety, or depression</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <IoMdPeople style={{ color: '#7c3aed', fontSize: '1.5rem', marginTop: '0.2rem' }} />
            <p style={{ margin: 0 }}>Couples looking to improve communication</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <MdOutlineSelfImprovement style={{ color: '#7c3aed', fontSize: '1.5rem', marginTop: '0.2rem' }} />
            <p style={{ margin: 0 }}>Individuals facing burnout or career dilemmas</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <GiBrain style={{ color: '#7c3aed', fontSize: '1.5rem', marginTop: '0.2rem' }} />
            <p style={{ margin: 0 }}>Those experiencing grief, trauma, or emotional distress</p>
          </div>
        </div>
      </div>

      <p style={{
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#6b7280',
        marginTop: '2.5rem',
        fontStyle: 'italic'
      }}>
        At Mood Mantra, we believe that mental health is a journey, not a destination. 
        Let us walk with you towards healing, self-discovery, and lasting happiness.
      </p>
    </div>
  );
 }
 
 export default CreateAccount
 