import React,  { useState, useEffect } from "react";
import '../styles/editProfile.css';
import instance from "../constants/axios";
import { toast, ToastContainer} from 'react-toastify';






export default function EditProfile() {
    const [userProfileObj, setUserProfileObj] = useState({
        name: '',
        bio: '',
        profile_pic: '',
        cover_pic: ''
       
      });

      const notify = (message) => toast.error(message);

      useEffect (() => {

        
      })


      








  return (
    <div>
      
    </div>
  )
}

