import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../constants/axios';
import { requests } from '../constants/requests';
import MiniUserDetail from './MiniUserDetail';
import InteractionButtons from './interactionButtons';
import '../styles/bookmarkView.css';


export default function BookmarkView() {
  const [bookmarks, setBookmarkTweets] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const {username} = useParams();
console.log(username);
  useEffect(() => { 
    const fetchBookmarkTweets = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token; // Get user token from localStorage 
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set Authorization header with token
        
        const response = await instance.get(`${requests.getbookmark}/${username}}`); // Make GET request to fetch tweets
        //console.log(response.data.bookmarks)
        console.log(response);
        setBookmarkTweets(response.data.bookmarks); // Set fetched tweets to state
        setCurrentUser(response.data.userProfileObj);
       
      } catch (error) { 
        console.error('Error fetching tweets:', error);
      }
    };

    // Call the fetchBookmarks function when the component mounts
    fetchBookmarkTweets();
  }, [username]); // Fetch bookmarks whenever the username changes

  return (
    <div className="bookmarks-container">
      <h1 className="bookmarks-heading">Bookmarks</h1>
      {bookmarks ? (
        <div>
          <h2>{bookmarks.username}</h2>
          <ul className="bookmarks-feed">
            {
              bookmarks.map((tweet, index) => {
                return (
                  <li key={index} className="bookmarks-tweet">
                    <MiniUserDetail key={tweet.tweet._id} user={tweet.userDetails} tweet={tweet.tweet} createdAt={tweet.tweet.createdAt} />
                    <InteractionButtons tweet={tweet} userProfileObj={currentUser} setTweets={setBookmarkTweets} />
                  </li>
                );
              })
            }
          </ul>
        </div>
      ) : (
        <p className="loading-message">Loading bookmarks...</p>
      )}
    </div>
  );
      }