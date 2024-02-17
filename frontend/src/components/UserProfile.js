import React from 'react'

export default function UserProfile({userProfileObj, searchbox=false, messagebox=false, last_message }) {


  
  return (
   
        <div className={`${searchbox ? 'userDetails': null}`}>
  <div className= {`${searchbox ? 'profilePic': 'profile-picture'}`}>
  <img
        src={
            userProfileObj?.profile_picture ?userProfileObj.profile_picture
                : 'https://cdn-icons-png.flaticon.com/128/64/64572.png'
                
        }
        alt="pfp"
    />
  </div>
 
    <div className={messagebox ? 'message-user' : null}>
    <div className={messagebox ? 'message-user-details' : null}>
      <div className={searchbox || messagebox ? 'mini-name': 'name'}>{userProfileObj?.name ? userProfileObj.name : userProfileObj.username}</div>
      <div className={searchbox || messagebox ? 'mini-username': 'username'}>@{userProfileObj?.username}</div>
    </div> 
    {messagebox && <div className='last-message'>{last_message}</div>} 
  
    </div>
    </div>
 
   
  )
}
