import React from 'react'
import TaskBar from '../components/TaskBar'
import MessageFeed from '../components/MessageFeed'
import PersonalMessage from '../components/PersonalMessage'
import '../styles/message.css'


function MessagePage() {
  return (
    <div>
        <div className='messageContainer'>
            <div className='messageTaskbar'>
                <TaskBar/>
            </div>
            <div className='messageFeed'>
                <MessageFeed/>
            </div>
            <div className='personalMessage'>
                <PersonalMessage/>
            </div>

        </div>

    </div>
  )
}

export default MessagePage