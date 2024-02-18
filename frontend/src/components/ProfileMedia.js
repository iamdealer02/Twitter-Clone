import React, { useEffect, useState } from 'react'
import MiniUserDetail from './MiniUserDetail'
import instance from '../constants/axios';
import { useParams } from 'react-router-dom';
import InteractionButtons from './interactionButtons';
import '../styles/profilePage.css'


export default function ProfileMedia({ userProfileObj}) {
    const { username} = useParams();
    const [ mediaObj, setMediaObj ] = useState([]);

    const fetchProfileMedia = async() => {
        try{
            const response = await instance.get(`/profile/media/${username}`); 
            const mediaArray = response.data.medias;
            console.log('array', mediaArray)


            if (mediaArray.length > 0){        
                setMediaObj((prevTweets) => {
                  // setting userDetail to the tweet
                  return mediaArray.map((tweet) => (
                    { tweet: tweet.tweet || null,
                    userDetails: userProfileObj, 
                    contentData: tweet.tweet }));  
                
              })
              }
         
        } catch (error) { 
            console.error('Error fetching media:', error);
          }
    };

    console.log('med', mediaObj)

    useEffect(() => {
        fetchProfileMedia();
      }, []);


  return (
    <div>
        <div className="profile-post-list">
                  { userProfileObj && mediaObj?.map (( tweet, key) => (
                <div className='tweet-card'> 
                <MiniUserDetail 
                    key={tweet.tweet._id}
                    user={userProfileObj ? userProfileObj : null}
                    tweet={tweet.tweet }  
                    createdAt={tweet.tweet.createdAt || tweet.tweet.updatedAt} 
                />
                <InteractionButtons tweet={tweet} setTweets={setMediaObj} quoteUpdate={false} userProfileObj={userProfileObj}/>
                </div>



            ))}
        </div>
      
    </div>
  )
}
