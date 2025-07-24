 import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Assessments = () => {
  const { userData, backendUrl, token } = useContext(AppContext);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/assessments`);
        setAssessments(data);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load assessments');
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [backendUrl]);

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#efdcf8ff',
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="text-center py-8" style={{ color: '#7c3aed' }}>Loading assessments...</div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#efdcf8ff',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#7c3aed',
          marginBottom: '1rem'
        }}>
          Mental Health Assessments
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#6b46c1',
          maxWidth: '700px'
        }}>
          Take one of our self-assessment quizzes to evaluate your mental health status and get personalized recommendations.
        </p>
      </div>

      {/* Assessments Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {assessments.map((assessment) => (
          <div key={assessment._id} style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(167, 139, 250, 0.2)',
            transition: 'transform 0.3s ease',
            ':hover': {
              transform: 'translateY(-5px)'
            }
          }}>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: '600',
              color: '#7c3aed',
              marginBottom: '1rem'
            }}>{assessment.title}</h2>
            <p style={{
              color: '#6b46c1',
              marginBottom: '2rem'
            }}>{assessment.description}</p>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '0.9rem',
                color: '#a78bfa'
              }}>
                {assessment.questions.length} questions
              </span>
              <Link
                to={`/assessment/${assessment._id}`}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  borderRadius: '50px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    backgroundColor: '#6b46c1',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Start Assessment
              </Link>
            </div>
          </div>
        ))}
      </div>

      {userData && (
        <div style={{
          marginTop: '4rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            color: '#7c3aed',
            marginBottom: '1rem'
          }}>Your Assessment History</h2>
          <Link
            to="/my-assessments"
            style={{
              color: '#7c3aed',
              fontWeight: '600',
              textDecoration: 'none',
              ':hover': {
                textDecoration: 'underline'
              }
            }}
          >
            View your past assessment results →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Assessments;