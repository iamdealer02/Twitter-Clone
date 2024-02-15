// SocketProvider.js
import React, { createContext, useReducer } from 'react';
import SocketReducer from './SocketReducer';
import io from 'socket.io-client';

const user = JSON.parse(localStorage.getItem('user'));
const INITIAL_STATE = {
  socket: io.connect("http://localhost:3001"
  , {
    query: { username: user ? user.username : null }
  }),
  
};

export const SocketContext = createContext(INITIAL_STATE);

export const SocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SocketReducer, INITIAL_STATE);

  return (
    <SocketContext.Provider value={{ state, dispatch }}>
      {children}
    </SocketContext.Provider>
  );
};
