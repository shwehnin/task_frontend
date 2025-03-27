import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";
import { FaCaretDown } from "react-icons/fa";

const Navbar = () => {
  let navigate = useNavigate();
  let { user, dispatch } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Reference for detecting clicks outside the dropdown
  const dropdownRef = useRef(null);

  // Function to close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle link clicks and close menu
  const handleMenuClick = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed w-full bg-blue shadow-sm z-50 font-body">
      <div className="flex justify-between items-center p-5">
        <h1 className="font-bold text-2xl text-white">
          <NavLink to={`/`}>Task Management App</NavLink>
        </h1>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li className="text-white">
            <NavLink
              to={`/`}
              className={({ isActive }) =>
                isActive ? "text-white font-bold" : "hover:text-navHover"
              }
            >
              Task Board
            </NavLink>
          </li>
          <li className="text-white">
            <NavLink
              to={`/tasks/create`}
              className={({ isActive }) =>
                isActive ? "text-white font-bold" : "hover:text-navHover"
              }
            >
              Create Task
            </NavLink>
          </li>
          <li className="text-white">
            <NavLink
              to={`/tasks/calendar-view`}
              className={({ isActive }) =>
                isActive ? "text-white font-bold" : "hover:text-navHover"
              }
            >
              Task Calendar
            </NavLink>
          </li>

          {!user ? (
            <>
              <li className="text-white">
                <NavLink
                  to={`/register`}
                  className={({ isActive }) =>
                    isActive ? "text-white font-bold" : "hover:text-navHover"
                  }
                >
                  Register
                </NavLink>
              </li>
              <li className="text-white">
                <NavLink
                  to={`/login`}
                  className={({ isActive }) =>
                    isActive ? "text-white font-bold" : "hover:text-navHover"
                  }
                >
                  Login
                </NavLink>
              </li>
            </>
          ) : (
            <li className="relative text-white " ref={dropdownRef}>
              <button
                className="border border-blue px-3 py-2 rounded-md flex items-center gap-2 hover:text-navHover"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user?.name || "User"} <FaCaretDown className="text-white " />
              </button>

              {dropdownOpen && (
                <ul className="absolute top-12 right-0 w-24 bg-white text-black border-2 border-blue shadow-md rounded-md">
                  <li>
                    <button
                      onClick={() => {
                        dispatch({ type: "LOGOUT" });
                        localStorage.removeItem("user");
                        navigate("/login");
                        handleMenuClick();
                      }}
                      className="block w-full hover:rounded-md text-left px-4 py-2 hover:bg-navHover hover:text-white"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <FiX className="w-6 h-6 text-white" />
          ) : (
            <FiMenu className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Mobile Navigation Links */}
        {menuOpen && (
          <ul className="absolute top-16 left-0 w-full bg-blue md:hidden p-5 transition-all duration-300">
            <li>
              <NavLink
                to={`/`}
                onClick={handleMenuClick}
                className="block py-2 hover:text-navHover text-white"
              >
                Task Board
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/tasks/create`}
                onClick={handleMenuClick}
                className="block text-white py-2 hover:text-navHover"
              >
                Create Task
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/tasks/calendar-view`}
                onClick={handleMenuClick}
                className="block py-2 hover:text-navHover text-white"
              >
                Task Calendar
              </NavLink>
            </li>

            {!user ? (
              <>
                <li>
                  <NavLink
                    to={`/register`}
                    onClick={handleMenuClick}
                    className="block py-2 hover:text-navHover text-white"
                  >
                    Register
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/login`}
                    onClick={handleMenuClick}
                    className="block py-2 hover:text-navHover text-white"
                  >
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="relative" ref={dropdownRef}>
                <button
                  className="w-full text-left border border-grey300 px-3 py-2 rounded-md flex justify-between text-white"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {user?.name || "User"} <FaCaretDown />
                </button>

                {dropdownOpen && (
                  <ul className="mt-2 bg-white border-2 border-blue shadow-md rounded-md">
                    <li>
                      <button
                        onClick={() => {
                          dispatch({ type: "LOGOUT" });
                          localStorage.removeItem("user");
                          navigate("/login");
                          handleMenuClick();
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-grey"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
