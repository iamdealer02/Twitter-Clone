import React from 'react';
import TaskBar from '../components/TaskBar'
import BookmarkView from '../components/BookmarkView'
import '../styles/bookmarkPage.css'
import '../styles/bookmarkView.css'


function BookmarkPage() {
  return (
    <div>
      <div className='bookmarkContainer'>
        <div className='bookmarkTaskbar'>
          <TaskBar/>
        </div>

        <div className='bookmarkFeed'>
          <BookmarkView/>  
              {/* Content for bookmarks view */}
            </div>

            {/* Add more views here if needed */}
          </div>                     
        </div>
  );
}

export default BookmarkPage;
