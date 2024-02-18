import React from 'react';
import TaskBar from '../components/TaskBar'
import BookmarkView from '../components/BookmarkView'
import '../styles/bookmarkPage.css'
import '../styles/bookmarkView.css'
import SearchBar from '../components/SearchBar'
import Recommendation from '../components/Recommendation';
import TrendingHashtags from '../components/TrendingHashtags';

function BookmarkPage() {
  return (
    <div>
      <div className='bookmarkContainer'>
        <div className='bookmarkTaskbar'>
          <TaskBar/>
        </div>

        <div className='bookmarkFeed'>
          <BookmarkView/>  
           
          </div>
          <div className='homeWidgets'>
                <SearchBar/>
                <Recommendation/>
                <TrendingHashtags/>
            </div>

           
          </div>                     
        </div>
  );
}

export default BookmarkPage;
