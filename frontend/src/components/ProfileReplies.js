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
                     
                      { tweet: tweet.tweet.tweetId, userDetails: userProfileObj, contentData: tweet.tweet })); 
                     
                })
            }
        

        } catch (error) {
            console.error('error fetching replies:' , error)
        }
    };
  

    console.log('replies:', repliesObj)


useEffect(() => {
    fetchProfileReplies();
}, [])


const formatMonthAndDate = (createdAt) => {
  const date = new Date(createdAt);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
};


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
     <span className="comment-date"> • {formatMonthAndDate(tweet.contentData.createdAt)}</span>
     <p>
 <span className="comment-content" > {tweet.contentData.content}</span>
    

    </p>
  
   




</div>      
</div>

  ))}
  </div>
   </div>
  );

}
