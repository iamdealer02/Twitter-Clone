import React from 'react';
import EditProfile from '../components/EditProfile';
import Profile from '../components/Profile';
import TaskBar from '../components/TaskBar';

function EditProfilePage() {
  return (
    <div>
      <div className="editPage">
      <div className="background-page">


      <div className="background-taskbar">
        <TaskBar/>
      </div>

      <div className="background-profile">        
       <Profile/>
      </div> 

      <div className="background-widgets">

      </div>

      <div className="edit-form">
        <EditProfile/>
      </div>
      </div>

      </div>

      
    </div>
  )
}

export default EditProfilePage
