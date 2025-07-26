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

const About = () => {
  return (
    <div style={{
      backgroundColor: '#f9f7ff',
      padding: '2rem 0',
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f5f3ff 0%, #e9e4ff 100%)',
        borderRadius: '20px',
        marginBottom: '4rem',
        boxShadow: '0 15px 30px rgba(124, 58, 237, 0.1)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          padding: '0.5rem 1.5rem',
          borderRadius: '50px',
          marginBottom: '1.5rem'
        }}>
         <div style={{ fontSize: '3rem', display: 'flex', alignItems: 'center' }}>
  <FaHeart style={{ color: '#e30707ff', marginRight: '1rem', fontSize: '2.4rem' }} />
  <span style={{ color: '#7c3aed', fontWeight: '700' }}>About Mood Mantra</span>
</div>
        </div>
        <h1 style={{
          color: '#1e1b4b',
          fontSize: '3.5rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          lineHeight: '1.2'
        }}>
          Healing Minds, <span style={{ color: '#7c3aed' }}>Transforming Lives</span>
        </h1>
        <p style={{
          color: '#4b5563',
          fontSize: '1.25rem',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.7'
        }}>
          Mood Mantra is India's most compassionate mental wellness platform, making professional therapy 
          accessible, affordable, and stigma-free for everyone. We believe in holistic healing that 
          nurtures mind, body, and soul.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Our Story */}
        <div style={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: '3rem',
          marginBottom: '5rem',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <GiBrain style={{ color: '#7c3aed', fontSize: '1.5rem', marginRight: '0.5rem' }} />
              <h2 style={{
                color: '#1e1b4b',
                fontSize: '2rem',
                fontWeight: '600'
              }}>
                Our Journey
              </h2>
            </div>
            <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              Founded in 2020 by psychologist Dr. Priya Sharma and tech entrepreneur Rohan Mehta, 
              Mood Mantra began as a small counseling center in Bangalore. After witnessing the 
              devastating impact of untreated mental health issues in our communities, we set out 
              to create a solution that would break down barriers to care.
            </p>
            <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              Today, we've grown into a national movement with over 200 certified therapists, 
              serving more than 75,000 clients across India. Our name "Mood Mantra" reflects 
              our philosophy - that daily mental health practices (mantras) can transform 
              emotional well-being (mood).
            </p>
            <div style={{
              backgroundColor: '#f5f3ff',
              padding: '1.5rem',
              borderRadius: '12px',
              borderLeft: '4px solid #7c3aed'
            }}>
              <p style={{ 
                color: '#7c3aed', 
                fontStyle: 'italic',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                "Mental health is not a destination, but a journey of daily practice and self-compassion."
              </p>
              <p style={{ color: '#6b7280' }}>- Dr. Priya Sharma, Co-Founder</p>
            </div>
          </div>
          <div style={{
            flex: 1,
            backgroundColor: '#f5f3ff',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(124, 58, 237, 0.15)'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              justifyContent: 'center'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                flex: '1 1 200px',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.03)'
              }}>
                <h3 style={{ 
                  color: '#7c3aed',
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}>75K+</h3>
                <p style={{ color: '#6b7280' }}>Lives Impacted</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                flex: '1 1 200px',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.03)'
              }}>
                <h3 style={{ 
                  color: '#7c3aed',
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}>200+</h3>
                <p style={{ color: '#6b7280' }}>Certified Therapists</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                flex: '1 1 200px',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.03)'
              }}>
                <h3 style={{ 
                  color: '#7c3aed',
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}>12</h3>
                <p style={{ color: '#6b7280' }}>Regional Languages</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                flex: '1 1 200px',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.03)'
              }}>
                <h3 style={{ 
                  color: '#7c3aed',
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}>96%</h3>
                <p style={{ color: '#6b7280' }}>Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission and Vision */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: '2rem'
          }}>
            <div style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '3rem',
              boxShadow: '0 10px 30px rgba(124, 58, 237, 0.1)',
              borderTop: '5px solid #f59e0b'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <FaChartLine style={{ 
                  color: '#f59e0b',
                  fontSize: '2rem',
                  marginRight: '1rem'
                }} />
                <h3 style={{
                  color: '#1e1b4b',
                  fontSize: '1.75rem',
                  fontWeight: '600'
                }}>
                  Our Mission
                </h3>
              </div>
              <p style={{ 
                color: '#4b5563', 
                lineHeight: '1.8',
                marginBottom: '1.5rem'
              }}>
                To democratize mental healthcare by removing barriers of cost, convenience, and stigma through:
              </p>
              <ul style={{ 
                color: '#4b5563',
                paddingLeft: '1.25rem',
                marginBottom: '2rem'
              }}>
                <li style={{ marginBottom: '0.75rem', position: 'relative', paddingLeft: '1.75rem' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#f59e0b'
                  }}>•</span>
                  Affordable therapy at 60% lower cost than traditional clinics
                </li>
                <li style={{ marginBottom: '0.75rem', position: 'relative', paddingLeft: '1.75rem' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#f59e0b'
                  }}>•</span>
                  Culturally sensitive care in regional languages
                </li>
                <li style={{ marginBottom: '0.75rem', position: 'relative', paddingLeft: '1.75rem' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#f59e0b'
                  }}>•</span>
                  Preventive mental health education programs
                </li>
                <li style={{ position: 'relative', paddingLeft: '1.75rem' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#f59e0b'
                  }}>•</span>
                  Corporate partnerships for employee wellness
                </li>
              </ul>
              <div style={{
                backgroundColor: '#fffbeb',
                padding: '1.25rem',
                borderRadius: '8px',
                borderLeft: '3px solid #f59e0b'
              }}>
                <p style={{ color: '#92400e', fontStyle: 'italic' }}>
                  "Our goal is to make quality mental healthcare as accessible as a cup of chai."
                </p>
              </div>
            </div>

            <div style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '3rem',
              boxShadow: '0 10px 30px rgba(124, 58, 237, 0.1)',
              borderTop: '5px solid #10b981'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <FaGlobe style={{ 
                  color: '#10b981',
                  fontSize: '2rem',
                  marginRight: '1rem'
                }} />
                <h3 style={{
                  color: '#1e1b4b',
                  fontSize: '1.75rem',
                  fontWeight: '600'
                }}>
                  Our Vision
                </h3>
              </div>
              <p style={{ 
                color: '#4b5563', 
                lineHeight: '1.8',
                marginBottom: '1.5rem'
              }}>
                We envision an India where mental wellness is prioritized and accessible to all:
              </p>
              <ul style={{ 
                color: '#4b5563',
                paddingLeft: '1.25rem',
                marginBottom: '2rem'
              }}>
                <li style={{ marginBottom: '0.75rem', position: 'relative', paddingLeft: '1.75rem' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#10b981'
                  }}>•</span>
                  Where mental health checkups are as routine as physical exams
                </li>
                <li style={{ marginBottom: '0.75rem', position: 'relative', paddingLeft: '1.75rem' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#10b981'
                  }}>•</span>
                  Where therapy is covered by insurance providers
                </li>
                <li style={{ marginBottom: '0.75rem', position: 'relative', paddingLeft: '1.75rem' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#10b981'
                  }}>•</span>
                  Where workplaces prioritize psychological safety
                </li>
                <li style={{ position: 'relative', paddingLeft: '1.75rem' }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#10b981'
                  }}>•</span>
                  Where no one suffers in silence due to stigma
                </li>
              </ul>
              <div style={{
                backgroundColor: '#ecfdf5',
                padding: '1.25rem',
                borderRadius: '8px',
                borderLeft: '3px solid #10b981'
              }}>
                <p style={{ color: '#065f46', fontStyle: 'italic' }}>
                  "We dream of an India where asking for help is seen as strength, not weakness."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Approach */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              padding: '0.5rem 1.5rem',
              borderRadius: '50px',
              marginBottom: '1rem'
            }}>
               <div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  fontSize: '2rem',
  lineHeight: '1.5'
}}>
  <GiMeditation style={{ 
    color: '#7c3aed',
    fontSize: '2rem',
    marginRight: '1rem',
    verticalAlign: 'middle'
  }} />
  <span style={{ 
    color: '#7c3aed',
    fontWeight: '700'
  }}>
    Our Methodology
  </span>
</div>
            </div>
            <h2 style={{
              color: '#1e1b4b',
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              Holistic Healing Approach
            </h2>
            <p style={{
              color: '#4b5563',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.8'
            }}>
              We combine evidence-based therapies with traditional wellness practices to address mind, 
              body, and spirit for complete well-being.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: '1.5rem'
          }}>
            {[
              {
                icon: <GiHealthNormal size={32} />,
                title: "Clinical Excellence",
                content: "All therapists trained in CBT, DBT, and trauma-informed care with rigorous quality standards.",
                color: '#7c3aed'
              },
              {
                icon: <FaUsers size={28} />,
                title: "Cultural Competence",
                content: "Specialized understanding of Indian family dynamics, workplace pressures, and societal expectations.",
                color: '#3b82f6'
              },
              {
                icon: <FaMobileAlt size={28} />,
                title: "Tech Integration",
                content: "Secure video sessions, mood tracking, and AI-powered therapist matching for optimal care.",
                color: '#10b981'
              },
              {
                icon: <FaLeaf size={28} />,
                title: "Preventive Care",
                content: "Workshops, self-help resources, and community support to maintain mental wellness.",
                color: '#f59e0b'
              }
            ].map((item, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)'
                }
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  backgroundColor: `${item.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  {React.cloneElement(item.icon, { color: item.color })}
                </div>
                <h3 style={{
                  color: '#1e1b4b',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: '#4b5563',
                  lineHeight: '1.7'
                }}>
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div style={{
          backgroundColor: '#7c3aed',
          borderRadius: '16px',
          padding: '4rem 3rem',
          marginBottom: '5rem',
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(124, 58, 237, 0.8) 0%, rgba(109, 40, 217, 0.9) 90%)',
          color: 'white'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              Core Values
            </h2>
            <p style={{
              opacity: 0.9,
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.8'
            }}>
              These principles guide every decision we make and every interaction we have.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' },
            gap: '1.5rem'
          }}>
            {[
              {
                icon: <FaHandsHelping size={24} />,
                title: "Compassion",
                description: "We meet every client with empathy and understanding"
              },
              {
                icon: <FaBalanceScale size={24} />,
                title: "Integrity",
                description: "Ethical practice and transparency in all we do"
              },
              {
                icon: <FaLightbulb size={24} />,
                title: "Innovation",
                description: "Continually evolving to serve better"
              },
              {
                icon: <FaGlobe size={24} />,
                title: "Accessibility",
                description: "Breaking down barriers to care"
              },
              {
                icon: <FaChartLine size={24} />,
                title: "Growth",
                description: "For our clients, team, and organization"
              }
            ].map((value, index) => (
              <div key={index} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                transition: 'transform 0.3s',
                ':hover': {
                  transform: 'translateY(-5px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)'
                }
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  {React.cloneElement(value.icon, { color: 'white' })}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  {value.title}
                </h3>
                <p style={{ opacity: 0.9 }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        

        {/* CTA Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(124, 58, 237, 0.1)',
          backgroundImage: 'linear-gradient(135deg, #f9f7ff 0%, #ffffff 100%)',
          border: '1px solid #e9e4ff'
        }}>
          <h2 style={{
            color: '#1e1b4b',
            fontSize: '2.25rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            Ready to Begin Your Healing Journey?
          </h2>
          <p style={{
            color: '#4b5563',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            lineHeight: '1.8'
          }}>
            Take the first step toward emotional well-being. Our compassionate therapists are here to help.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <button style={{
              backgroundColor: '#7c3aed',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              ':hover': {
                backgroundColor: '#6d28d9'
              }
            }}>
              Book a Session
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: '#7c3aed',
              border: '2px solid #7c3aed',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              ':hover': {
                backgroundColor: '#f5f3ff'
              }
            }}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;