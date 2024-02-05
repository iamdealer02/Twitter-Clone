import React, {useState} from 'react'
import instance from '../constants/axios'  // axios instance
import { requests } from '../constants/requests'  // api endpoints



export default function NewChatBox() {
    // this component temporary (will be replaves by a search box)

    const [receiver, setReceiver] = useState('');

    // get username from local storage user object
    const sender = JSON.parse(localStorage.getItem('user')).username;

    const createChatRoom= () => {
        // create a new chat room
        if (sender !== '' && receiver !== '') {
            // send token in the header
            const token = JSON.parse(localStorage.getItem('user')).token;
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            instance.post(requests.createChatRoom, {receiver: receiver})
                .then((response) => {
                    window.location.href = `/messages/${receiver}`;
                })
                .catch((error) => {
                    console.log(error);
                });
              
            }
    }
    

  return (

    <div >
        <div className='newChatBox'>
            <div className='newChatBoxHeader'>
                <h3>Start a new chat</h3>
            </div>
            <div className='newChatBoxBody'>
                <input type='text' placeholder='Search for a user' onChange={(e) => {setReceiver(e.target.value)}}/>
            </div>
            <div className='newChatBoxFooter'>
                {/* when user selects a person, add them into there room */}
                <button onClick={() => createChatRoom()}>Start Chat</button>
            </div>
        </div>
        
    </div>
  )
}
