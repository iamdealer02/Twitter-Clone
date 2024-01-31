import React from 'react'
import '../styles/messageFeed.css'

export default function MessageFeed() {
  return (
    <div>
        <div className='messageHeader'>
            <span >Messages</span>
        </div>
        <div className='messageList'>
            {/* if no message exists */}
            <div className='noMessage'>
                <span> Welcome to your inbox !</span>
                <div >Drop a line, share posts and more with private conversations between you and others on X. </div>
            </div>
            <div className='startNewMessage'>
                <button> Write a message </button>
            </div>
        </div>
    </div>
  )
}
