import React from 'react'; 
import '../styles/tweetList.css';
import MiniUserDetail from './MiniUserDetail';
import InteractionButtons from './interactionButtons';


const TweetList = ({tweets, setTweets, userProfileObj}) => {

  return (
    <div className="news-feed">
        <div className="tweet-list"> 
          {tweets ? tweets.map((tweet) => ( 
            
            <div key={tweet.tweet._id}  className='tweet-card'>
            
              <MiniUserDetail  user={tweet.userDetails} tweet={tweet.tweet} createdAt={tweet.tweet.createdAt || tweet.tweet.updatedAt} setTweets={setTweets} userProfileObj={userProfileObj} />
              <InteractionButtons    tweet={tweet} userProfileObj = {userProfileObj} setTweets={setTweets} />  
              
            </div>
          )) : 
          <p>No tweets to display</p>}
        </div>

    </div>
  );
};

export default TweetList;
