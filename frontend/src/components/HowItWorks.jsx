import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Profile',
      desc: 'Sign up in 30 seconds with basic details'
    },
    {
      number: '02',
      title: 'Find Specialist',
      desc: 'Browse specialized mental health professionals'
    },
    {
      number: '03',
      title: 'Book Session',
      desc: 'Schedule video or in-person appointments'
    },
    {
      number: '04',
      title: 'Begin Healing',
      desc: 'Start your journey to better mental health'
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#7c3aed] mb-4">
            How <span style={{ color: '#FFD700' }}>OUR PLATFORM</span> Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to connect with mental health support
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-[#a78bfa] to-[#c4b5fd] z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold bg-[#7c3aed] text-white">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-[#7c3aed] mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;