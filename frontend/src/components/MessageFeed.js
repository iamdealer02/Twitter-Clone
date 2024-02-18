import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/messageFeed.css';
import UserProfile from './UserProfile';
// this component consists of all the people user has messaged

export default function MessageFeed({peopleList}) {
  const username = JSON.parse(localStorage.getItem('user')).username;
  console.log('here',peopleList)

  return (
    <div>
      <div className='messageHeader'>
        <span>Messages</span>
      </div>
      <div className='messageList'>

      
         {peopleList && peopleList.map((person, index) => (
            <NavLink
              key={index}
              to={`/messages/${person.participants[0] === username ? person.participants[1] : person.participants[0]}`}
              exact
              activeclassname="active"
              className='person'
            > 
            
              <UserProfile userProfileObj={person?.participantData} searchbox={true} messagebox={true} last_message={person?.lastMessage?.content}/>

            </NavLink>
          ))
              }
      </div>
    </div>
  );
}
