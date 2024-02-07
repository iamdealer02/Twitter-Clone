import React from 'react'
import '../styles/homePage.css'
import TaskBar from '../components/TaskBar'
import AddTweetBox from '../components/AddTweetBox'
import TweetBody from '../components/TweetList'



function HomePage() {
  return (
    <div>
        <div className='homeContainer'>
            <div className='homeTaskbar'>
                <TaskBar/>
            </div>
        
            <div className='homeFeed'>
                {/* add a following and a for you section before */}
                {/* addTweetBox */}
                <AddTweetBox/>
            <div className='homeNewsFeed'></div>
                <TweetBody/>
                
            </div>
            <div className='homeWidgets'>
                

            </div>
        </div>
    </div>
  )
}

export default HomePage