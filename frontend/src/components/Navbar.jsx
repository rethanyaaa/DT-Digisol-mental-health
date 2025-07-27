 import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { WordRotate } from "./WordRotateComp";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false); // For mobile menu
  const [showProfileMenu, setShowProfileMenu] = useState(false); // For profile dropdown
  const [activeLink, setActiveLink] = useState(""); // Track active link for underline effect

  // logout function to clear token from local storage and context
  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    toast.info("Logged Out.");
  };

  // Handle click outside for profile menu
  React.useEffect(() => {
    const handleProfileClickOutside = (event) => {
      if (event.target.closest(".profile-menu-container") === null) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleProfileClickOutside);
    } else {
      document.removeEventListener("mousedown", handleProfileClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleProfileClickOutside);
    };
  }, [showProfileMenu]);

  // handle click outside the page-nav menu
  const handleClickOutside = (event) => {
    if (event.target.closest(".menu-container") === null) {
      setShowMenu(false);
    }
  };

  React.useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // handle user login btn - all clicks
  const handleAuthNavigation = (type) => {
    const currentPath = window.location.pathname;

    if (currentPath === "/login") {
      navigate(`/login?type=${type}`, { replace: true });
      window.location.reload();
    } else {
      navigate(`/login?type=${type}`);
    }
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update active link when route changes
  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, [navigate]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between text-sm py-4 bg-white transition-all duration-300 ${
        scrolled ? "shadow-md py-3" : "shadow-none py-4"
      }`}
      style={{
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Logo */}
      <img
        src="logooo.png"
        alt="Logo"
        className="transition-all duration-300 hover:scale-105"
        style={{
          maxWidth: "13%",
          marginLeft: '12px',
          height: "auto",
        }}
      />

      {/* Navigation Links */}
      <ul className="hidden md:flex items-center gap-8 font-semibold text-[#7c3aed]  ">
        <NavLink to={"/"}>
          <li className="relative py-1 group">
            <span className="transition-all duration-200 group-hover:text-[#5b21b6]">
              HOME
            </span>
            <span 
              className={`absolute bottom-0 left-0 h-0.5 bg-[#5b21b6] transition-all duration-300 ${
                activeLink === "/" ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </li>
        </NavLink>
        <NavLink to={"/services"}>
          <li className="relative py-1 group">
            <span className="transition-all duration-200 group-hover:text-[#5b21b6]">
              SERVICES
            </span>
            <span 
              className={`absolute bottom-0 left-0 h-0.5 bg-[#5b21b6] transition-all duration-300 ${
                activeLink === "/services" ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </li>
        </NavLink>
        <NavLink to={"/doctors"}>
          <li className="relative py-1 group">
            <span className="transition-all duration-200 group-hover:text-[#5b21b6]">
              EXPERTS
            </span>
            <span 
              className={`absolute bottom-0 left-0 h-0.5 bg-[#5b21b6] transition-all duration-300 ${
                activeLink === "/doctors" ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </li>
        </NavLink>
        <NavLink to={"/ourTeam"}>
          <li className="relative py-1 group">
            <span className="transition-all duration-200 group-hover:text-[#5b21b6]">
              OUR TEAM
            </span>
            <span 
              className={`absolute bottom-0 left-0 h-0.5 bg-[#5b21b6] transition-all duration-300 ${
                activeLink === "/ourTeam" ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </li>
        </NavLink>
        {token && (
          <NavLink to={"/assessments"}>
            <li className="relative py-1 group">
              <span className="transition-all duration-200 group-hover:text-[#5b21b6]">
                ASSESSMENTS
              </span>
              <span 
                className={`absolute bottom-0 left-0 h-0.5 bg-[#5b21b6] transition-all duration-300 ${
                  activeLink === "/assessments" ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </li>
          </NavLink>
        )}
        <NavLink to={"/about"}>
          <li className="relative py-1 group">
            <span className="transition-all duration-200 group-hover:text-[#5b21b6]">
              ABOUT
            </span>
            <span 
              className={`absolute bottom-0 left-0 h-0.5 bg-[#5b21b6] transition-all duration-300 ${
                activeLink === "/about" ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </li>
        </NavLink>
        <NavLink to={"/contact"}>
          <li className="relative py-1 group">
            <span className="transition-all duration-200 group-hover:text-[#5b21b6]">
              CONTACT
            </span>
            <span 
              className={`absolute bottom-0 left-0 h-0.5 bg-[#5b21b6] transition-all duration-300 ${
                activeLink === "/contact" ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </li>
        </NavLink>

        {/* Admin/Doctor Login Button */}
        {!token && (
          <NavLink to={import.meta.env.VITE_ADMIN_PANEL_URL} target="_blank">
            <button className="px-3 py-2 w-fit border border-[#7c3aed] bg-transparent text-[#7c3aed] rounded flex items-center gap-1 hover:bg-[#7c3aed] hover:text-white transition-all duration-300 hover:scale-105 font-semibold">
              <WordRotate words={["Admin", "Doctor"]} /> Login
            </button>
          </NavLink>
        )}
      </ul>

      {/* Auth Buttons/Profile */}
      <div className="flex items-center mr-5">
        <div className="flex items-center gap-2">
          {token && userData ? (
            <div
              className="flex items-center gap-2 cursor-pointer relative lg:mx-12 p-1.5 select-none profile-menu-container"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="flex items-center gap-px sm:gap-1">
                <img
                  className="size-8 sm:size-9 aspect-square object-cover rounded-[5px] border border-[#7c3aed] transition-all duration-300 hover:scale-110"
                  src={userData.image}
                  alt="profile pic"
                />
                <ChevronDown
                  size={18}
                  className={`text-[#7c3aed] transition-all duration-300 ease-in-out ${
                    showProfileMenu ? "-rotate-180" : "rotate-0"
                  }`}
                />
              </div>
              <div
                className={`absolute top-0 right-0 pt-12 text-base font-semibold text-[#7c3aed] z-20 ${
                  showProfileMenu ? "block" : "hidden"
                } motion-translate-x-in-[0%] motion-translate-y-in-[-5%] motion-duration-[0.26s] motion-ease-linear`}
              >
                <div className="min-w-48 bg-white border border-[#7c3aed] rounded-[7px] text-[15px] font-medium flex flex-col gap-1 p-2 shadow-lg transition-all duration-300 origin-top">
                  <p
                    onClick={() => navigate("my-profile")}
                    className="px-2 py-1.5 rounded hover:bg-[#7c3aed]/10 transition-all duration-200 ease-in cursor-pointer hover:pl-3"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("my-appointments")}
                    className="px-2 py-1.5 rounded hover:bg-[#7c3aed]/10 transition-all duration-200 ease-in cursor-pointer hover:pl-3"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={() => navigate("my-assessments")}
                    className="px-2 py-1.5 rounded hover:bg-[#7c3aed]/10 transition-all duration-200 ease-in cursor-pointer hover:pl-3"
                  >
                  My Assessments  
                  </p>
                  <hr className="my-[1px] mx-2 border-[#7c3aed]/20" />
                  <p
                    onClick={logout}
                    className="px-2 py-1.5 rounded hover:text-red-500 hover:bg-[#7c3aed]/10 transition-all duration-200 ease-in cursor-pointer w-full flex items-center justify-start gap-1 group"
                  >
                    <span>Logout</span>
                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-1 transition-transform duration-200 ease-linear"
                    />
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5">
              <button
                onClick={() => handleAuthNavigation("login")}
                className="border border-[#7c3aed] bg-transparent text-[#7c3aed] px-4 py-2 rounded font-semibold tracking-wide hidden sm:block hover:bg-[#7c3aed] hover:text-white transition-all duration-300 hover:scale-105"
              >
                Sign In
              </button>
              <button
                onClick={() => handleAuthNavigation("signup")}
                className="bg-[#fcd34d] border border-[#7c3aed] text-black px-4 py-2 rounded font-semibold tracking-wide hidden sm:block hover:bg-[#5b21b6] hover:text-white transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
        {/* ------------ sign up btn on mobile ------------ */}
        {!token && (
          <>
            <button
              onClick={() => handleAuthNavigation("signup")}
              className="bg-[#7c3aed] border border-[#7c3aed] text-white px-2.5 py-1.5 mr-3 rounded-[4px] font-semibold text-xs block sm:hidden active:scale-[90%] transition-all duration-100 ease-in select-none"
            >
              Sign Up
            </button>
          </>
        )}
        {/* --------------------------------- mobile menu ---------------------------- */}
        <div>
          {/* bar icon */}
          <Menu
            onClick={() => setShowMenu(true)}
            size={30}
            className="md:hidden text-[#7c3aed] ml-3 transition-all duration-300 hover:scale-110 cursor-pointer"
          />
          {/* overlay */}
          {showMenu && (
            <div
              className="fixed inset-0 bg-black/50 z-10 transition-opacity duration-300"
              onClick={() => setShowMenu(false)}
            />
          )}
          <div
            className={`menu-container ${
              showMenu
                ? "fixed w-full h-fit py-10 px-2 rounded-b-2xl flex opacity-100 translate-y-0"
                : "hidden opacity-0 -translate-y-5"
            } inset-0 top-0 z-20 overflow-hidden bg-white backdrop-blur-xl flex-col items-center justify-center pt-5 px-2 shadow-xl transition-all duration-300 ease-out`}
          >
            {/* close icon */}
            <div className="flex w-full items-center justify-end">
              <X
                size={30}
                onClick={() => setShowMenu(false)}
                className="mr-2 text-[#7c3aed] transition-all duration-300 hover:rotate-90 cursor-pointer"
              />
            </div>
            {/* navigation links */}
            <ul className="mt-10 uppercase flex flex-col-reverse items-center gap-7 text-base font-semibold min-w-full select-none text-[#7c3aed]">
              <NavLink 
                onClick={() => setShowMenu(false)} 
                to={"/"}
                className="relative group"
              >
                <p className="transition-all duration-200 group-hover:text-[#5b21b6]">
                  Home
                </p>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5b21b6] transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
              <NavLink 
                onClick={() => setShowMenu(false)} 
                to={"/doctors"}
                className="relative group"
              >
                <p className="transition-all duration-200 group-hover:text-[#5b21b6]">
                  All Doctors
                </p>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5b21b6] transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
              {token && (
                <>
                  <NavLink
                    onClick={() => setShowMenu(false)}
                    to={"/assessments"}
                    className="relative group"
                  >
                    <p className="transition-all duration-200 group-hover:text-[#5b21b6]">
                      Self-Assessment
                    </p>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5b21b6] transition-all duration-300 group-hover:w-full"></span>
                  </NavLink>
                  <NavLink
                    onClick={() => setShowMenu(false)}
                    to={"/my-assessments"}
                    className="relative group"
                  >
                    <p className="transition-all duration-200 group-hover:text-[#5b21b6]">
                      My Results
                    </p>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5b21b6] transition-all duration-300 group-hover:w-full"></span>
                  </NavLink>
                </>
              )}
              <NavLink 
                onClick={() => setShowMenu(false)} 
                to={"/about"}
                className="relative group"
              >
                <p className="transition-all duration-200 group-hover:text-[#5b21b6]">
                  About
                </p>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5b21b6] transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
              <NavLink 
                onClick={() => setShowMenu(false)} 
                to={"/contact"}
                className="relative group"
              >
                <p className="transition-all duration-200 group-hover:text-[#5b21b6]">
                  Contact
                </p>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5b21b6] transition-all duration-300 group-hover:w-full"></span>
              </NavLink>

              {/* go to Admin/doctor panel login */}
              {!token && (
                <NavLink
                  to={"https://prescripto-admin-ka03.onrender.com"}
                  target="_blank"
                >
                  <button className="mb-6 min-w-[124px] h-10 bg-[#7c3aed] text-white font-semibold rounded relative transition-all duration-300 hover:scale-105">
                    <span className="absolute top-1/2 -translate-y-1/2 left-3">
                      <WordRotate words={["Admin", "Doctor"]} />
                    </span>
                    <span className="absolute top-1/2 -translate-y-1/2 right-3">
                      Login
                    </span>
                  </button>
                </NavLink>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;