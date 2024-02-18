import React, { useEffect, useState } from 'react'
import instance from '../constants/axios';
import { useParams } from 'react-router-dom';


export default function PostCount() {
    const {username} = useParams();
    const [totalPostCount, setTotalPostCount] = useState(0);

    const fetchPostCount = async () => {
      
        try{

           // retrieving data 
          const response = await instance.get(`/profile/posts/${username}`); 
    
          const postArray = response.data.posts;
          setTotalPostCount(postArray.length) // getting the length of the total posts 
     
          
        } catch (error) { 
          console.error('Error fetching tweets:', error);
        }
      };


      useEffect(() => {
        fetchPostCount();
      }, []);
       

  return (
    <div>
        <div className="total-post-count">
        <p>Total Posts: {totalPostCount}</p>
      </div>
      
    </div>
  )
}
