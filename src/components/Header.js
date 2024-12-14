import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './AuthContext';
import { useHistory } from 'react-router-dom';
import user_logo from "../img/user_logo.svg";

const Header = () => {
  const { user, logout } = useAuth();
  const history = useHistory();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [user, history]);

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="header-container bg-success text-white">
      <h3 className="text-center header-title">PUBLIC GRIEVANCE PORTAL<p className='tagline'>(Automated Complaint Notifier)</p> </h3>
      {user && (
        <div className="user-menu">
          <div className="custom-dropdown" ref={dropdownRef}>
            <img
              src={user_logo}
              alt="User Logo"
              className="user-logo"
              onClick={toggleDropdown}
              style={{ cursor: 'pointer' }}
            />
            {dropdownOpen && (
              <div className="custom-dropdown-menu show" style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.5rem' }}>
                <a className="dropdown-item" href="/dashboard">Dashboard</a>
                <a className="dropdown-item" href="/viewhistory">History</a>
                <button className="dropdown-item" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
