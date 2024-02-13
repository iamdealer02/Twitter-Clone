import React from 'react';
import { requests} from '../constants/requests';
import instance from '../constants/axios';

export default function RetweetPopUpBox({retweetOption, setRetweetOption, handleQuote, tweetId, setTweets, retweeted}) {
  const retweet = () => {
    // send tweetId to backend
    // close the retweetOption
    setRetweetOption(!retweetOption)
    const token = JSON.parse(localStorage.getItem('user')).token;
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    instance.post(requests.retweet + '/' + tweetId)
    .then(response => {
      setTweets(prevTweets => {
        return prevTweets.map(tweetItem => {
            if (tweetItem.tweet._id === tweetId) {
                return {
                    ...tweetItem,
                    tweet: {
                        ...tweetItem.tweet,
                        retweet_count: response.data.tweet.retweet_count,
                        retweeted : response.data.tweet.retweeted
                    }
                }
              
            }
            return tweetItem;
        });
    });
    })
    .catch(error => {
      console.log('error:', error);
    });

  }

  return (
    <div className="retweet-options">
    <div className='remove-retweet-option' onClick={() => setRetweetOption(!retweetOption)}> X </div>
    <div className='retweet-option' onClick={handleQuote}>
      <svg className='retweet-option-icon' viewBox="0 0 24 24" aria-hidden="true"><g><path d="M14.23 2.854c.98-.977 2.56-.977 3.54 0l3.38 3.378c.97.977.97 2.559 0 3.536L9.91 21H3v-6.914L14.23 2.854zm2.12 1.414c-.19-.195-.51-.195-.7 0L5 14.914V19h4.09L19.73 8.354c.2-.196.2-.512 0-.708l-3.38-3.378zM14.75 19l-2 2H21v-2h-6.25z"></path></g></svg>
      <button className="retweet-option-btn" aria-label="Retweet with comment"> Quote </button>
    </div>
    <div className='retweet-option'>
      <svg className='retweet-option-icon' viewBox="0 0 24 24" aria-hidden="true"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
      <button className="retweet-option-btn" aria-label="Retweet" onClick={() => {retweet()}}> {retweeted ? (<span>Undo-Retweet</span>) :(<span>Retweet</span>)}</button>
    </div>
  </div>

  );
}
