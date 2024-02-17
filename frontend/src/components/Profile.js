import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/profilePage.css';
import instance from '../constants/axios';
import { toast, ToastContainer } from 'react-toastify';
import UserProfile from './UserProfile';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';
import ProfilePost from './ProfilePost';
import ProfileReplies from './ProfileReplies';

export default function Profile() {
  const navigate = useNavigate();
  const {username} = useParams();

  const [userProfileObj, setUserProfileObj] = useState({});

  const [userValid, setUserValid] = useState(false)
  const [userFollowed, setUserFollowed] = useState(false)  

  const [activeTab, setActiveTab] = useState('posts');

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
          console.log('res',userData)
         
          const joinedDate = new Date(userData.new_timestamp_column).toLocaleString('en-us', { month: 'long' }) + ' ' + new Date(userData.new_timestamp_column).getFullYear();

          //update the components state with extracted data from backend      
          setUserProfileObj({
            _id: userData?._id,           
            name: userData?.name,
            username: userData?.username,
            profile_picture: userData?.profile_picture,
            cover_picture: userData?.cover_picture,
            bio: userData?.bio,
            joined_date : joinedDate,
            location : userData?.location,
            followers: userData?.followers ,
            following: userData?.following 

          });

          const current_user = JSON.parse(localStorage.getItem('user')).username;
          // console.log(current_user)
          const logged_in_user = await instance.get(`/profile/${current_user}`); 
          const loggedInUserArray = logged_in_user.data.user_details;
         

          if (loggedInUserArray && loggedInUserArray.length > 0) {
            //assigning the user details of the user
            const loggedInUserData = loggedInUserArray[0];
            const loggedInUserId = loggedInUserData._id
   
  


          if ( userData.followers.includes(loggedInUserId)){
            setUserFollowed(true)
          }
        }


        
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


  const handleFollow = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
 
      const postFollow = await instance.post(`/profile/follow/${userProfileObj._id}`, {});
      setUserFollowed(!userFollowed); 
      window.location.reload();


    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };


  const handleFollowersClick = () => {
    navigate(`/profile/${username}/followers`);
  };

  const handleFollowingClick = () => {
      navigate(`/profile/${username}/following`);
  };


  const handleClick = (tab) => {
    setActiveTab(tab);
  };



  return (
    <div className="profileFeed">
    <div className="profile-box">
    <div className="cover-picture">
    {userProfileObj?.cover_picture && (
        <img src={userProfileObj?.cover_picture} alt="Cover" />)}
    </div>

      <div className='profileDetail'>
        <UserProfile userProfileObj={userProfileObj}/>

        {userValid ? (
  <div className="edit-profile">
    <button className="edit-profile" onClick={() => navigate(`/profile/edit/${username}`)}>Edit Profile</button>
  </div>
) : (
  <div className={userFollowed ? "following-btn" : "follow-btn"}>
    <button onClick={handleFollow}>{userFollowed ? 'Following' : 'Follow'}</button>
  </div>
)}

      </div>

      <div className="bio">{userProfileObj?.bio}</div>

      <div className="joined-date">Joined {userProfileObj?.joined_date}</div>
      <div className="location"> {userProfileObj?.location}</div>
      <div className="followers-followings" onClick={handleFollowingClick}>
                {userProfileObj?.following?.length} Following
            </div>
            <div className="followers-followings" onClick={handleFollowersClick}>
                {userProfileObj?.followers?.length} Followers
            </div>


      
      <ToastContainer />
    </div>
   
    <div>
      <div className="tab-buttons">
        <button
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => handleClick('posts')}
        >
          Posts
        </button>
        <button
          className={activeTab === 'replies' ? 'active' : ''}
          onClick={() => handleClick('replies')}
        >
          Replies
        </button>
        <button
          className={activeTab === 'likes' ? 'active' : ''}
          onClick={() => handleClick('likes')}
        >
          Likes
        </button>
        <button
          className={activeTab === 'media' ? 'active' : ''}
          onClick={() => handleClick('media')}
        >
          Media
        </button>
      </div>

      {activeTab === 'posts' && <ProfilePost userProfileObj={userProfileObj} />}
      {activeTab === 'replies' && <ProfileReplies userProfileObj={userProfileObj} />}
      {/* {activeTab === 'likes' && <ProfileLikes />}
      {activeTab === 'media' && <ProfileMedia />} */}
    </div>
    <div className="views-container">
      

      </div>

  

    </div>

  );
}