import React from 'react';
import '../styles/tweetList.css';
import MiniUserDetail from './MiniUserDetail';

const Tweet = ({ tweet, setTweets }) => {

  let base64 = null;
  if (tweet.media?.data){
    // changing from buffer to base64
     base64 = btoa(
      new Uint8Array(tweet.media.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        '',
      ),
    );

  }

  return (
    <div className="tweet-content">
      <p>{tweet.tweet}</p>
      {tweet.media?.data ? <img src={base64} alt="media"/> : null}
      {tweet.gif ?  <img src={tweet.gif} alt="gif"/> : null}
      {/* check if the tweet is reposted and post the old tweet if it is we will recall this component */}
      {
  tweet.is_repost ? (
    <div className='repost-tweet'>
      <MiniUserDetail
        tweet={tweet.reposted_from?.tweet}
        user={tweet.reposted_from?.userDetails}
        createdAt={tweet.reposted_from?.tweet?.createdAt}
        setTweets={setTweets}
      />  
    </div>
  ) : null
}

      
    </div>
  );
};

export default Tweet;
