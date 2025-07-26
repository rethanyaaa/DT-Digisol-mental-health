 import React from 'react';
import { FaComments, FaClock, FaClinicMedical, FaUsers, FaHeart, FaLeaf } from 'react-icons/fa';
import { GiMeditation } from 'react-icons/gi';

const Services = () => {
  const services = [
    {
      icon: <FaComments size={40} color="#7c3aed" />,
      title: "Talk Therapy & Counseling",
      description: "Personalized one-on-one sessions with licensed therapists to address emotional challenges, life transitions, and personal growth.",
      benefits: [
        "Evidence-based approaches (CBT, DBT, Psychodynamic)",
        "Confidential environment to explore feelings",
        "Personalized treatment plans",
        "Weekly or bi-weekly sessions"
      ],
      whoItsFor: "Ideal for individuals dealing with depression, life transitions, self-esteem issues, or those seeking personal development"
    },
    {
      icon: <FaClock size={40} color="#f59e0b" />,
      title: "24/7 Online Therapy Support",
      description: "Immediate access to professional help through secure video, chat, or phone sessions whenever you need it.",
      benefits: [
        "No waiting lists or scheduling conflicts",
        "Therapy from the comfort of your home",
        "Emergency sessions available",
        "Same quality as in-person therapy"
      ],
      whoItsFor: "Perfect for busy professionals, students, parents, or anyone needing flexible access to mental health support"
    },
    {
      icon: <FaClinicMedical size={40} color="#10b981" />,
      title: "Offline Counseling Centers",
      description: "Traditional face-to-face therapy in our calming, professionally designed centers across major cities.",
      benefits: [
        "Private, comfortable therapy rooms",
        "In-person connection with your therapist",
        "Access to therapeutic tools and resources",
        "Discreet locations for complete privacy"
      ],
      whoItsFor: "Those who prefer in-person interaction or need a dedicated space away from their daily environment"
    },
    {
      icon: <FaUsers size={40} color="#3b82f6" />,
      title: "Group Therapy & Workshops",
      description: "Healing in community with others who share similar experiences, guided by expert facilitators.",
      benefits: [
        "Reduced cost compared to individual therapy",
        "Shared experiences and peer support",
        "Specialized groups (grief, addiction, parenting)",
        "Monthly workshops on mindfulness and coping skills"
      ],
      whoItsFor: "Individuals who benefit from community support or want to supplement their individual therapy"
    },
    {
      icon: <FaHeart size={40} color="#ef4444" />,
      title: "Couples & Relationship Counseling",
      description: "Expert guidance to improve communication, resolve conflicts, and strengthen emotional connections.",
      benefits: [
        "Pre-marital counseling available",
        "Conflict resolution strategies",
        "Intimacy and trust rebuilding",
        "Parenting partnership guidance"
      ],
      whoItsFor: "Couples at any stage - dating, engaged, married, or considering separation"
    },
    {
      icon: <GiMeditation size={40} color="#8b5cf6" />,
      title: "Stress & Anxiety Management",
      description: "Proven techniques to reduce anxiety, manage stress, and cultivate emotional resilience.",
      benefits: [
        "Mindfulness and meditation training",
        "Breathing and relaxation techniques",
        "Cognitive restructuring methods",
        "Personalized stress reduction plans"
      ],
      whoItsFor: "Anyone experiencing work stress, panic attacks, social anxiety, or general overwhelm"
    }
  ];

  return (
    <div style={{
      backgroundColor: '#f5f3ff',
      borderRadius: '20px',
      padding: '3rem',
      margin: '3rem 0',
      boxShadow: '0 10px 25px rgba(124, 58, 237, 0.1)'
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#7c3aed',
        marginBottom: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <FaLeaf /> Our Comprehensive Services
      </h2>

      <p style={{
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#6b7280',
        maxWidth: '800px',
        margin: '0 auto 3rem auto',
        lineHeight: '1.7'
      }}>
        At Mind Mantra, we offer a holistic range of mental health services designed to meet you where you are in your journey. 
        Each program is carefully crafted by our team of licensed professionals to provide effective, compassionate care.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {services.map((service, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s ease',
            ':hover': {
              transform: 'translateY(-5px)'
            }
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                backgroundColor: '#f5f3ff',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {service.icon}
              </div>
              <h3 style={{
                color: '#7c3aed',
                fontSize: '1.5rem',
                margin: 0
              }}>
                {service.title}
              </h3>
            </div>
            
            <p style={{ 
              color: '#6b7280',
              lineHeight: '1.7',
              marginBottom: '1.5rem'
            }}>
              {service.description}
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{
                color: '#7c3aed',
                fontSize: '1.1rem',
                marginBottom: '0.8rem'
              }}>
                Key Benefits:
              </h4>
              <ul style={{
                paddingLeft: '1.5rem',
                margin: 0,
                color: '#6b7280'
              }}>
                {service.benefits.map((benefit, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>{benefit}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 style={{
                color: '#7c3aed',
                fontSize: '1.1rem',
                marginBottom: '0.8rem'
              }}>
                Who It's For:
              </h4>
              <p style={{ 
                color: '#6b7280',
                lineHeight: '1.7',
                margin: 0
              }}>
                {service.whoItsFor}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: '#7c3aed',
        borderRadius: '15px',
        padding: '2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <h3 style={{
          fontSize: '1.8rem',
          marginBottom: '1rem'
        }}>
          Ready to Begin Your Healing Journey?
        </h3>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '1.5rem',
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Our team of compassionate professionals is here to guide you toward emotional wellness. 
          Take the first step today.
        </p>
        <button style={{
          backgroundColor: '#fcd34d',
          color: '#7c3aed',
          border: 'none',
          padding: '12px 30px',
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
        }}>
          Book Your Session Now
        </button>
      </div>
    </div>
  );
};

export default Services;