import React from 'react'
import FetchUserData from './FetchUserData';

export default function EditProfileForm() {
    const userProfileObj = FetchUserData();
  return (
    <div>
      
      <form className="edit-profile-form" >
        <div className="profile-header">
          <h2>Edit Profile</h2>
        </div>

        <div className="profile-form-fields">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value = {userProfileObj.name} readOnly 
 
          
          />

          <label>Bio:</label>
          <input
            type="text"
            name="bio"
            value={userProfileObj.bio} readOnly
     

           
          />

          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={userProfileObj.location} readOnly

         
          />
        </div>

      </form>
  
    
      
    </div>
  )
}
