import React,{useEffect, useState} from 'react';
import '../styles/recommendation.css';
import instance from '../constants/axios';
import { requests } from '../constants/requests';
import { useNavigate } from 'react-router-dom'; 
import UserProfile from './UserProfile';
import FollowBtn from './FollowBtn';

export default function Recommendation() {
    const [userFollowedMap, setUserFollowedMap] = useState({});
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();
    // sending backend request to get recommendations
    const getRecommendations = async () => {
        try {
            // get token from local storage
            const token = JSON.parse(localStorage.getItem('user')).token;
            // set token in header
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // get recommendations
            const response = await instance.get(requests.getRecommendations);
            var result = response.data.uncommonFollowing;
            // set recommendations
            setRecommendations(result);
            // set userFollowedMap to false for all users
            result.forEach((user) => {
                setUserFollowedMap((prev) => {
                    return {...prev, [user._id]: false}
                })
            });

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getRecommendations();
    }, [])

  return (
    <div className='recommendation-container'>
        <div className='recommendation-header'>
            <span>You may like </span>
        </div>
        {
            // mapping through the recommendations
            recommendations.map((recommendation) => {
                return (
                    <div className='userDetails-container' >
                    <div onClick={()=>{navigate(`/profile/${recommendation.username}`)}} className='redirect-profile' >
                    <UserProfile key={`profile${recommendation._id}`}  userProfileObj={recommendation} searchbox={true} />
                    </div>
                    <div className='follow-container' > 

                    <FollowBtn
                    key={`follow${recommendation._id}`}
                    userFollowed={userFollowedMap[recommendation._id]}
                    setUserFollowed={(followState) => setUserFollowedMap(prevMap => ({ ...prevMap, [recommendation._id]: followState }))}
                    userProfileObj={recommendation}
                />
                </div>
                    </div>
                )
            })
        }
        
    </div>
  )
}
