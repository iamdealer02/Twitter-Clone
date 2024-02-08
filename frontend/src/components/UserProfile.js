import React from 'react'

export default function UserProfile(userProfileObj) {
  
  return (

    <div>

      { userProfileObj.profile_pic ?    
      ( <div className="profile-pic" style={{ backgroundImage: `url(${userProfileObj.profile_pic})` }}></div>):
      ( <div className="profile-pic" style={{ backgroundImage: `url(https://cdn-icons-png.flaticon.com/128/64/64572.png `}}></div>) 
       }

       {userProfileObj.name ? 
       (<div className="name">{userProfileObj.name}</div>):
       null
      }

    <div className="username">@{userProfileObj.username}</div>
      
    </div>
  )
}
