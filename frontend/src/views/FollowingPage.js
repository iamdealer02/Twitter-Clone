import React from 'react'

import TaskBar from '../components/TaskBar'
import SearchBar from '../components/SearchBar'
import FollowingList from '../components/FollowingList'


function FollowingPage() {
  return (
    <div>
        <div className="following-container">
            <div className="listTaskbar">
            <TaskBar/>

            </div>
            <div className="listFeed">
                <div className="following-feed">
                <FollowingList/>

                </div>


            
            </div>
            <div className="listWidgets">
            <SearchBar/>

            </div>


        </div>
       

      
    </div>
  )
}

export default FollowingPage
