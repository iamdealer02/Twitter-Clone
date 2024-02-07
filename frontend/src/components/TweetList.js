import React, { useEffect, useState } from 'react'; 
import '../styles/tweetList.css';
import Tweet from './Tweet';
import instance from '../constants/axios';
import requests from '../constants/requests';


const TweetList = () => {
  const [tweets, setTweets] = useState([]); // State for storing tweets, initialized as an empty array

  useEffect(() => { // useEffect hook to fetching tweets
    const fetchTweets = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token; // Get user token from localStorage 
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set Authorization header with token
        const response = await instance.get(requests.getTweet); // Make GET request to fetch tweets
        setTweets(response.data.tweets); // Set fetched tweets to state
      } catch (error) { 
        console.error('Error fetching tweets:', error);
      }
    };

    fetchTweets(); 
  }, []); 

  return (
    <div className="news-feed">
      <h2>News Feed</h2>
      <div className="tweet-list"> {/* Container for displaying tweets */}
        {tweets.map((tweet) => ( // Map over the tweets array and render Tweet component for each tweet
          <Tweet key={tweet.id} tweet={tweet} /> // Render the Tweet component with unique key and tweet data
        ))}
      </div>
    </div>
  );
};

export default TweetList;
