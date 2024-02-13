import React from 'react'
import '../styles/miniUserDetails.css'
import Tweet from './Tweet'
import Poll from './Poll'

export default function MiniUserDetail({ user,tweet, createdAt, userProfileObj,setTweets }) { // Destructure 'user' from props
    // single tweet object
    const { userProfilePic, name, username } = user;
    // function to display the date / hours ago
    const timeAgo = (date) => {
        const now = new Date();
        const time = new Date(date);
        const diff = now - time;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        // if its more than two days we return the date
        if (days > 2) return time.toDateString();
        if (days > 0) return days + 'd';
        if (hours > 0) return hours + 'h';
        if (minutes > 0) return minutes + 'm';
        if (seconds > 0) return seconds + 's';
        return 'now';
    };
    const date = timeAgo(createdAt);
    return (
        <div className='tweet-Body'>
        <div className='userDetails'>
            <div className='profilePic'>
                {userProfilePic   ?  
                    <img src={userProfilePic} alt='profile' /> : 
                    <img src='https://cdn-icons-png.flaticon.com/128/64/64572.png' alt='default profile' /> 
                }
            </div>
            <div className='userCredential'>
                {user.name ? <div className='fullname'>{name}</div> : <div className='fullname'>{username} </div>}
                <div className='userName'> @ {username}</div>
                <div className='createdAt'>.{date}</div>
            </div> 
        </div>
        
        {
                tweet?.is_poll ? (<Poll  tweet={tweet} tweet_id={tweet._id} setTweets={setTweets} userProfileObj={userProfileObj} />) : 
                <Tweet tweet={tweet} setTweets={setTweets} />
            
              }    
        </div>
    );
}