 import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccountBenefits = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: '📅',
      title: 'Easy Appointments',
      desc: 'Book sessions with top mental health specialists in minutes'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      desc: 'Monitor your mental health journey with personalized tools'
    },
    {
      icon: '🔒',
      title: 'Secure Platform',
      desc: 'Your data is protected with end-to-end encryption'
    }
  ];

  const handleSignupClick = () => {
    navigate('/login?type=signup'); // Navigates to login page with signup param
  };

  return (
    <section className="py-16 px-4" style={{ 
      background: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)' 
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why <span style={{ color: '#FFD700' }}>Create an Account?</span>
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Unlock personalized features to support your mental health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {benefits.map((item, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-[#fef08a]/50 transition-all"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-white/80">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleSignupClick}
            className="px-8 py-3 bg-[#fef08a] text-[#7c3aed] rounded-full font-bold hover:bg-[#fde68a] transition-colors shadow-lg text-lg"
          >
            Get Started - It's Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateAccountBenefits;