import React, { useState, useEffect } from 'react';
import '../styles/followingFollowersList.css'
import { useParams } from 'react-router-dom';
import instance from '../constants/axios';
import { toast } from 'react-toastify';
import { useLocation} from 'react-router-dom';
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';


export default function FollowersList() {
    
    const navigate = useNavigate();
    const { username } = useParams();
    const [followersList, setFollowersList] = useState([]);
    const { pathname } = useLocation();

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await instance.get(`/profile/${username}/followers`);
                const { followersList } = response.data;

                setFollowersList(followersList);
            } catch (error) {
                console.error('Error fetching followers:', error);
                notify('Error fetching followers');
            }
        };

        fetchFollowers();
    }, [username]); 

    const notify = (message) => {
        toast.error(message);
    };

    return (
            <div className="followers-feed">
                <div className="go-back">
                <a href={`/profile/${username}`} className="go-back">&#8592; Go Back</a>
                </div>
                <div className="followers-following-tag">
            <a href={`/profile/${username}/following`} className={`following-tag ${pathname === `/profile/${username}/following` ? 'active' : ''}`}>Following</a>
            <a href={`/profile/${username}/followers`} className={`followers-tag ${pathname === `/profile/${username}/followers` ? 'active' : ''}`}>Followers</a>
        </div>
           
            <div className="followers">

            {followersList.map((follower, id) => (
            <div className="user-details" onClick= {()=> {navigate( `/profile/${follower.username}`)}} >
                <div className='following-tag'>
                <UserProfile userProfileObj={follower} searchbox={true} messagebox={false} />
             
                    </div>
                </div>
            

                ))}

        </div>
            
      
                </div>

    )
}
