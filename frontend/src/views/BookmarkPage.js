import React from 'react';
import TaskBar from '../components/TaskBar'
import BookmarkView from '../components/BookmarkView'


function BookmarkPage() {
  return (
    <div>
      <div className='bookmarkContainer'>
        <div className='bookmarkTaskbar'>
          <TaskBar/>
        </div>

        <div className='bookmarkFeed'>
          <BookmarkView/>  
          <div className="views">
            <div className="bookmarks">
              {/* Content for bookmarks view */}
            </div>

            {/* Add more views here if needed */}
          </div>                     
        </div>
      </div>
    </div>
  );
}

export default BookmarkPage;
