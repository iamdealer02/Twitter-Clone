import React, { useState } from 'react';
import '../styles/logout.css'; 
import instance from '../constants/axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = async () => {
    try {

      // send req to b/end  
      await instance.get('/auth/logout');
      localStorage.removeItem('user'); // remove from localStorage
      navigate('/');
      window.location.reload(); //reload for a fresh state
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleConfirmLogout = () => {
    setConfirmLogout(true);
  };

  const handleCancelLogout = () => {
    setConfirmLogout(false);
  };

  return (
    <div className="logout-container">
      {!confirmLogout && (
        <button className="logout-button" onClick={handleConfirmLogout}>
          Logout
        </button>
      )}
      {confirmLogout && (
        <div>
          <div className="overlay">
          <div className="logout-overlay">
            <div className="logout-confirm">
              <p>Are you sure you want to logout?</p>
              <button className="logout-confirm-button" onClick={handleLogout}>
                Yes
              </button>
              <button className="logout-cancel-button" onClick={handleCancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
  
};


export default Logout;
