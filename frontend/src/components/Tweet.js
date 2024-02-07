import React from 'react';
import InteractionButtons from './interactionButtons';

const Tweet = ({ tweet, handlePollOptionSelect }) => {
  const { username, tweet: tweetContent, like, retweet, comment, poll, gif, media } = tweet;
  const imageSrc = media && media.url ? media.url : null;

  /*const renderMediaContent = () => {
    if (gif) {
      return (
        <div className="tweet-media-container">
          <img src={gif} alt="Tweet GIF" className="tweet-media" />
        </div>
      );
    } else if (imageSrc) {
      return (
        <div className="tweet-media-container">
          <img src={imageSrc} alt="Tweet" className="tweet-media" />
        </div>
      );
    }
    return null;
  };*/

  return (
    <div className="tweet">
      <div className="tweet-header">
        <span className="username">{username}</span>
      </div>
      {tweetContent && <p className="tweet-content">{tweetContent}</p>}

      {/* Conditionally render an image if the media object contains an image */}
      {imageSrc && (
        <div className="tweet-media-container">
          <img src={imageSrc} alt="Tweet" className="tweet-media" />
        </div>
      )}

      {/* Conditionally render a GIF if it exists in the tweet */}
      {gif && (
        <div className="tweet-gif-container">
          <img src={gif} alt="Tweet GIF" className="tweet-gif" />
        </div>
      )}

      {poll && poll.question && ( // Conditionally render poll options if a poll exists in the tweet
        <div className="poll">
          <p>{poll.question.question}</p>
          <ul>
            {poll.question.options.map((option) => (
              <li key={option._id}>
                <label>
                  <input
                    type="radio"
                    name={`poll_${tweet.id}`} // Ensure unique name for each poll to handle multiple polls
                    value={option.option}
                    onChange={() => handlePollOptionSelect(tweet.id, option._id)}
                  />
                  {option.option}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      <InteractionButtons
        likes={like.length}
        retweets={retweet.length}
        comments={comment.length}
      />
    </div>
  );
};

export default Tweet;

