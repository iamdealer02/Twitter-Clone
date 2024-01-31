import React from 'react'
import '../styles/personalMessage.css'

export default function PersonalMessage() {
  return (
    <div>
        <div className='noPersonalMessageSelected'>
            <span> Select a message </span>
            <div> Choose from your existing conversations, start a new one, or just keep swimming. </div>
            <div className='startNewMessage'>
                <button>New message</button>
        </div>
        </div>

    </div> 
  )
}
