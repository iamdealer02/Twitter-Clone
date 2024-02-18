import React from 'react'

import TaskBar from '../components/TaskBar'
import SearchBar from '../components/SearchBar'
import FollowersList from '../components/FollowersList'


function FollowersPage() {
  return (
    <div>
        <div className="following-container">
            <div className="listTaskbar">
            <TaskBar/>

            </div>
            <div className="listFeed">
                <div className="following-feed">
                <FollowersList/>

                </div>


            
            </div>
            <div className="listWidgets">
            <SearchBar/>

            </div>


        </div>
       

      
    </div>
  )
}

export default FollowersPage
