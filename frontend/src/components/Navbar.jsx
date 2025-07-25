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
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    toast.info("Logged Out.");
  };

  // Handle click outside for profile menu
  useEffect(() => {
    const handleProfileClickOutside = (event) => {
      if (event.target.closest(".profile-menu-container") === null) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleProfileClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleProfileClickOutside);
    };
  }, [showProfileMenu]);

  // Handle click outside mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".menu-container") === null) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleAuthNavigation = (type) => {
    const currentPath = window.location.pathname;
    if (currentPath === "/login") {
      navigate(`/login?type=${type}`, { replace: true });
      window.location.reload();
    } else {
      navigate(`/login?type=${type}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        scrolled ? "shadow-md bg-[#8b5cf6]" : "bg-[#a78bfa]"
      }`}
      style={{
        background: scrolled 
          ? "linear-gradient(135deg, #8b5cf6 100%)" 
          : "linear-gradient(135deg, #a78bfa 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      {/* Logo */}
      <span className="text-xl font-bold text-purple-800 hidden md:block">
        MENTAL HEALTH
      </span>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-5 font-medium text-white">
        <NavLink to={"/"}>
          <li className="py-1 hover:text-[#fef08a] transition-colors">HOME</li>
        </NavLink>
        <NavLink to={"/doctors"}>
          <li className="py-1 hover:text-[#fef08a] transition-colors">
            ALL DOCTORS
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

        {!token && (
          <NavLink to={import.meta.env.VITE_ADMIN_PANEL_URL} target="_blank">
            <button className="px-3 py-2 border border-white bg-transparent text-white rounded flex items-center gap-1 hover:bg-white hover:text-[#a78bfa] transition-colors">
              <WordRotate words={["Admin", "Doctor"]} /> Login
            </button>
          </NavLink>
        )}
      </ul>

      {/* Auth Buttons/Profile */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="relative profile-menu-container">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <img
                className="w-8 h-8 sm:w-9 sm:h-9 rounded border object-cover"
                src={userData.image}
                alt="profile"
              />
              <ChevronDown
                size={18}
                className={`text-gray-500 transition-transform ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <button
                  onClick={() => {
                    navigate("my-profile");
                    setShowProfileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    navigate("my-appointments");
                    setShowProfileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Appointments
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-1"
                >
                  <span>Logout</span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleAuthNavigation("login")}
              className="border border-white bg-transparent text-white px-4 py-2 rounded hover:bg-white hover:text-[#a78bfa] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => handleAuthNavigation("signup")}
              className="bg-[#fef08a] border border-[#fef08a] text-[#7c3aed] px-4 py-2 rounded hover:bg-[#fde68a] transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Mobile Sign Up Button */}
        {!token && (
          <button
            onClick={() => handleAuthNavigation("signup")}
            className="sm:hidden bg-[#fef08a] text-[#7c3aed] px-3 py-1.5 rounded text-sm"
          >
            Sign Up
          </button>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMenu(true)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Open menu"
        >
          <Menu size={30} />
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMenu(false)}></div>
          <div className="relative bg-[#a78bfa] min-h-screen w-4/5 max-w-sm ml-auto shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <span className="text-xl font-bold text-purple-800">MENU</span>
              <button
                onClick={() => setShowMenu(false)}
                className="text-white focus:outline-none"
                aria-label="Close menu"
              >
                <X size={30} />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-4">
                <li>
                  <NavLink
                    to="/"
                    onClick={() => setShowMenu(false)}
                    className="block py-2 text-white hover:text-[#fef08a]"
                  >
                    HOME
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/doctors"
                    onClick={() => setShowMenu(false)}
                    className="block py-2 text-white hover:text-[#fef08a]"
                  >
                    ALL DOCTORS
                  </NavLink>
                </li>
                {token && (
                  <>
                    <li>
                      <NavLink
                        to="/assessments"
                        onClick={() => setShowMenu(false)}
                        className="block py-2 text-white hover:text-[#fef08a]"
                      >
                        SELF-ASSESSMENT
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/my-assessments"
                        onClick={() => setShowMenu(false)}
                        className="block py-2 text-white hover:text-[#fef08a]"
                      >
                        MY RESULTS
                      </NavLink>
                    </li>
                  </>
                )}
                <li>
                  <NavLink
                    to="/about"
                    onClick={() => setShowMenu(false)}
                    className="block py-2 text-white hover:text-[#fef08a]"
                  >
                    ABOUT
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    onClick={() => setShowMenu(false)}
                    className="block py-2 text-white hover:text-[#fef08a]"
                  >
                    CONTACT
                  </NavLink>
                </li>
              </ul>

              {!token && (
                <div className="mt-8">
                  <button
                    onClick={() => {
                      handleAuthNavigation("login");
                      setShowMenu(false);
                    }}
                    className="w-full mb-2 py-2 border border-white text-white rounded"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleAuthNavigation("signup");
                      setShowMenu(false);
                    }}
                    className="w-full py-2 bg-[#fef08a] text-[#7c3aed] rounded"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
