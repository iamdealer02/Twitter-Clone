import React, { useState, useEffect,useRef } from 'react';
import '../styles/personalMessage.css';
import { requests } from '../constants/requests';
import instance from '../constants/axios';
import ChatList from './ChatList';
import { useParams } from 'react-router-dom';
import useSocket from '../hooks/useSocket'
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';


export default function PersonalMessage(participantData) {
  const navigate = useNavigate();
 const {state} = useSocket();
  const socket = state.socket;
  console.log(participantData)
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const sender = JSON.parse(localStorage.getItem('user')).username;
  const receiver = useParams().username;

  // for scrollbar to be at the bottom
    const messageListRef = useRef(null); // Create a ref for the message list
  
    useEffect(() => {
      // Scroll to the bottom of the message list when it updates
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    }, [messageList]);
  



  // getChatHistory based on the receiver
  useEffect(() => {
    const getChatHistory = async (receiver) => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
        const response = await instance.get(`${requests.getChatHistory}/${receiver}`, {
          headers: { token: token }
        });
    
        const messages = response.data.chat.messages;
        const formattedMessages = messages.map(message => {
          return {
            ...(message?.sender === sender ? { sent: message.content } : { received: message.content })
          };
        });
    
        setMessageList(formattedMessages);
      } catch (error) {
        console.log(error); 
      }
    };
    if (receiver){
      getChatHistory(receiver);
    }  
  }, [receiver,sender]);


  const saveChat = async (user2, message) => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await instance.post(`${requests.saveChat}/${user2}`, { message: message }, {
        headers: { token: token }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== '') {
      try {
        // Save the message in the database
        await saveChat(receiver, currentMessage);
        // Send message to the server
        await socket.emit('send_message', {
          sender: sender,
          receiver: receiver,
          message: currentMessage,
          time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
        });
        // Update messageList state
        setMessageList([...messageList, { 'sent': currentMessage }]);
        setCurrentMessage('');
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    socket.on("receive_message", ({ message, sender, time }) => {
      setMessageList([...messageList, { 'received': message }]);
  
    });

  }, [socket, receiver,messageList]);


  return (
    <div className='outerDiv'>
        <div className='personalMessageSelected'>
          <div className='messageHeader'>
           
            <div className='messageHeaderRight' onClick={()=>{navigate(`/profile/${receiver}`)}}>
              {/* use navigate */}
              {/* navigate to user profile */}

              <UserProfile userProfileObj={participantData.participantData} messagebox={true} searchbox={true} />
           
            </div>
          </div>
          <div className='messageList'  ref={messageListRef}>
           {/* conditionally */}
           {
            messageList ? <ChatList messageList={messageList} /> : null
           }
    
          </div>
          <div className='messageBody'>
            <div className='messageInput'>
              <textarea type='text' value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} placeholder='Start a message' />
            </div>
            <div className='messageSend'>
              <button onClick={sendMessage}>
                <svg viewBox="0 0 24 24" style={{height:'20px'}} fill='#1D9BF0'><g><path d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2H5.981z"></path></g></svg>
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
