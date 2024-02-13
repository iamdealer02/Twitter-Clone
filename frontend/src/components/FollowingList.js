import React, { useState, useEffect } from 'react';
import '../styles/followingFollowersList.css'
import { useParams } from 'react-router-dom';
import instance from '../constants/axios';
import { toast } from 'react-toastify';
import { useLocation} from 'react-router-dom';

export default function FollowingList() {
    const { username} = useParams();
    const [ followingList, setFollowingList] = useState([]);
    const { pathname } = useLocation();

    useEffect (() => {
        const fetchFollowing = async () => {
            try {
                const response = await instance.get(`/profile/${username}/following`);
                const { following_details  } = response.data;
                setFollowingList(following_details )


            } catch (error) {
                console.error('Error fetching following:', error);
                notify('Error fetching following');
            }
        };
        fetchFollowing();
    }, []);

    const notify = (message) => {
        toast.error(message);
    };

  return (
  
        <div className="following-feed">
                <div className="go-back">
                <a href={`/profile/${username}`} className="go-back">&#8592; Go Back</a>
                </div>
            <div className="followers-following-tag">
            <a href={`/profile/${username}/following`} className={`following-tag ${pathname === `/profile/${username}/following` ? 'active' : ''}`}>Following</a>
            <a href={`/profile/${username}/followers`} className={`followers-tag ${pathname === `/profile/${username}/followers` ? 'active' : ''}`}>Followers</a>
            </div>
       
        <div className="followings">
        {followingList.map((following, id) => (
            <a href={`/profile/${following.username}`} key={id} className="user-link">
            <div className="user-details">
                <div className="profile-picture">

                        <img src={following.profile_picture} alt='profile' /> 
                </div>
                <div className="user-credentials">
                { following.name ? <div className='fullname'>{following.name}</div> : null }
                    <div className='username'> @ {following.username}</div>


                </div>
      
                </div>
                </a>
                ))}
               
        </div>
            

            
            </div>
      

  )
}
