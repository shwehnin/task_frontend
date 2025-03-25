import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  let navigate = useNavigate();
  let { user, dispatch } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to handle link clicks and close menu
  const handleMenuClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className='fixed top-0 left-0 w-full bg-white shadow-sm z-50 font-body'>
      <div className='flex justify-between items-center p-5'>
        <h1 className='font-bold text-2xl text-blue'>Task Management App</h1>

        <ul className="hidden md:flex space-x-6">
          <li><NavLink to={`/`} onClick={handleMenuClick} className={({isActive}) => isActive? "text-blue font-bold": "hover:text-blue"}>Home</NavLink></li>
            <li><NavLink to={`/tasks/create`} onClick={handleMenuClick} className={({isActive}) => isActive? "text-blue font-bold": "hover:text-blue"}>Create Task</NavLink></li>
            <li><NavLink to={`/tasks/calendar-view`} onClick={handleMenuClick} className={({isActive}) => isActive? "text-blue font-bold": "hover:text-blue"}>Task Calendar</NavLink></li>
            {!user ? (
              <>
                <li><NavLink to={`/register`} onClick={handleMenuClick} className={({isActive}) => isActive? "text-blue font-bold": "hover:text-blue"}>Register</NavLink></li>
                <li><NavLink to={`/login`} onClick={handleMenuClick} className={({isActive}) => isActive? "text-blue font-bold": "hover:text-blue"}>Login</NavLink></li>
              </>
            ) : (
              <>
                <li className='cursor-pointer'>{user?.name || "User"}</li>
                <li>
                  <button 
                    onClick={() => { 
                      dispatch({ type: 'LOGOUT' }); 
                      localStorage.removeItem("user"); 
                      navigate("/login");
                      handleMenuClick();
                    }} 
                    className={({isActive}) => isActive? "text-blue font-bold": "hover:text-blue"}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
        </ul>

        {/* Mobile Menu Button */}
        <button className='md:hidden' onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>

        {/* Mobile Navigation Links */}
        <ul className={`absolute top-16 left-0 w-full bg-white md:hidden p-5 transition-all duration-300 ${menuOpen ? "block" : "hidden"}`}>
          <li><NavLink to={`/`} onClick={handleMenuClick} className='block py-2 md:py-0 hover:text-blue'>Home</NavLink></li>
          <li><NavLink to={`/tasks/create`} onClick={handleMenuClick} className='block py-2 md:py-0 hover:text-blue'>Create Task</NavLink></li>
          <li><NavLink to={`/tasks/calendar-view`} onClick={handleMenuClick} className='block py-2 md:py-0 hover:text-blue'>Task Calendar</NavLink></li>
          {!user ? (
            <>
              <li><NavLink to={`/register`} onClick={handleMenuClick} className='block py-2 md:py-0 hover:text-blue'>Register</NavLink></li>
              <li><NavLink to={`/login`} onClick={handleMenuClick} className='block py-2 md:py-0 hover:text-blue'>Login</NavLink></li>
            </>
          ) : (
            <>
              <li className='block py-2 md:py-0 cursor-pointer'>{user?.name || "User"}</li>
              <li>
                <button 
                  onClick={() => { 
                    dispatch({ type: 'LOGOUT' }); 
                    localStorage.removeItem("user"); 
                    navigate("/login");
                    handleMenuClick();
                  }} 
                  className='block py-2 md:py-0 hover:text-blue'
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
