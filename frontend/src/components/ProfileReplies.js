import React, { useEffect, useState } from 'react'
import MiniUserDetail from './MiniUserDetail'
import UserProfile from './UserProfile';
import instance from '../constants/axios';
import { useParams } from 'react-router-dom';
import InteractionButtons from './interactionButtons';
import '../styles/profilePage.css'





export default function ProfileReplies({userProfileObj}) {
    

    const { username} = useParams();
    const [repliesObj, setRepliesObj] = useState([]);

    const fetchProfileReplies = async() => {
        try{
            const response = await instance.get(`/profile/replies/${username}`); 
            const repliesArray = response.data.replies;
            // set repliesObj as tweet and userDetail
            if (repliesArray.length > 0){
                setRepliesObj((prevTweets) => {
                
                    return repliesArray.map((tweet) => (
                      console.log(tweet.tweet.tweetId),
                      { tweet: tweet.tweet.tweetId, userDetails: userProfileObj }));  
                })
            }
         

        } catch (error) {
            console.error('error fetching replies:' , error)
        }
    };
  

    


useEffect(() => {
    fetchProfileReplies();
}, [])


return (
    
    <div>
      <div className="profile-post-list">
        
      {userProfileObj && repliesObj?.map((tweet, key) => (      

         <div className='profile-tweet-card'>
            <MiniUserDetail key={tweet.tweet._id}              
            user = {userProfileObj ? userProfileObj : null}           
            tweet={tweet.tweet}  
            createdAt={tweet.tweet.createdAt || tweet.tweet.tweetId.updatedAt} 
      />
      <InteractionButtons tweet={tweet} setTweets={setRepliesObj} quoteUpdate={false} userProfileObj={userProfileObj}/>

      <div className="comments">
     <UserProfile userProfileObj={userProfileObj} messagebox={true} searchbox={true}/>
     <p>
    <span className="comment-content">{tweet.tweet.content}</span>
    </p>
  
   




</div>      
</div>

  ))}
  </div>
   </div>
  );

}
