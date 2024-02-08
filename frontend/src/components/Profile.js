import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/profilePage.css';
import instance from '../constants/axios';
import { toast, ToastContainer } from 'react-toastify';
import UserProfile from './UserProfile';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate();
  const [userProfileObj, setUserProfileObj] = useState({
    name: '',
    bio: '',
    profile_picture: '',
    cover_picture: '',
    username: '',
    joined_date: '',
    location : '',
    followers:  [],
    following: []
  });
  const [userValid, setUserValid] = useState(false)
  const [userFollowed, setUserFollowed] = useState(false)
  const {username} = useParams();

  const notify = (message) => toast.error(message);
  


  
  useEffect(() => {
    const fetchData = async () => {
      try {

        // // access token from local storage
        const token = JSON.parse(localStorage.getItem('user')).token;
        // access username from local storage
       if ( username === JSON.parse(localStorage.getItem('user')).username     )  {
        setUserValid(true)
       }
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // send request to backend to retrieve data and store it as response
    
        const response = await instance.get(`/profile/${username}`);
       
        // extract user_detaisl from the response    
        const userArray = response.data.user_details;
        if (userArray && userArray.length > 0) {
          //assigning the user details of the user
          const userData = userArray[0];
          console.log('user data:', userData);


          // const imgData = userData.cover_picture.data;
          // console.log("data:  ", imgData)
          // console.log('cover pic data: ', userData.cover_picture.data)

         
          const joinedDate = new Date(userData.new_timestamp_column).toLocaleString('en-us', { month: 'long' }) + ' ' + new Date(userData.new_timestamp_column).getFullYear();

          // const coverPicBuffer = Buffer.from(userData.cover_picture.data);

          // const base64 = btoa(coverPicBuffer)
          // console.log('bin data', base64);
          // const base64Cover = `data:${userData.cover_picture.contentType};base64,${coverPicBuffer.toString('base64')}`;
          
          
          //update the components state with extracted data from backend      
          setUserProfileObj({
            name: userData.name,
            username: userData.username,
            profile_picture: userData.profile_picture,
            cover_picture: userData.cover_picture,
            bio: userData.bio,
            joined_date : joinedDate,
            location : userData.location,
            followers: userData.followers ,
            following: userData.following 

          });

          const isFollowed = userData.following.includes(username) ;
          setUserFollowed(isFollowed)

        
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
    <div className="cover-picture">
    {userProfileObj.cover_picture && (
        <img src={userProfileObj.cover_picture} alt="Cover" />)}
    </div>

      <div className='profileDetail'>
        <UserProfile userProfileObj={userProfileObj}/>

        { userValid ?   <div className="edit-profile"><button className="edit-profile" onClick={ () => navigate(`/profile/edit/${username}`)}>Edit Profile</button></div> : 
        (
          <div className="followers">Follow</div>
        )
         }
     
   

      </div>

      <div className="bio">{userProfileObj.bio}</div>

      <div className="joined-date">Joined {userProfileObj.joined_date}</div>
      <div className="location"> {userProfileObj.location}</div>
      {/* <div className="followers-followings"> {userProfileObj.following.length} Followers   {userProfileObj.followers.length} Followings

</div> */}


      
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