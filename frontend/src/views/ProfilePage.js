import React from 'react'
import '../styles/homePage.css'
import TaskBar from '../components/TaskBar'
import Profile from '../components/Profile'
import SearchBar from '../components/SearchBar'
import ProfilePost from '../components/ProfilePost'
import ProfileReplies from '../components/ProfileReplies'

function ProfilePage() {

  return (
    <div>
        <div className='profileContainer'>
            <div className='profileTaskbar'>
                <TaskBar/>
            </div>
        
            <div className='profileFeed'>
              <Profile/>  
              <div className="views">
                <div className="posts">
                  <ProfilePost/>
                </div>
                <div className="replies">
                  <ProfileReplies/>
                </div>



                
              </div>         
                
            </div>

            <div className='profileWidgets'>    
            <SearchBar/>           

            </div>
        </div>
    </div>
  )
}

export default ProfilePage