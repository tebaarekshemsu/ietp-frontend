import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Menu, X, Bell, ChevronDown } from 'react-feather';
import NotificationModal from './NotificationModal';

const Header = () => {
  const { isAuthenticated, logout, availableLayers, notifications } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLayerClick = (layer) => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false); // Close the menu after navigating
    navigate(`/hydroponic/${layer}`);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="bg-green-800 text-white shadow-md fixed top-0 left-0 right-0 h-16 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            Farm Monitor
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {isAuthenticated && (
              <>
                <Link to="/" className="hover:text-green-200">Dashboard</Link>
                <Link to="/soil" className="hover:text-green-200">Soil</Link>
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center hover:text-green-200"
                  >
                    Hydroponic <ChevronDown className="ml-1" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {availableLayers.length > 0 ? (
                          availableLayers.map((layer) => (
                            <button
                              key={layer}
                              onClick={() => handleLayerClick(layer)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                              role="menuitem"
                            >
                              Layer {layer}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-700">No layers available</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/add-device" className="hover:text-green-200">Add Device</Link>
              </>
            )}
          </nav>

          <div className="flex items-center">
            {isAuthenticated && (
              <>
                <div className="relative">
                  <button 
                    className="p-2 rounded-full hover:bg-green-700 ml-2"
                    onClick={() => setIsNotificationModalOpen(true)}
                  >
                    <Bell size={20} />
                  </button>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </div>
                <button onClick={logout} className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300">
                  Logout
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <button onClick={toggleMenu} className="md:hidden ml-4 p-2 rounded-md hover:bg-green-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            ref={menuRef}
            className="absolute top-0 right-0 h-full bg-green-900 text-black w-2/3 z-40 shadow-lg py-6 px-4"
          >
            {isAuthenticated && (
              <div className="space-y-4">
                <Link to="/" className="block py-2 hover:text-green-200">Dashboard</Link>
                <Link to="/soil" className="block py-2 hover:text-green-200">Soil</Link>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-between py-2 w-full hover:text-green-200"
                >
                  Hydroponic <ChevronDown className="ml-1" />
                </button>
                {isDropdownOpen && (
                  <div className="pl-4">
                    {availableLayers.length > 0 ? (
                      availableLayers.map((layer) => (
                        <button
                          key={layer}
                          onClick={() => handleLayerClick(layer)}
                          className="block py-2 text-sm hover:text-green-200 w-full text-left"
                        >
                          Layer {layer}
                        </button>
                      ))
                    ) : (
                      <div className="py-2 text-sm">No layers available</div>
                    )}
                  </div>
                )}
                <Link to="/add-device" className="block py-2 hover:text-green-200">Add Device</Link>
                <button
                  onClick={logout}
                  className="block mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        )}
      </div>
      <NotificationModal 
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
      />
    </header>
  );
};

export default Header;
