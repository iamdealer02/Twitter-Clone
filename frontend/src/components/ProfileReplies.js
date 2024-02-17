import React, { useEffect, useState } from 'react'
import MiniUserDetail from './MiniUserDetail'
import UserProfile from './UserProfile';
import instance from '../constants/axios';
import { requests } from '../constants/requests' 
import { useParams } from 'react-router-dom';
import InteractionButtons from './interactionButtons';
import '../styles/profilePage.css'



function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.toLocaleString('default', {day: 'numeric'}) ;
    return `${month}  ${day}`;
  }

export default function ProfileReplies({userProfileObj}) {
    

    console.log( 'wicv', userProfileObj)
    const { username} = useParams();
    const [repliesObj, setRepliesObj] = useState([]);

    const fetchProfileReplies = async() => {
        try{
            const response = await instance.get(`/profile/replies/${username}`); 
           

            const repliesArray = response.data.replies;

            console.log(repliesArray)
            if (repliesArray.length > 0){
                setRepliesObj(repliesArray)
            }

        } catch (error) {
            console.error('error fetching replies:' , error)
        }
    };
    console.log( 'replies',repliesObj)

    


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
            tweet={tweet.tweet.tweetId}  
            createdAt={tweet.tweet.tweetId.createdAt || tweet.tweet.tweetId.updatedAt} 
      />
      <InteractionButtons tweet={tweet} setTweets={setRepliesObj} userProfileObj={userProfileObj}/>

      <div className="comments">
      <div className="comment-profile">
        {userProfileObj.profile_picture? 
        <img src={userProfileObj.profile_picture} alt="pfp"/>
        :
        <img src='https://cdn-icons-png.flaticon.com/128/64/64572.png' alt='default profile' /> }
      </div>
      <div className="comment-details">
  <span className="comment-name">{userProfileObj.name}</span>
  <span className="comment-username">@{userProfileObj.username}</span>
  
  <span className="comment-date">{formatDate(tweet.tweet.createdAt)}</span>

  </div>
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
