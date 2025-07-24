 import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
 

const About = () => {
   const navigate = useNavigate();
  
  return (
    <div className='min-h-screen px-6 md:px-12 py-8' style={{ 
      background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
    }}>
      {/* section 1 */}
      <div className='text-center pt-5 md:pt-10'>
        <h1 className='text-3xl md:text-4xl font-bold text-[#7c3aed] mb-2'>
          About <span style={{ color: '#FFD700' }}>Us</span>
        </h1>
        <p className='text-[#6b7280] max-w-2xl mx-auto'>
          Discover our mission to revolutionize mental healthcare access
        </p>
      </div>

      <div className='my-10 flex flex-col items-center lg:flex-row gap-8 md:gap-12'>
        <img
          className='w-full md:max-w-[450px] rounded-xl shadow-lg'
          src={assets.about_image}
          alt='doctors image'
        />
        <div className='flex flex-col justify-center gap-5 text-[#4b5563]'>
          <p className='text-lg'>
            Welcome to <span className='font-semibold text-[#7c3aed]'>Mental Health Dashboard</span>, your trusted partner in mental healthcare. We understand the challenges individuals face when seeking professional help and aim to make the process seamless.
          </p>
          <p className='text-lg'>
            Our platform connects you with licensed mental health professionals, providing convenient access to therapy, counseling, and psychiatric services from the comfort of your home.
          </p>
          
          <div className='mt-4 p-5 bg-white/50 rounded-xl border border-[#7c3aed]/20'>
            <h3 className='text-xl font-bold text-[#7c3aed] mb-3'>
              Our Vision
            </h3>
            <p className='text-lg'>
              To create a world where mental healthcare is accessible, affordable, and stigma-free. We're bridging the gap between patients and providers through innovative technology.
            </p>
          </div>
        </div>
      </div>

      {/* seperator */}
      <div className='my-12 h-px bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent'></div>

      {/* section 2 */}
      <div className='text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold text-[#7c3aed] mb-3'>
          Why Choose <span style={{ color: '#FFD700' }}>MindCare</span>
        </h2>
        <p className='text-[#6b7280] max-w-2xl mx-auto'>
          What makes us different from traditional healthcare providers
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {[
          {
            title: "Efficiency",
            desc: "Quick appointments with specialists in minutes, not weeks",
            icon: "⚡"
          },
          {
            title: "Privacy",
            desc: "Secure, confidential sessions with end-to-end encryption",
            icon: "🔒"
          },
          {
            title: "Personalization",
            desc: "Tailored treatment plans matching your unique needs",
            icon: "🎯"
          }
        ].map((item, index) => (
          <div 
            key={index}
            className='bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-[#7c3aed]/10 hover:border-[#7c3aed]/30'
          >
            <div className='text-4xl mb-4'>{item.icon}</div>
            <h3 className='text-xl font-bold text-[#7c3aed] mb-2'>{item.title}</h3>
            <p className='text-[#4b5563]'>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className='mt-16 text-center'>
        <button 
          className='px-8 py-3 bg-[#7c3aed] text-white rounded-full font-bold hover:bg-[#6d28d9] transition-colors shadow-lg text-lg'
          onClick={() => navigate('/doctors')}
        >
          Meet Our Specialists
        </button>
      </div>
    </div>
  )
}

export default About