import React from 'react'

export default function UserProfile({userProfileObj}) {

  
  const profilePicture = userProfileObj.profile_picture;

  
  return (

    <div>


<div className="profile-picture">
<img src={`data:image/png;base64,${profilePicture}`} alt="pfp" /></div>    

     
    
    <div className="name">{userProfileObj.name}</div>
    <div className="username">@{userProfileObj.username}</div>
      
    </div>
  )
}
