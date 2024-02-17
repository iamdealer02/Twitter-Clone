import React, { useEffect, useState } from 'react';
import '../styles/tweetList.css';
import MiniUserDetail from './MiniUserDetail';

const Tweet = ({ tweet, setTweets }) => {
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    const checkMedia = async () => {
      // checking if media is image or video
      if (tweet.media) {
        const mediaType = tweet.media.split('.').pop();
        if (mediaType === 'mp4') {
          setIsVideo(true);
        }
      }
    };

    checkMedia();
  }, [tweet.media]);

  return (
    <div className="tweet-content">
      <span>{tweet.tweet}</span>
      <div className='currentSelection'>

        {isVideo && tweet.media ?     <div>
          <video controls style={{ width: '100%' }}>
        <source src={tweet.media} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div> : null}
        {!isVideo && tweet.media?  <img src={tweet.media} alt="media" /> : null}
        {tweet.gif ?  <img src={tweet.gif} alt="gif"/> : null}
      </div>
      {/* check if the tweet is reposted and post the old tweet if it is we will recall this component */}
      {tweet.is_repost ? (
        <div className='repost-tweet'>
          <MiniUserDetail
            tweet={tweet.reposted_from?.tweet}
            user={tweet.reposted_from?.userDetails}
            createdAt={tweet.reposted_from?.tweet?.createdAt}
            setTweets={setTweets}
          />  
        </div>
      ) : null}
    </div>
  );
};

export default Tweet;
