import React, { useEffect, useState } from 'react'
import MiniUserDetail from './MiniUserDetail'
import instance from '../constants/axios';
import { requests } from '../constants/requests' 
import { useParams } from 'react-router-dom';
import InteractionButtons from './interactionButtons';
import '../styles/tweetList.css'


export default function ProfilePost({userProfileObj}) {

  const {username} = useParams();
  const [postObj, setPostObj] = useState([]);

  const fetchProfilePosts = async () => {
      
    try{
      const response = await instance.get(`/profile/posts/${username}`); 

      const postArray = response.data.posts; 
  
      if (postArray.length > 0){
        
        setPostObj(postArray)
        
      }
    
      
    } catch (error) { 
      console.error('Error fetching tweets:', error);
    }
  };
  console.log(postObj)

  useEffect(() => {
    fetchProfilePosts();
  }, []);

  return (
    <div>
      <div className="tweet-list">


      {userProfileObj && postObj?.map((tweet, key) => (
        <div className='tweet-card'> 
            <MiniUserDetail key={tweet.tweet._id}
              
            user = {userProfileObj ? userProfileObj : null}
            tweet={tweet.tweet}  
            createdAt={tweet.tweet.createdAt || tweet.tweet.updatedAt} 
      />
      <InteractionButtons tweet={tweet} setTweets={setPostObj} userProfileObj={userProfileObj}/>
      </div>

  ))}
   </div>
   </div>
  );
}
