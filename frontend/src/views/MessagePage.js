import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import TaskBar from '../components/TaskBar'
import MessageFeed from '../components/MessageFeed'
import NoChatHistory from '../components/NoChatHistory';
import PersonalMessage from '../components/PersonalMessage'
import '../styles/message.css'
import instance from '../constants/axios'
import { requests } from '../constants/requests'
import NoReceiverSelected from '../components/NoReceiverSelected';
// this page will be displayed  whith two urls : message and message/:username



function MessagePage() {
    const [receiverExists, setReceiverExists] = useState(false);
    const [peopleList, setPeopleList] = useState([]); 
    const { username } = useParams();

    // Check for receiver existence
    useEffect(() => {
      if (username) {
        const token = JSON.parse(localStorage.getItem('user')).token;
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        instance.get(`${requests.isReceiverValid}/${username}`)
          .then((response) => {
            console.log(response)
            setReceiverExists(response.data.message);
           
          })
          .catch((error) => {
            setReceiverExists(false);
           
          });
      } else {
        // If there is no username parameter, receiver does not exist 
        setReceiverExists(false);
      }
    }, [username]);

    const getPeopleList = async () => {
        const token = JSON.parse(localStorage.getItem('user')).token;
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await instance.get(requests.getPeopleList);
          setPeopleList(response.data.formattedChat);
        
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        getPeopleList();
      }, []);

      useEffect(() => {
        if (receiverExists) {
            const receiverInPeopleList = peopleList.some(person => person.participants.includes(username));
            if (!receiverInPeopleList) {
                // Create a new entry for the receiver in the peopleList
                const updatedPeopleList = [...peopleList, { participants: [username] }];
                setPeopleList(updatedPeopleList);
            }
        }
    }, [receiverExists, peopleList, username]);

  return (
    <div>
        <div className='messageContainer'>
            <div className='messageTaskbar'>
                <TaskBar/>
            </div>
            <div className='messageFeed'>
                {/* contains all people you have messaged */}
                {peopleList.length !== 0 ? <MessageFeed peopleList={peopleList} /> : <NoChatHistory/>}
               

            
            </div>
            <div className='personalMessage'>
                {/* contains the chat history and the messaging between the user and receiver */}
                {receiverExists ? <PersonalMessage/> : <NoReceiverSelected/>}

               
            </div>

        </div>

    </div>
  )
}

export default MessagePage