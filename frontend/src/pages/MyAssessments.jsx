 import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import AssessmentDetailedResults from "../components/AssessmentDetailedResults";

const MyAssessments = () => {
  const { userData, backendUrl, token } = useContext(AppContext);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [detailedResults, setDetailedResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return;

    const fetchUserAssessments = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/api/assessments/user/${userData._id}`,
          { headers: { token } }
        );
        setAssessments(data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load your assessments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserAssessments();
  }, [userData, backendUrl, token]);

  const viewDetailedResults = async (assessmentId) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/assessments/results/${assessmentId}`,
        { headers: { token } }
      );
      setDetailedResults(data);
      setSelectedAssessment(assessmentId);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load detailed results"
      );
    }
  };

  if (!userData) {
    return (
      <div style={{
        backgroundColor: '#efdcf8ff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '3rem',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(167, 139, 250, 0.2)'
        }}>
          <div style={{
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60px',
            width: '60px',
            borderRadius: '50%',
            backgroundColor: '#f3e8ff',
            marginBottom: '1.5rem'
          }}>
            <svg
              style={{
                height: '30px',
                width: '30px',
                color: '#7c3aed'
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#7c3aed',
            marginBottom: '1rem'
          }}>
            Assessment History
          </h1>
          <p style={{
            color: '#6b46c1',
            marginBottom: '2rem'
          }}>
            Please sign in to view your assessment history.
          </p>
          <Link
            to="/login"
            style={{
              display: 'inline-block',
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
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#efdcf8ff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #7c3aed',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{
            marginTop: '1rem',
            color: '#7c3aed',
            fontSize: '1.1rem'
          }}>
            Loading your assessments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#efdcf8ff',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#7c3aed',
            marginBottom: '0.5rem'
          }}>
            Your Assessment History
          </h1>
          <p style={{
            color: '#6b46c1',
            marginBottom: '2rem'
          }}>
            View all assessments you've completed
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem'
          }}>
            <Link
              to="/assessments"
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
              Take New Assessment
            </Link>
          </div>
        </div>

        {detailedResults ? (
          <AssessmentDetailedResults resultData={detailedResults} />
        ) : assessments.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(167, 139, 250, 0.2)'
          }}>
            <svg
              style={{
                height: '50px',
                width: '50px',
                color: '#a78bfa',
                margin: '0 auto',
                marginBottom: '1.5rem'
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#7c3aed',
              marginBottom: '0.5rem'
            }}>
              No assessments completed
            </h3>
            <p style={{
              color: '#6b46c1',
              marginBottom: '2rem'
            }}>
              Get started by taking your first assessment.
            </p>
            <Link
              to="/assessments"
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
              Take an Assessment
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '1.5rem'
          }}>
            {assessments.map((assessment) => (
              <div
                key={assessment._id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 10px 25px rgba(167, 139, 250, 0.2)'
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}>
                    <div>
                      <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#7c3aed',
                        marginBottom: '0.5rem'
                      }}>
                        {assessment.assessmentId?.title || "Assessment"}
                      </h2>
                      <p style={{
                        color: '#6b46c1',
                        fontSize: '0.9rem'
                      }}>
                        Completed on{" "}
                        {new Date(assessment.completedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 1rem',
                        borderRadius: '50px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        ...(assessment.result === "Low Risk" ? {
                          backgroundColor: '#dcfce7',
                          color: '#166534'
                        } : assessment.result === "Moderate Risk" ? {
                          backgroundColor: '#fef9c3',
                          color: '#854d0e'
                        } : {
                          backgroundColor: '#fee2e2',
                          color: '#991b1b'
                        })
                      }}
                    >
                      {assessment.result}
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div style={{
                      backgroundColor: '#f3e8ff',
                      padding: '1rem',
                      borderRadius: '12px'
                    }}>
                      <p style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#7c3aed',
                        marginBottom: '0.5rem'
                      }}>Score</p>
                      <p style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#7c3aed'
                      }}>
                        {assessment.totalScore}
                      </p>
                    </div>

                    <div style={{
                      backgroundColor: '#f3e8ff',
                      padding: '1rem',
                      borderRadius: '12px'
                    }}>
                      <p style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#7c3aed',
                        marginBottom: '0.5rem'
                      }}>Assessment</p>
                      <p style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#7c3aed'
                      }}>
                        {assessment.assessmentId?.title || "N/A"}
                      </p>
                    </div>

                    <div style={{
                      backgroundColor: '#f3e8ff',
                      padding: '1rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      ':hover': {
                        backgroundColor: '#e9d5ff'
                      }
                    }}
                    onClick={() => viewDetailedResults(assessment._id)}>
                      <p style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#7c3aed',
                        marginBottom: '0.5rem'
                      }}>Details</p>
                      <p style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#7c3aed'
                      }}>
                        View Detailed Results
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAssessments;