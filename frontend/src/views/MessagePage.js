import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TaskBar from '../components/TaskBar';
import MessageFeed from '../components/MessageFeed';
import NoChatHistory from '../components/NoChatHistory';
import PersonalMessage from '../components/PersonalMessage';
import NoReceiverSelected from '../components/NoReceiverSelected';
import '../styles/message.css';
import instance from '../constants/axios';
import { requests } from '../constants/requests';

function MessagePage() {
  const [receiverExists, setReceiverExists] = useState(false);
  const [peopleList, setPeopleList] = useState([]);
  const [receiverData, setReceiverData] = useState({}); // [name, username, profilePic]
  const { username } = useParams();


  // Fetch peopleList data when the component mounts or receiver information changes
  useEffect(() => {
    const getPeopleList = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await instance.get(requests.getPeopleList);
        const formattedChat = response.data.formattedChat;
        setPeopleList(formattedChat);
        console.log(formattedChat);
      } catch (error) {
        console.log(error);
      }
    };

    getPeopleList();
  }, [username]);

  // Check for receiver existence
  useEffect(() => {
    if (username === undefined) {
      setReceiverExists(false);
    }
    else  {
      const token = JSON.parse(localStorage.getItem('user')).token;
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      instance.get(`${requests.isReceiverValid}/${username}`)
        .then((response) => {
          setReceiverExists(response.data.message);
          setReceiverData(response.data.receiver_data);
        })
        .catch((error) => {
          setReceiverExists(false);
        });
      }
  }, [username]);

  useEffect(() => {
    if (receiverExists) {
      const receiverInPeopleList = peopleList.some(person => person.participants.includes(username));
      if (!receiverInPeopleList) {
        // Create a new entry for the receiver in the peopleList
        const updatedPeopleList = [...peopleList, {participantData: receiverData, participants: [username]}];
        setPeopleList(updatedPeopleList);
      }
    }
  }, [receiverExists, peopleList, username, receiverData]);

  return (
    <div>
      <div className='messageContainer'>
        <div className='messageTaskbar'>
          <TaskBar />
        </div>
        <div className='messageFeed'>
          {/* contains all people you have messaged */}
          {peopleList?.length > 0 ? <MessageFeed peopleList={peopleList} /> : <NoChatHistory />}
        </div>
        <div className='personalMessage'>
          {/* contains the chat history and the messaging between the user and receiver */}
          {receiverExists ? <PersonalMessage participantData={receiverData} /> : <NoReceiverSelected />}
        </div>
      </div>
    </div>
  );
}

export default MessagePage;
