import React, {useState} from 'react'
import NewChatBox from './NewChatBox';
export default function NoChatHistory() {
    const [openPopUp, setOpenPopUp] = useState(false);
  return (
    
    <div>         
            <div className='noMessage'>
              <span>Welcome to your inbox!</span>
              <div>Drop a line, share posts and more with private conversations between you and others on X.</div>
            </div>
            <div className='startNewMessage'>
              <button onClick={() => setOpenPopUp(!openPopUp)}>Write a message</button>
            </div>
            {openPopUp ? <NewChatBox /> : null}
    </div>
  )
}
