import React from 'react'
import '../styles/homePage.css'
import TaskBar from '../components/TaskBar'

function HomePage() {
  return (
    <div>
        <div className='homeContainer'>
            <div className='homeTaskbar'>
                <TaskBar/>
            </div>
            <div className='homeFeed'>
                
            </div>
            <div className='homeWidgets'>
                

            </div>
        </div>
    </div>
  )
}

export default HomePage