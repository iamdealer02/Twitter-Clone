
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faRetweet, faHeart, faBookmark } from '@fortawesome/free-solid-svg-icons';

const InteractionButtons = ({ likes, retweets, comments, bookmarks }) => {
  return (
    <div className="tweet-interactions">
      <button className="tweet-interaction-btn" aria-label="Comment">
        <FontAwesomeIcon icon={faComment} /> {comments}
      </button>
      <button className="tweet-interaction-btn" aria-label="Retweet">
        <FontAwesomeIcon icon={faRetweet} /> {retweets}
      </button>
      <button className="tweet-interaction-btn" aria-label="Like">
        <FontAwesomeIcon icon={faHeart} /> {likes}
      </button>
      <button className="tweet-interaction-btn" aria-label="Bookmark">
        <FontAwesomeIcon icon={faBookmark} /> {bookmarks}
      </button>
    </div>
  );
};

export default InteractionButtons;