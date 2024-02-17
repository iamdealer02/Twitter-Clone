import React from 'react'

export default function UserProfile({userProfileObj}) {

  
  const profilePicture = userProfileObj.profile_picture;

  
  return (

    <div>


<div className="profile-picture">
<img src={profilePicture } alt="pfp" /> :   
{/* <img src='https://cdn-icons-png.flaticon.com/128/64/64572.png' alt='default profile' />  */}
</div> 

     
    
    <div className="name">{userProfileObj.name}</div>
    <div className="username">@{userProfileObj.username}</div>
      
    </div>
  )
}
