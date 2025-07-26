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

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between text-sm py-4 bg-[#a78bfa] transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
      style={{
        background: "#7c3aed",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      {/* Logo */}
     
  
  <img
    src="logoo.png"
    alt="Logo"
     style={{ 
              maxWidth: '23%', 
              height: 'auto',
               
            }}
  />

 
 

      {/* Navigation Links */}
      <ul className="hidden md:flex items-center gap-5 font-medium text-white text-base">
        <NavLink to={"/"}>
          <li className="py-1 hover:text-[#fef08a] transition-colors">HOME</li>
        </NavLink>
        <NavLink to={"/services"}>
          <li className="py-1 hover:text-[#fef08a] transition-colors">SERVICES</li>
        </NavLink>
        <NavLink to={"/doctors"}>
          <li className="py-1 hover:text-[#fef08a] transition-colors">
            EXPERTS
          </li>
        </NavLink>
        <NavLink to={"/ourTeam"}>
          <li className="py-1 hover:text-[#fef08a] transition-colors">
            OUR TEAM
          </li>
        </NavLink>
        {token && (
          <>
            <NavLink to={"/assessments"}>
              <li className="py-1 hover:text-[#fef08a] transition-colors">
                SELF-ASSESSMENT
              </li>
            </NavLink>
            <NavLink to={"/my-assessments"}>
              <li className="py-1 hover:text-[#fef08a] transition-colors">
                MY RESULTS
              </li>
            </NavLink>
          </>
        )}
        <NavLink to={"/about"}>
          <li className="py-1 hover:text-[#fef08a] transition-colors">ABOUT</li>
        </NavLink>
        <NavLink to={"/contact"}>
          <li className="py-1 hover:text-[#fef08a] transition-colors">
            CONTACT
          </li>
        </NavLink>

        {/* Admin/Doctor Login Button */}
        {!token && (
          <NavLink to={import.meta.env.VITE_ADMIN_PANEL_URL} target="_blank">
            <button className="px-3 py-2 w-fit border border-white bg-transparent text-white rounded flex items-center gap-1 hover:bg-white hover:text-[#a78bfa] transition-colors">
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
              {/* ... (keep existing profile dropdown code) ... */}
              <div className="flex items-center gap-px sm:gap-1">
                <img
                  className="size-8 sm:size-9 aspect-square object-cover rounded-[5px] border"
                  src={userData.image}
                  alt="profile pic"
                />
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform duration-300 ease-in-out ${
                    showProfileMenu ? "-rotate-180" : "rotate-0"
                  }`}
                />
              </div>
              <div
                className={`absolute top-0 right-0 pt-12 text-base font-medium text-black z-20 ${
                  showProfileMenu ? "block" : "hidden"
                } motion-translate-x-in-[0%] motion-translate-y-in-[-5%] motion-duration-[0.26s] motion-ease-linear`}
              >
                <div className="min-w-48 bg-gray-100 border border-gray-200 rounded-[7px] text-[15px] font-normal flex flex-col gap-1 p-2">
                  <p
                    onClick={() => navigate("my-profile")}
                    className="px-2 py-1 rounded hover:bg-black/5 transition-colors duration-200 ease-in cursor-pointer"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("my-appointments")}
                    className="px-2 py-1 rounded hover:bg-black/5 transition-colors duration-200 ease-in cursor-pointer"
                  >
                    My Appointments
                  </p>
                  <hr className="my-[1px] mx-2 rounded-full" />
                  <p
                    onClick={logout}
                    className="px-2 py-1 rounded hover:text-red-500 hover:bg-black/5 transition-all duration-100 ease-in cursor-pointer w-full flex items-center justify-start gap-1 group"
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
                className="border border-white bg-transparent text-white px-4 py-2 rounded font-normal tracking-wide hidden sm:block hover:bg-white hover:text-[#a78bfa] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => handleAuthNavigation("signup")}
                className="bg-[#FCD34D] border border-[#fef08a] text-[#7c3aed] px-4 py-2 rounded font-normal tracking-wide hidden sm:block hover:bg-[#fde68a] transition-colors"
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
              className="bg-primary border border-primary text-white px-2.5 py-1.5 mr-3 rounded-[4px] font-normal text-xs block sm:hidden active:scale-[90%] transition-transform duration-100 ease-in select-none"
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
            className="md:hidden text-white ml-3"
          />
          {/* overlay */}
          {showMenu && (
            <div
              className="fixed inset-0 bg-black/50 z-10"
              onClick={() => setShowMenu(false)}
            />
          )}
          <div
            className={`menu-container ${
              showMenu
                ? "fixed w-full h-fit py-10 px-2 rounded-b-2xl flex"
                : "hidden"
            } inset-0 top-0 z-20 overflow-hidden bg-[#a78bfa] backdrop-blur-xl flex-col items-center justify-center pt-5 px-2 shadow-xl`}
          >
            {/* close icon */}
            <div className="flex w-full items-center justify-end">
              <X
                size={30}
                onClick={() => setShowMenu(false)}
                className="mr-2 text-primary"
              />
            </div>
            {/* navigation links */}
            <ul className="mt-10 uppercase flex flex-col-reverse items-center gap-7 text-base font-medium min-w-full select-none">
              <NavLink onClick={() => setShowMenu(false)} to={"/"}>
                <p>Home</p>
                <hr className="border-none outline-none h-0.5 bg-primary w-full rounded-full m-auto hidden" />
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to={"/doctors"}>
                <p>All Doctors</p>
                <hr className="border-none outline-none h-0.5 bg-primary w-full rounded-full m-auto hidden" />
              </NavLink>
              {token && (
                <>
                  <NavLink
                    onClick={() => setShowMenu(false)}
                    to={"/assessments"}
                  >
                    <p>Self-Assessment</p>
                    <hr className="border-none outline-none h-0.5 bg-primary w-full rounded-full m-auto hidden" />
                  </NavLink>
                  <NavLink
                    onClick={() => setShowMenu(false)}
                    to={"/my-assessments"}
                  >
                    <p>My Results</p>
                    <hr className="border-none outline-none h-0.5 bg-primary w-full rounded-full m-auto hidden" />
                  </NavLink>
                </>
              )}
              <NavLink onClick={() => setShowMenu(false)} to={"/about"}>
                <p>About</p>
                <hr className="border-none outline-none h-0.5 bg-primary w-full rounded-full m-auto hidden" />
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to={"/contact"}>
                <p>Contact</p>
                <hr className="border-none outline-none h-0.5 bg-primary w-full rounded-full m-auto hidden" />
              </NavLink>

              {/* go to Admin/doctor panel login */}
              {!token && (
                <NavLink
                  to={"https://prescripto-admin-ka03.onrender.com"}
                  target="_blank"
                >
                  <button className="mb-6 min-w-[124px] h-10 bg-primary text-white font-normal rounded relative">
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
