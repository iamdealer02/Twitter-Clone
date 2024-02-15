const ChatModel = require('../models/chatModel');
const logger = require('../middleware/winston');
const pool = require('../boot/database/db_connect');
const statusCode = require('../constants/statusCode');
const ProfileModel = require('../models/profileModel');
const jwt = require('jsonwebtoken');
const saveChat = async (req, res) => {
    try {
        // Decode JWT token to get user ID
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user1 = decodedToken.id; // Assuming this is the ObjectId of the logged-in user
        const user2 = req.params.user2;
        const message = req.body.message;

        // Check if chat already exists
        let chat = await ChatModel.findOne({ participants: { $all: [user1, user2] } });

        if (chat) {
            // Add message to existing chat
            chat.messages.push({ sender: user1, content: message });
        } else {
            // Create new chat if it doesn't exist
            chat = new ChatModel({
                participants: [user1, user2],
                messages: [{ sender: user1, content: message }]
            });
        }

        // Save the chat
        await chat.save();

        // Send success response
        res.status(statusCode.success).json({ message: 'Chat saved successfully' });
    } catch (error) {
        // Handle errors
        logger.error(`Error in chat.services.js => saveChat() : ${error}`);
        res.status(statusCode.badGateway).json({ message: 'Internal server error' });
    }
};



const getChat = async (req, res) => {
        // logged in user
    // getting token from header
    const token = req.headers.authorization.split(' ')[1];
 
    const decodedToken = jwt.decode(token);
    if (!decodedToken) {
        return res.status(statusCode.unauthorized).json({ message: 'Session Expired' });
    }
    const user1 = decodedToken.id;
    // const user1 = 'aarjoo'
    // user 2 from params
    const {user2} = req.params;
   
    try {

        // or if [user2, user1] is also a valid chat
        const chat = await ChatModel.findOne({$or: [{participants: [user1, user2]}, {participants: [user2, user1]}]});
        res.status(statusCode.success).json({chat});
       
    } catch (error) {
        logger.error(`Error in chat.services.js => getChat() : ${error}`);
        res.status(statusCode.badRequest).json({message: 'Internal server error'});
    } 
};

const getAllChat = async (req,res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    if (!decodedToken) {
        return res.status(statusCode.unauthorized).json({ message: 'Session Expired' });
    }
    const user = decodedToken.id;
   
    try{
        const chat = await ChatModel.find({ participants: user });
        // find all the users data involved (username, profile_pic, name)

        const formattedChat = await Promise.all(chat.map(async chatItem => {
            // {participant that is not the user}
            console.log(chatItem.participants);
            // participants =[user1, user2]
            const participant = chatItem.participants.find(participant => participant !== user);
            const participantData = await ProfileModel.findOne({ username: participant }, { username: 1, profile_pic: 1, name: 1 });
            return {
                participants: chatItem.participants,
                participantData: participantData,
                lastMessage: chatItem.messages.length > 0 ? chatItem.messages[chatItem.messages.length - 1] : null
            };
        }));
        res.status(statusCode.success).json({ formattedChat });

    }catch (error) {
        logger.error(`Error in chat.services.js => getAllChat() : ${error}`);
        res.status(statusCode.badRequest).json({message: 'Internal server error'});
    }
}
const isReceiverValid = async (req,res) => {
    const {receiver} = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
 
    if (!decodedToken) {
        return res.status(statusCode.unauthorized).json({ message: 'Session Expired' });
    }
    // check from sql if the usr exists and is not the same as the logged in user
    const user = decodedToken.id;
    try{
        const result = await pool.query('SELECT uid FROM users WHERE username = $1', [receiver]);
        if (result.rows.length === 0){


            return res.status(statusCode.notFound).json({message: false});
        }
        if (result.rows[0].username === user){
            return res.status(statusCode.badRequest).json({message: false});
        }
                    //send username, name and pfp from profile model
        const receiver_data = await ProfileModel.findOne({ username: receiver });
    
        res.status(statusCode.success).json({message: true, receiver_data: {_id:receiver_data._id, username: receiver_data.username, name: receiver_data.name, profile_pic: receiver_data.profile_pic}});
    }catch (error) {
        logger.error(`Error in chat.services.js => isReceiverValid() : ${error}`);
        res.status(statusCode.badRequest).json({message: 'Internal server error'});

}
}

module.exports = {
  saveChat,
  getChat,
    getAllChat,
    isReceiverValid
};
