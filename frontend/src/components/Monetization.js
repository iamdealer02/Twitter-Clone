import React, { useState, useEffect } from 'react'
import '../styles/settings.css'
import { useNavigate } from 'react-router-dom'
import instance from '../constants/axios';

export default function Monetization() {
    const username = JSON.parse(localStorage.getItem('user')).username;
    const navigate = useNavigate();




    const [ isMonitized, setIsMonetized] = useState(false);



  return (
    <div>
      
    </div>
  )
}
