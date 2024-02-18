import React, { useEffect, useState } from 'react'
import MiniUserDetail from './MiniUserDetail'
import instance from '../constants/axios';
import { useParams } from 'react-router-dom';
import InteractionButtons from './interactionButtons';
import '../styles/profilePage.css'


export default function ProfileLike({userProfileObj}) {
    const { username} = useParams();
    const [ likesObj, setLikesObj] = useState([]);

    const fetchProfileLikes = async () => {
        try{
            const response = await instance.get(`/profile/likes/${username}`); 
            const likesArray = response.data.likes;
            if ( likesArray.length > 0){
               
                    setLikesObj((prevTweets) => {
                        return likesArray.map((tweet) => (
                            { tweet: tweet.tweet.tweetId, userDetails: userProfileObj, contentData: tweet.tweet}
                        ));

                    })
               
            }

        }catch (error){
            console.error('error fetching likes: ', error)

        }
    };

    console.log('likes:', likesObj)

    useEffect(() => {
        fetchProfileLikes();
    }, [])



  return (
    <div>
        <div className="profile-post-list">
            {userProfileObj && likesObj?.map((tweet, key) => (
                <div className="profile-tweet-card">
                    <MiniUserDetail key={tweet.tweet._id}              
                            user = {userProfileObj ? userProfileObj : null}           
                            tweet={tweet.tweet}  
                            createdAt={tweet.tweet.createdAt || tweet.tweet.tweetId.updatedAt} 
                    />
                    <InteractionButtons tweet={tweet} setTweets={setLikesObj} quoteUpdate={false} userProfileObj={userProfileObj}/>





                </div>
            ))}
        </div>
      
    </div>
  )
}
