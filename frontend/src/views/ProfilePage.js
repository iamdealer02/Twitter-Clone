import React from 'react'
import '../styles/homePage.css'
import TaskBar from '../components/TaskBar'
import Profile from '../components/Profile'
import SearchBar from '../components/SearchBar'


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

                </div>

                <div className="replies">

                </div>

                <div className="media">

                </div>

                <div className="likes">
                  
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