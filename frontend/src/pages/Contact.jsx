 import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Contact = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const handleAssessmentClick = () => {
    if (!token) {
      navigate('/login?type=login');
    } else {
      navigate('/assessments');
    }
  };

  return (
    <div className='md:my-8'>
      {/* Hero Header */}
      <div className='relative bg-gradient-to-r from-[#7c3aed] to-[#9f67ff] py-16 md:py-24'>
        <div className='absolute inset-0 bg-white opacity-10'></div>
        <div className='relative max-w-6xl mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-5xl font-extrabold text-white mb-4'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#fef08a] to-[#fde047]'>
              CONTACT US
            </span>
          </h1>
          <p className='text-xl text-white opacity-90 max-w-2xl mx-auto'>
            Reach out to our caring team - we're here to support your mental wellness journey
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className='max-w-6xl mx-auto px-4 py-12'>
        <div className='flex flex-col lg:flex-row gap-12'>
          {/* Left Column - Contact Image */}
          <div className='lg:w-1/2'>
            <img
              className='w-full h-auto rounded-xl shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-300'
              src={assets.contact_image}
              alt='Supportive therapist talking to client'
            />
          </div>

          {/* Right Column - Contact Info */}
          <div className='lg:w-1/2 space-y-8'>
            <div className='bg-white p-8 rounded-xl shadow-lg border border-gray-100'>
              <h2 className='text-2xl font-bold text-[#7c3aed] mb-6 flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                OUR OFFICE
              </h2>
              <p className='text-gray-700 text-lg mb-6'>
                50709 Wilims Station, <br />
                Suite 350, Washington, USA
              </p>
              
              <div className='h-px bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent my-6'></div>
              
              <h2 className='text-2xl font-bold text-[#7c3aed] mb-6 flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                CONTACT DETAILS
              </h2>
              <p className='text-gray-700 text-lg mb-2'>
                <span className='font-semibold'>Phone:</span> (415) 555-0132
              </p>
              <p className='text-gray-700 text-lg mb-2'>
                <span className='font-semibold'>Email:</span> support@mindwell.com
              </p>
              <p className='text-gray-700 text-lg'>
                <span className='font-semibold'>Emergency:</span> (415) 555-0199
              </p>
            </div>

            {/* Hours Card */}
            <div className='bg-[#f5f3ff] p-8 rounded-xl shadow-lg border border-[#e9d8fd]'>
              <h2 className='text-2xl font-bold text-[#7c3aed] mb-6 flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                OFFICE HOURS
              </h2>
              <ul className='space-y-3 text-gray-700 text-lg'>
                <li className='flex justify-between'>
                  <span className='font-medium'>Monday - Friday:</span>
                  <span>9:00 AM - 7:00 PM</span>
                </li>
                <li className='flex justify-between'>
                  <span className='font-medium'>Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </li>
                <li className='flex justify-between'>
                  <span className='font-medium'>Sunday:</span>
                  <span className='text-red-500'>Closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className='mt-20 text-center'>
          <div className='inline-block bg-gradient-to-r from-[#7c3aed] to-[#9f67ff] p-1 rounded-full shadow-xl'>
            <div className='bg-white px-8 py-6 rounded-full'>
              <h3 className='text-2xl md:text-3xl font-bold text-[#7c3aed] mb-4'>
                Ready to Start Your Wellness Journey?
              </h3>
              <p className='text-gray-600 text-lg mb-6 max-w-2xl mx-auto'>
                Connect with our licensed professionals today and take the first step toward better mental health.
              </p>
              <div className='flex flex-col sm:flex-row justify-center gap-4'>
                <button
                  onClick={() => navigate('/doctors')}
                  className='px-8 py-3 bg-[#7c3aed] text-white rounded-full font-medium hover:bg-[#6d28d9] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                >
                  Browse Doctors
                </button>
                <button
                  onClick={handleAssessmentClick}
                  className='px-8 py-3 bg-[#fef08a] text-[#7c3aed] rounded-full font-medium hover:bg-[#fde68a] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                >
                  Take Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;