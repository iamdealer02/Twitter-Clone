import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/profilePage.css';
import instance from '../constants/axios';
import { toast, ToastContainer } from 'react-toastify';
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';
import ProfilePost from './ProfilePost';
import ProfileReplies from './ProfileReplies';
import FollowBtn from './FollowBtn';

export default function Profile() {
  const navigate = useNavigate();
  const {username} = useParams();

  const [userProfileObj, setUserProfileObj] = useState({});

  const [userValid, setUserValid] = useState(false)
  const [userFollowed, setUserFollowed] = useState(false)

  const [activeTab, setActiveTab] = useState('posts');
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  const notify = (message) => toast.error(message);


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
        console.log(userData)

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
        setFollowerCount(userData?.followers?.length)
        setFollowingCount(userData?.following?.length)

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

  
  useEffect(() => {
    fetchData();
  }, [username]);


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

        { 
                    userValid ? (
                        <div className="edit-profile">
                            <button className="edit-profile" onClick={() => navigate(`/profile/edit/${username}`)}>Edit Profile</button>
                        </div>
                    ) : userProfileObj._id !== null && userProfileObj._id !== undefined ?(
                      <div>
                        <FollowBtn userFollowed={userFollowed} setUserFollowed={setUserFollowed} userProfileObj={userProfileObj} setFollowerCount={setFollowerCount} followerCount={followerCount} />
                     </div>
                    )   : null
                }

      </div>

      <div className="bio">{userProfileObj?.bio}</div>

      <div className="joined-date">Joined {userProfileObj?.joined_date}</div>
      <div className="location"> {userProfileObj?.location}</div>
      <div className="followers-followings" onClick={handleFollowingClick}>
                {followingCount} Following
            </div>
            <div className="followers-followings" onClick={handleFollowersClick}>
                {followerCount} Followers
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