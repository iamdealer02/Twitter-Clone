import React from 'react'

export default function UserProfile({userProfileObj}) {
  return (
    <div>
    <div className="profile-pic" style={{ backgroundImage: `url(${userProfileObj.profile_pic})` }}></div>
    
    <div className="name">{userProfileObj.name}</div>
    <div className="username">@{userProfileObj.username}</div>
      
    </div>
  )
}
