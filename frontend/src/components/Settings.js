import React, { useState, useEffect } from 'react'
import '../styles/settings.css'
import { useNavigate } from 'react-router-dom'
import instance from '../constants/axios';


export default function Settings() {
    const username = JSON.parse(localStorage.getItem('user')).username;
    const navigate = useNavigate();


    const [ isMonitized, setIsMonetized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchMonetizationStatus = async () => {
            try {
                const response = await instance.get(`/settings/monetizationStatus/${username}`);
                setIsMonetized(response.data.isMonetized);
            } catch (error) {
                console.error('Error fetching monetization status:', error);
            }
            setLoading(false);
        };

        fetchMonetizationStatus();
    }, [username]);

    const handleMonetization = async () => {
        try {
            const response = await instance.put(`/settings/updateMonetizationStatus/${username}`);
            setIsMonetized(response.data.isMonetized);
        } catch (error) {
            console.error('Error toggling monetization status:', error);
        }
    };


  return (
    <div>

        <div className="settingsFeed">
            <div className="settings-box">
         
            <h3>Settings</h3>
            </div>

            <div className="settings-content">
            
            <div className="account-info" onClick={ () => navigate(`/profile/edit/${username}`)}>
                Your account
            </div>


            <div className="change-password">
                Change password
            </div>
 
            <div className="monetization" onClick={ () => navigate(`/settings/updateMonetizationStatus/${username}`)}>
                Monetization
            </div>

            


            </div>
            </div>  
           
     
      
    </div>
  )
}
