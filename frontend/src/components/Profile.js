import React, { useState, useEffect } from 'react';
import '../styles/profilePage.css';
import instance from '../constants/axios';
import { toast, ToastContainer } from 'react-toastify';
import UserProfile from './UserProfile';

export default function Profile() {
  const [userProfileObj, setUserProfileObj] = useState({
    name: '',
    bio: '',
    profile_pic: '',
    cover_pic: '',
    username: '',
    joined_date: '',
    location : ''
  });

  const notify = (message) => toast.error(message);

  useEffect(() => {
    const fetchData = async () => {
      try {

        // access token from local storage
        const token = JSON.parse(localStorage.getItem('user')).token;
        // access username from local storage
        const username = JSON.parse(localStorage.getItem('user')).username;       
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // send request to backend to retrieve data and store it as response
        const response = await instance.get(`/profile/${username}`);
        // extract user_detaisl from the response    
        const userArray = response.data.user_details;
        if (userArray && userArray.length > 0) {
          //assigning the user details of the user
          const userData = userArray[0];
          console.log('user data:', userData);

          const joinedDate = new Date(userData.new_timestamp_column).toLocaleString('en-us', { month: 'long' }) + ' ' + new Date(userData.new_timestamp_column).getFullYear();





          //update the components state with extracted data from backend      
          setUserProfileObj({
            name: userData.name,
            username: userData.username,
            profile_pic: userData.profile_pic,
            cover_pic: userData.cover_pic,
            bio: userData.bio,
            joined_date : joinedDate,
            location : userData.location,

          });
        } else {
          
          notify('usr details not found');
        }
      } catch (error) {
        notify('error fetching details');
        console.error('error :', error);
      }
    };

    fetchData(); 
  }, []); 




  return (
    <div className="profileFeed">
    <div className="profile-box">
      <div className="cover-pic" style={{ backgroundImage: `url(${userProfileObj.cover_pic})` }}></div>
      <div className='profileDetail'>
        <UserProfile userProfileObj={userProfileObj}/>
     
     <div className="edit-profile"><button className="edit-profile">Edit Profile</button></div>

      </div>

      <div className="bio">{userProfileObj.bio}</div>

      

    
      <div className="joined-date">Joined {userProfileObj.joined_date}</div>
      <div className="location"> {userProfileObj.location}</div>
      <div className="following"></div>
      <div className="followers"></div>

      
      <ToastContainer />
    </div>
    <div className="views-box">
    <div className="views-container"><button className="posts">Posts</button></div>
    <div className="views-container"><button className="replies">Replies</button></div>
    <div className="views-container"><button className="likes">Likes</button></div>
    <div className="views-container"><button className="media">Media</button></div>

    </div>

    </div>
  );
}
