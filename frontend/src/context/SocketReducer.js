// SocketReducer.js
import io from "socket.io-client";

const SocketReducer = (state, action) => {
    switch (action.type) {
        case "Login": {
            console.log(action.payload);
            // Start the socket connection
            const newSocket = io.connect("http://localhost:3001", {
                query: { username: action.payload.username }
            });
            return {
                ...state,
                socket: newSocket,
            };
        }
        case "Logout": {
            // Disconnect the socket
            if (state.socket) {
                state.socket.disconnect();
            }
            return {
                ...state,
                socket: null,
            };
        }
        default:
            return {
                ...state,
            }
    }
};

export default SocketReducer;
