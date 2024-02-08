import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/messageFeed.css';

// this component consists of all the people user has messaged

export default function MessageFeed({peopleList}) {
  const username = JSON.parse(localStorage.getItem('user')).username;


  return (
    <div>
      <div className='messageHeader'>
        <span>Messages</span>
      </div>
      <div className='messageList'>
      
         {peopleList.map((person, index) => (
            <NavLink
              key={index}
              to={`/messages/${person.participants[0] === username ? person.participants[1] : person.participants[0]}`}
              exact
              activeclassname="active"
              className='person'
            >
              <div className='personName'>{person.participants[0] === username ? person.participants[1] : person.participants[0]}</div>
              {person.lastMessage && (
                <div className='lastMessage'>{person.lastMessage.content}</div>
              )}
            </NavLink>
          ))
              }
      </div>
    </div>
  );
}
