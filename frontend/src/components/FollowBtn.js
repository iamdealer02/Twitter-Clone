import React from 'react'
import instance from '../constants/axios';


export default function FollowBtn({userFollowed, setUserFollowed, userProfileObj, setFollowerCount,followerCount}) {


  const handleFollow = async () => {
    try {

      const token = JSON.parse(localStorage.getItem('user')).token;
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
 
      const postFollow = await instance.post(`/profile/follow/${userProfileObj?._id}`, {});
      setUserFollowed(!userFollowed);
      // only do it followerCount is passes
      if (followerCount !== undefined) {
        if (userFollowed) {
          setFollowerCount(followerCount - 1);
        } else {
          setFollowerCount(followerCount + 1);
        }
      }


    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  return (
    <button className={userFollowed ? "following-btn" : "followButton"} onClick={handleFollow}>{userFollowed ? 'Following' : 'Follow'}</button>
   
  )
}
