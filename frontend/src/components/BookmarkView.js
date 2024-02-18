import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../constants/axios';
import { requests } from '../constants/requests';



export default function BookmarkView() {
  const [bookmarks, setBookmarkTweets] = useState(null);
  const {username} = useParams();
console.log(username);
  useEffect(() => { 
    const fetchBookmarkTweets = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token; // Get user token from localStorage 
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set Authorization header with token
        const response = await instance.get(`${requests.getbookmark}/${username}`); // Make GET request to fetch tweets
        //console.log(response.data.bookmarks)
        setBookmarkTweets(response.data.bookmarks); // Set fetched tweets to state
       
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
        <div className="bookmarks-content">
          <h2 className="bookmarks-user">User: {bookmarks.username}</h2>
          <h3 className="bookmarks-tweets-heading">Bookmarked Tweets:</h3>
          <ul className="bookmarks-list">
            {bookmarks.bookmarks.map((bookmark) => (
              <li key={bookmark._id} className="bookmark-item">{bookmark.tweet}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="loading-message">Loading bookmarks...</p>
      )}
    </div>
  );
      }