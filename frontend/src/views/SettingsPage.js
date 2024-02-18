import React from 'react'
import '../styles/settings.css'
import TaskBar from '../components/TaskBar'
import Settings from '../components/Settings'
import SearchBar from '../components/SearchBar'
import ChangePassword from '../components/ChangePassword'


function SettingsPage() {
  return (
    <div>
        <div className="settingsContainer">
            <div className="settingsTaskbar">
            <TaskBar/>
            </div>

            <div className="settingsFeed">
            <Settings/>
            </div>

            <div className="settingsWidgets">
            <SearchBar/>
            </div>
            
        </div>
      
    </div>
  )
}

export default SettingsPage
