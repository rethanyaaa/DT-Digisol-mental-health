 import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ChevronDown, Star, MapPin, Clock, Award } from 'lucide-react';
import { motion } from "framer-motion";
import {   Briefcase, GraduationCap } from 'lucide-react';
const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      const filtered = doctors.filter(doc => doc.speciality === speciality);
      setFilterDoc(filtered);
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const handleSpecialityClick = newSpeciality => {
    setAnimationKey(prev => prev + 1);

    if (speciality === newSpeciality) {
      navigate('/doctors');
    } else {
      navigate(`/doctors/${newSpeciality}`);
    }

    scrollToTop();
  };

  const specialities = [
    'Psychiatrists',
    'Clinical Psychologists',
    'Therapists',
    'Child and Adolescent Psychiatrists',
    'Geriatric Psychiatrists',
    'Addiction Psychiatrists'
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
            {speciality ? `${speciality} Specialists` : 'Our Mental Health Professionals'}
          </h1>
          <p className="text-lg text-purple-700 max-w-3xl mx-auto">
            Connect with qualified mental health professionals who can guide you on your wellness journey.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-1/4">
            <button
              className={`w-full py-3 px-4 flex items-center justify-between gap-2 rounded-xl text-base font-medium transition-all duration-300 lg:hidden ${
                showFilter 
                  ? 'bg-white text-purple-700 border border-purple-200 shadow-sm' 
                  : 'bg-purple-600 text-white shadow-md hover:shadow-lg'
              }`}
              onClick={() => setShowFilter(prev => !prev)}
            >
              {showFilter ? 'Hide Filters' : 'Filter by Specialization'}
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ${
                  showFilter ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${showFilter ? 'block' : 'hidden'} lg:block`}
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
                <h3 className="text-xl font-semibold text-purple-800 mb-6 flex items-center gap-2">
                  <Award size={20} className="text-purple-600" />
                  Specializations
                </h3>
                <div className="space-y-3">
                  {specialities.map((spec, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSpecialityClick(spec)}
                      className={`w-full text-left px-5 py-3 rounded-xl transition-all flex items-center gap-3 ${
                        speciality === spec
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                          : 'bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        speciality === spec ? 'bg-white' : 'bg-purple-500'
                      }`}></div>
                      {spec}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Doctors Grid */}
         <div className="lg:w-3/4">
  {filterDoc.length === 0 ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl p-10 text-center shadow-sm border border-purple-100"
    >
      {/* No doctors found state remains the same */}
    </motion.div>
  ) : (
    <motion.div
      key={animationKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {filterDoc.map((doctor, index) => (
        <motion.div
          key={`${animationKey}-${index}`}
          whileHover={{ y: -5 }}
          onClick={() => {
            navigate(`/appointment/${doctor._id}`);
            scrollToTop();
          }}
          className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          {/* Image Section - Fixed Height */}
          <div className="relative h-56 overflow-hidden">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={doctor.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'}
              alt={doctor.name}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
              }}
            />
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
              doctor.available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                doctor.available ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              {doctor.available ? 'Available' : 'Not Available'}
            </div>
          </div>
          
          {/* Content Section - Flex layout with consistent spacing */}
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {doctor.name}
                </h3>
                <p className="text-purple-600 font-medium text-sm truncate">
                  {doctor.speciality || 'General Practitioner'}
                </p>
              </div>
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg shrink-0 ml-2">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="text-yellow-800 font-medium ml-1 text-sm">
                  {doctor.rating || '4.8'}
                </span>
              </div>
            </div>

            {/* Details Section - Fixed height with consistent spacing */}
            <div className="space-y-2.5 mt-2 mb-4 h-16">
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin size={14} className="text-purple-500 mr-2 flex-shrink-0" />
                <span className="truncate">{doctor.location || 'Online & In-person'}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Briefcase size={14} className="text-purple-500 mr-2 flex-shrink-0" />
                <span>{doctor.experience || '5'}+ years experience</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <GraduationCap size={14} className="text-purple-500 mr-2 flex-shrink-0" />
                <span className="truncate">{doctor.qualification || 'MD, MBBS'}</span>
              </div>
            </div>

            {/* Footer Section - Consistent alignment */}
            <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-gray-500 text-sm">
                Starting from
              </span>
              <div className="flex items-center">
                <span className="text-lg font-bold text-purple-700">
                  ₹{doctor.fees || '500'}
                </span>
                <span className="text-xs text-gray-500 ml-1">/consultation</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;