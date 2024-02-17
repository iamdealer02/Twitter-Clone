// Desc: Socket.io configuration


const createSocketServer = (io) => {
    io.on('connection', (socket) => {  
        // console.log('a user connected');
        // make users own room : username
        const username = socket.handshake.query.username;
        socket.join(username)

        
        socket.on("send_message", (messageData) => {
            console.log('messageData', messageData);
            const receiver = messageData.receiver;
            const sender = messageData.sender;
            const message = messageData.message;
            const time = messageData.time;
            if (!receiver){
                return;
            }
            // post in the database
            socket.broadcast.to(receiver).emit("receive_message", {message, sender, time});

        });
        // receiving tweets from the user with userDetails

        socket.on("live_feed", ({type,data}) => {
            // broadcast to all users
            if (type === 'tweet'){
                console.log('tweetData');
                socket.broadcast.emit("receive_tweet", data);
            }
            if (type === 'like'){
                socket.broadcast.emit("receive_like", data);
            }
            if (type === 'retweet'){
                socket.broadcast.emit("receive_retweet", data);
            }
            if (type === 'reply'){
                socket.broadcast.emit("receive_reply", data);
            }
        });
        
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
});

    };

module.exports = {
    createSocketServer
}

