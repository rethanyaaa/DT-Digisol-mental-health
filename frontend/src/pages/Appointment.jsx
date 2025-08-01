import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import {
  CalendarArrowDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Star,
  Clock,
  User,
  Video,
  Monitor,
  AlertTriangle,
} from "lucide-react";
import RelatedDoctor from "../components/RelatedDoctor";
import { toast } from "react-toastify";
import axios from "axios";
import {
  isVideoConsultationSupported,
  getBrowserInfo,
} from "../utils/webrtcUtils";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);

  const navigate = useNavigate();
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const progressRef = useRef(null);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [consultationType, setConsultationType] = useState("in-person");
  const [showWebRTCWarning, setShowWebRTCWarning] = useState(false);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && videoContainerRef.current) {
      videoContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getAvailableSlots = async (date = new Date()) => {
    if (!docInfo) return;

    let updatedSlots = [];
    let currentDate = new Date(date);

    // Reset time to beginning of day
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      let dayDate = new Date(currentDate);
      dayDate.setDate(currentDate.getDate() + i);

      let endTime = new Date(dayDate);
      endTime.setHours(21, 0, 0, 0);

      // Set starting time (10:00 AM or current time if today)
      let startTime = new Date(dayDate);
      if (i === 0 && isToday(dayDate)) {
        const now = new Date();
        startTime.setHours(now.getHours() > 10 ? now.getHours() + 1 : 10);
        startTime.setMinutes(now.getMinutes() > 30 ? 30 : 0);
      } else {
        startTime.setHours(10, 0, 0, 0);
      }

      let timeSlots = [];

      while (startTime < endTime) {
        let formattedTime = startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = startTime.getDate().toString().padStart(2, "0");
        let month = (startTime.getMonth() + 1).toString().padStart(2, "0");
        let year = startTime.getFullYear();

        const slotDate = day + "/" + month + "/" + year;
        const slotTime = formattedTime;

        const isSlotBooked =
          docInfo?.slots_booked?.[slotDate]?.includes(slotTime) ?? false;

        if (!isSlotBooked) {
          timeSlots.push({
            datetime: new Date(startTime),
            time: slotTime,
          });
        }

        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      updatedSlots.push(timeSlots);
    }

    setDocSlots(updatedSlots);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Login to book an appointment.");
      window.scrollTo(0, 0);
      return navigate("/login");
    }

    // Check WebRTC support for video consultation
    if (consultationType === "video" && !isVideoConsultationSupported()) {
      setShowWebRTCWarning(true);
      return;
    }

    setLoading(true);

    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate().toString().padStart(2, "0");
      let month = (date.getMonth() + 1).toString().padStart(2, "0");
      let year = date.getFullYear();

      const slotDate = day + "/" + month + "/" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime, consultationType },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
        window.scrollTo(0, 0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calendar functions
  const renderCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const today = new Date();
    const days = [];

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(
        <div
          key={`prev-${i}`}
          className="h-10 flex items-center justify-center text-gray-400"
        >
          {daysInPrevMonth - i}
        </div>
      );
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(currentYear, currentMonth, i);
      const isDisabled =
        dayDate <
        new Date(today.getFullYear(), today.getMonth(), today.getDate());

      days.push(
        <div
          key={`current-${i}`}
          onClick={() => !isDisabled && handleDateSelect(dayDate)}
          className={`h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors
            ${
              isDisabled
                ? "text-gray-400 cursor-not-allowed"
                : selectedDate.getDate() === i &&
                  selectedDate.getMonth() === currentMonth &&
                  selectedDate.getFullYear() === currentYear
                ? "bg-[#4f46e5] text-white"
                : "hover:bg-[#4f46e5]/10"
            }`}
        >
          {i}
        </div>
      );
    }

    // Next month days to fill the grid
    const totalDays = days.length;
    const remainingCells = 42 - totalDays; // 6 rows x 7 columns

    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className="h-10 flex items-center justify-center text-gray-400"
        >
          {i}
        </div>
      );
    }

    return days;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    getAvailableSlots(date);
  };

  const changeMonth = (increment) => {
    if (increment === 1) {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    docInfo && (
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
        {/* Hero Section with Video */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black">
            {docInfo.video ? (
              <>
                <video
                  ref={videoRef}
                  src={docInfo.video}
                  className="w-full h-full object-cover"
                  poster={docInfo.image}
                  onClick={togglePlay}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  muted={isMuted}
                />

                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                    onClick={togglePlay}
                  >
                    <div className="w-24 h-24 bg-[#4f46e5]/90 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform shadow-xl">
                      <Play className="text-white ml-2" size={40} />
                    </div>
                  </div>
                )}

                <div
                  className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
                    !isPlaying ? "opacity-100" : "opacity-0 hover:opacity-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-3xl font-bold text-white">
                        {docInfo.name}
                      </h1>
                      <p className="text-lg text-white/80">
                        {docInfo.speciality}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="text-white hover:text-[#4f46e5] transition-colors"
                      >
                        {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-[#4f46e5] transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX size={28} />
                        ) : (
                          <Volume2 size={28} />
                        )}
                      </button>
                      <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-[#4f46e5] transition-colors"
                      >
                        <Maximize2 size={28} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#4f46e5] to-[#7c3aed]">
                <img
                  src={docInfo.image}
                  alt={docInfo.name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* Doctor Details */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
          {/* Doctor Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {docInfo.name}
                  </h2>
                  <img
                    className="w-6"
                    src={assets.verified_icon}
                    alt="verified"
                  />
                </div>
                <p className="text-lg text-gray-600 mb-4">{docInfo.about}</p>
              </div>
              <div className="flex items-center gap-1 bg-[#4f46e5]/10 px-3 py-1 rounded-full">
                <Star className="text-[#4f46e5]" size={18} />
                <span className="font-medium text-[#4f46e5]">
                  {docInfo.rating || "4.9"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-[#4f46e5]" size={20} />
                  <h3 className="font-medium text-gray-700">Experience</h3>
                </div>
                <p className="text-gray-600">{docInfo.experience} years</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <User className="text-[#4f46e5]" size={20} />
                  <h3 className="font-medium text-gray-700">Patients</h3>
                </div>
                <p className="text-gray-600">{docInfo.patients || "500+"}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Specializations
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#4f46e5]/10 text-[#4f46e5] px-4 py-2 rounded-full text-sm font-medium">
                  {docInfo.speciality}
                </span>
                {docInfo.languages &&
                  docInfo.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {lang}
                    </span>
                  ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Consultation Fee
              </h3>
              <p className="text-3xl font-bold text-[#4f46e5]">
                {currencySymbol}
                {docInfo.fees}
              </p>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#4f46e5]/10 flex items-center justify-center">
                <Clock className="text-[#4f46e5]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Availability</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Average wait time</p>
                <p className="font-medium">15-30 minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Consultation hours</p>
                <p className="font-medium">10:00 AM - 9:00 PM</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Response time</p>
                <p className="font-medium">Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4f46e5]/10 flex items-center justify-center">
              <CalendarArrowDown className="text-[#4f46e5]" size={20} />
            </div>
            Book Your Appointment
          </h2>

          {/* Date Selection */}
          <div className="mb-8 relative">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Select Date
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {/* Calendar icon button as first item */}
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className={`flex flex-col items-center justify-center py-3 px-5 min-w-24 rounded-lg transition-all ${
                  showCalendar
                    ? "bg-[#4f46e5] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <CalendarArrowDown size={24} className="mb-1" />
                <span className="text-xs">Calendar</span>
              </button>

              {/* Date pills */}
              {docSlots.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSlotIndex(index);
                    setShowCalendar(false);
                  }}
                  className={`flex flex-col items-center py-3 px-5 min-w-24 rounded-lg transition-all ${
                    slotIndex === index
                      ? "bg-[#4f46e5] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="font-medium">
                    {item[0]?.datetime
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .toUpperCase()}
                  </span>
                  <span className="text-lg font-semibold">
                    {item[0]?.datetime.getDate()}
                  </span>
                  <span className="text-xs opacity-80">
                    {item[0]?.datetime.toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </span>
                </button>
              ))}
            </div>

            {/* Calendar Popup */}
            {showCalendar && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft className="text-[#4f46e5]" />
                    </button>
                    <h4 className="font-semibold text-gray-800 text-lg">
                      {months[currentMonth]} {currentYear}
                    </h4>
                    <button
                      onClick={() => changeMonth(1)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight className="text-[#4f46e5]" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-gray-500"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {renderCalendarDays()}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="px-4 py-2 bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca] transition-colors"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Time Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Select Time
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {docSlots[slotIndex]?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`py-3 px-4 rounded-lg transition-all text-center ${
                    item.time === slotTime
                      ? "bg-[#4f46e5] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.time.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Consultation Type Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Consultation Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* In-Person Consultation */}
              <div
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                  consultationType === "in-person"
                    ? "border-[#4f46e5] bg-[#4f46e5]/5"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
                onClick={() => setConsultationType("in-person")}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      consultationType === "in-person"
                        ? "bg-[#4f46e5] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <Monitor size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      In-Person Consultation
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Visit the doctor's clinic for a face-to-face consultation
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Available at all locations</span>
                    </div>
                  </div>
                  {consultationType === "in-person" && (
                    <div className="w-6 h-6 rounded-full bg-[#4f46e5] flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Video Consultation */}
              <div
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                  consultationType === "video"
                    ? "border-[#4f46e5] bg-[#4f46e5]/5"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
                onClick={() => setConsultationType("video")}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      consultationType === "video"
                        ? "bg-[#4f46e5] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <Video size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Video Consultation
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Connect with your doctor via secure video call
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isVideoConsultationSupported()
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span>
                        {isVideoConsultationSupported()
                          ? "WebRTC supported"
                          : "WebRTC not supported"}
                      </span>
                    </div>
                  </div>
                  {consultationType === "video" && (
                    <div className="w-6 h-6 rounded-full bg-[#4f46e5] flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* WebRTC Warning */}
            {consultationType === "video" &&
              !isVideoConsultationSupported() && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className="text-amber-600 mt-0.5"
                      size={20}
                    />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">
                        Browser Compatibility Warning
                      </h4>
                      <p className="text-sm text-amber-700 mb-2">
                        Your browser doesn't support video consultation
                        features. Please use a modern browser like Chrome,
                        Firefox, Safari, or Edge.
                      </p>
                      <div className="text-xs text-amber-600">
                        <strong>Detected:</strong> {getBrowserInfo().browser}{" "}
                        {getBrowserInfo().version}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Confirm Button */}
          <button
            onClick={bookAppointment}
            disabled={!slotTime || loading}
            className={`w-full py-4 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2 ${
              !slotTime || loading
                ? "bg-[#a5b4fc] cursor-not-allowed"
                : "bg-[#4f46e5] hover:bg-[#4338ca] shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <Check size={20} />
                Confirm Appointment
              </>
            )}
          </button>
        </div>

        {/* Related Doctors */}
        <RelatedDoctor docId={docId} speciality={docInfo.speciality} />

        {/* WebRTC Warning Modal */}
        {showWebRTCWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Browser Not Supported
                  </h3>
                  <p className="text-sm text-gray-600">
                    Video consultation requires WebRTC support
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Your current browser doesn't support video consultation
                  features. To use video consultation, please:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    Update to the latest version of your browser
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    Use Chrome, Firefox, Safari, or Edge
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    Ensure camera and microphone permissions are enabled
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-xs text-gray-600">
                  <strong>Current Browser:</strong> {getBrowserInfo().browser}{" "}
                  {getBrowserInfo().version}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWebRTCWarning(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setConsultationType("in-person");
                    setShowWebRTCWarning(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca] transition-colors"
                >
                  Book In-Person
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default Appointment;
