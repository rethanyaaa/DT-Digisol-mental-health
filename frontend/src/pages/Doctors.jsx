 import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { ChevronDown } from 'lucide-react'
import { motion } from "framer-motion";

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const navigate = useNavigate()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      const filtered = doctors.filter(doc => doc.speciality === speciality)
      setFilterDoc(filtered)
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  const handleSpecialityClick = newSpeciality => {
    setAnimationKey(prev => prev + 1)

    if (speciality === newSpeciality) {
      navigate('/doctors')
    } else {
      navigate(`/doctors/${newSpeciality}`)
    }

    scrollToTop()
  }

  return (
    <div className='min-h-screen px-6 md:px-12 py-8' style={{ 
      background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
    }}>
      <h1 className='text-3xl font-bold text-[#7c3aed] mb-2'>
        {speciality ? `${speciality} Specialists` : 'Our Mental Health Professionals'}
      </h1>
      <p className='text-gray-600 mb-6'>
        Find and book appointments with qualified mental health professionals.
      </p>
      
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Filter Sidebar */}
        <div className='lg:w-1/4'>
          <button
            className={`py-2 px-4 flex items-center gap-2 rounded-lg text-sm font-medium transition-all duration-300 sm:hidden ${
              showFilter 
                ? 'bg-white text-[#7c3aed] border border-[#7c3aed]' 
                : 'bg-[#7c3aed] text-white'
            }`}
            onClick={() => setShowFilter(prev => !prev)}
          >
            {showFilter ? 'Hide Filters' : 'Show Filters'}
            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${
                showFilter ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          <div className={`${showFilter ? 'block' : 'hidden'} lg:block`}>
            <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-[#7c3aed] mb-4'>
                Specializations
              </h3>
              <div className='space-y-2'>
                {[
                  'Psychiatrists',
                  'Clinical Psychologists',
                  'Therapists',
                  'Child and Adolescent Psychiatrists',
                  'Geriatric Psychiatrists',
                  'Addiction Psychiatrists'
                ].map((spec, index) => (
                  <button
                    key={index}
                    onClick={() => handleSpecialityClick(spec)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      speciality === spec
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-gray-50 hover:bg-[#f5f3ff] text-gray-700'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className='lg:w-3/4'>
          {filterDoc.length === 0 ? (
            <div className='bg-white rounded-xl p-8 text-center'>
              <h3 className='text-xl font-medium text-gray-700 mb-2'>
                No doctors found
              </h3>
              <p className='text-gray-500 mb-4'>
                {speciality 
                  ? `We currently don't have any ${speciality.toLowerCase()} specialists available.` 
                  : 'No doctors are currently available.'}
              </p>
              <button
                onClick={() => navigate('/doctors')}
                className='px-6 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#5b21b6] transition-colors'
              >
                View All Doctors
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filterDoc.map((item, index) => (
  <motion.div
    key={`${animationKey}-${index}`}
    onClick={() => {
      navigate(`/appointment/${item._id}`)
      scrollToTop()
    }}
    className='bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group flex flex-col h-full'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay: index * 0.05 }}
  >
    <div className='relative flex-grow'>
      <img
        className='w-full h-64 object-cover group-hover:brightness-90 transition-all'
        src={item.image}
        alt={item.name}
        style={{ minHeight: '256px' }} // Ensures consistent height
      />
      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
        item.available 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {item.available ? 'Available' : 'Not Available'}
      </div>
    </div>
    
    <div className='p-5 flex flex-col flex-grow-0'>
      <h3 className='text-xl font-bold text-[#7c3aed] mb-1'>
        {item.name}
      </h3>
      <p className='text-gray-600 mb-3'>{item.speciality}</p>
      <div className='flex justify-between items-center mt-auto'>
        <span className='text-sm text-gray-500'>
          {item.experience} years experience
        </span>
        <span className='font-bold text-[#7c3aed]'>
          ₹{item.fees}
        </span>
      </div>
    </div>
  </motion.div>
))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors