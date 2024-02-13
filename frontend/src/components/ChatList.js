import React from 'react';
import '../styles/chatList.css';
// this componeent displays the chat history and the messaging btwn the user and receiver

export default function ChatList({ messageList }) {

  return (
    <div className="chatListContainer">
      <div className="chatList">

        {/* Render messageList */}
        {messageList.map((message, index) => (
          <div className={message.sent ? "sent-message" : "received-message"} key={index}>
            {message.sent ? message.sent : (message.received ? message.received : message.content)}
          </div>
        ))}
      </div>
    </div>
  );
}
