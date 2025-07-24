 import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { CalendarArrowDown, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import RelatedDoctor from '../components/RelatedDoctor'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext)

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }

  const getAvailableSlots = async (date = new Date()) => {
    if (!docInfo) return

    let updatedSlots = []
    let currentDate = new Date(date)
    
    // Reset time to beginning of day
    currentDate.setHours(0, 0, 0, 0)

    for (let i = 0; i < 7; i++) {
      let dayDate = new Date(currentDate)
      dayDate.setDate(currentDate.getDate() + i)

      let endTime = new Date(dayDate)
      endTime.setHours(21, 0, 0, 0)

      // Set starting time (10:00 AM or current time if today)
      let startTime = new Date(dayDate)
      if (i === 0 && isToday(dayDate)) {
        const now = new Date()
        startTime.setHours(
          now.getHours() > 10 ? now.getHours() + 1 : 10
        )
        startTime.setMinutes(now.getMinutes() > 30 ? 30 : 0)
      } else {
        startTime.setHours(10, 0, 0, 0)
      }

      let timeSlots = []

      while (startTime < endTime) {
        let formattedTime = startTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })

        let day = startTime.getDate().toString().padStart(2, '0')
        let month = (startTime.getMonth() + 1).toString().padStart(2, '0')
        let year = startTime.getFullYear()

        const slotDate = day + '/' + month + '/' + year
        const slotTime = formattedTime

        const isSlotBooked =
          docInfo?.slots_booked?.[slotDate]?.includes(slotTime) ?? false

        if (!isSlotBooked) {
          timeSlots.push({
            datetime: new Date(startTime),
            time: slotTime
          })
        }

        startTime.setMinutes(startTime.getMinutes() + 30)
      }

      updatedSlots.push(timeSlots)
    }

    setDocSlots(updatedSlots)
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Login to book an appointment.')
      window.scrollTo(0, 0)
      return navigate('/login')
    }

    setLoading(true)

    try {
      const date = docSlots[slotIndex][0].datetime
      let day = date.getDate().toString().padStart(2, '0')
      let month = (date.getMonth() + 1).toString().padStart(2, '0')
      let year = date.getFullYear()

      const slotDate = day + '/' + month + '/' + year

      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
        window.scrollTo(0, 0)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Calendar functions
  const renderCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()
    
    const today = new Date()
    const days = []
    
    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(
        <div 
          key={`prev-${i}`} 
          className="h-10 flex items-center justify-center text-gray-400"
        >
          {daysInPrevMonth - i}
        </div>
      )
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(currentYear, currentMonth, i)
      const isDisabled = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())
      
      days.push(
        <div
          key={`current-${i}`}
          onClick={() => !isDisabled && handleDateSelect(dayDate)}
          className={`h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors
            ${
              isDisabled 
                ? 'text-gray-400 cursor-not-allowed'
                : selectedDate.getDate() === i && 
                  selectedDate.getMonth() === currentMonth && 
                  selectedDate.getFullYear() === currentYear
                ? 'bg-[#7c3aed] text-white'
                : 'hover:bg-[#7c3aed]/10'
            }`}
        >
          {i}
        </div>
      )
    }
    
    // Next month days to fill the grid
    const totalDays = days.length
    const remainingCells = 42 - totalDays // 6 rows x 7 columns
    
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div 
          key={`next-${i}`} 
          className="h-10 flex items-center justify-center text-gray-400"
        >
          {i}
        </div>
      )
    }
    
    return days
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setShowCalendar(false)
    getAvailableSlots(date)
  }

  const changeMonth = (increment) => {
    if (increment === 1) {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  return (
    docInfo && (
      <div className='min-h-screen py-8 px-4' style={{ 
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
      }}>
        {/* Doctor Card */}
        <div className='max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mb-8'>
          <div className='md:flex'>
            <div className='md:w-1/3 p-6 flex justify-center'>
              <img
                className='w-64 h-64 object-cover rounded-lg border-4 border-[#7c3aed]/20'
                src={docInfo.image}
                alt='doctor profile'
              />
            </div>
            
            <div className='md:w-2/3 p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <h1 className='text-2xl font-bold text-[#7c3aed]'>{docInfo.name}</h1>
                <img className='w-6' src={assets.verified_icon} alt='verified' />
              </div>
              
              <div className='flex items-center gap-2 mb-6'>
                <span className='bg-[#7c3aed]/10 text-[#7c3aed] px-3 py-1 rounded-full text-sm'>
                  {docInfo.speciality}
                </span>
                <span className='bg-[#fef08a]/30 text-[#7c3aed] px-3 py-1 rounded-full text-sm'>
                  {docInfo.experience} experience
                </span>
              </div>
              
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>About</h3>
                <p className='text-gray-600'>{docInfo.about}</p>
              </div>
              
              <div className='flex justify-between items-center'>
                <div>
                  <p className='text-gray-500'>Appointment Fee</p>
                  <p className='text-2xl font-bold text-[#7c3aed]'>
                    {currencySymbol}
                    {docInfo.fees}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className='max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6'>
          <h2 className='text-xl font-bold text-[#7c3aed] mb-6 flex items-center gap-2'>
            <CalendarArrowDown className="text-[#fef08a]" />
            Book Your Appointment
          </h2>
          
          {/* Date Selection */}
      {/* Date Selection */}
<div className='mb-8 relative'>
  <h3 className='text-lg font-medium text-gray-700 mb-4'>Select Date</h3>
  
  <div className='flex gap-3 overflow-x-auto pb-2'>
    {/* Calendar icon button as first item */}
    <button
      onClick={() => setShowCalendar(!showCalendar)}
      className={`flex flex-col items-center justify-center py-3 px-5 min-w-24 rounded-lg transition-all ${
        showCalendar
          ? 'bg-[#7c3aed] text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <CalendarArrowDown size={24} className="mb-1" />
      <span className='text-xs'>Calendar</span>
    </button>
    
    {/* Date pills */}
    {docSlots.map((item, index) => (
      <button
        key={index}
        onClick={() => {
          setSlotIndex(index)
          setShowCalendar(false)
        }}
        className={`flex flex-col items-center py-3 px-5 min-w-24 rounded-lg transition-all ${
          slotIndex === index
            ? 'bg-[#7c3aed] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <span className='font-medium'>
          {item[0]?.datetime.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
        </span>
        <span className='text-lg'>{item[0]?.datetime.getDate()}</span>
      </button>
    ))}
  </div>

  {/* Calendar Popup */}
  {showCalendar && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className='flex justify-between items-center mb-4'>
          <button 
            onClick={() => changeMonth(-1)}
            className='p-2 rounded-full hover:bg-gray-100'
          >
            <ChevronLeft className='text-[#7c3aed]' />
          </button>
          <h4 className='font-semibold text-gray-800 text-lg'>
            {months[currentMonth]} {currentYear}
          </h4>
          <button 
            onClick={() => changeMonth(1)}
            className='p-2 rounded-full hover:bg-gray-100'
          >
            <ChevronRight className='text-[#7c3aed]' />
          </button>
        </div>
        
        <div className='grid grid-cols-7 gap-1 mb-2'>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className='text-center text-sm font-medium text-gray-500'>
              {day}
            </div>
          ))}
        </div>
        
        <div className='grid grid-cols-7 gap-1'>
          {renderCalendarDays()}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowCalendar(false)}
            className="px-4 py-2 text-[#7c3aed] hover:bg-[#7c3aed]/10 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
</div>
          
          {/* Time Selection */}
          <div className='mb-8'>
            <h3 className='text-lg font-medium text-gray-700 mb-4'>Select Time</h3>
            <div className='flex flex-wrap gap-3'>
              {docSlots[slotIndex]?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`py-2 px-4 rounded-lg transition-all ${
                    item.time === slotTime
                      ? 'bg-[#7c3aed] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.time.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          
          {/* Confirm Button */}
          <button
            onClick={bookAppointment}
            disabled={!slotTime || loading}
            className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
              !slotTime || loading
                ? 'bg-[#a78bfa] cursor-not-allowed'
                : 'bg-[#7c3aed] hover:bg-[#5b21b6]'
            }`}
          >
            {loading ? (
              <span className='flex items-center justify-center gap-2'>
                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                Processing...
              </span>
            ) : (
              'Confirm Appointment'
            )}
          </button>
        </div>

        {/* Related Doctors */}
        <RelatedDoctor docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  )
}

export default Appointment