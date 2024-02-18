const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    participants: [{ type: String }], // Array of participant username
    messages: [{ 
        sender: String, // ID of the message sender
        content: String, // Message content
        timestamp: { type: Date, default: Date.now } // Timestamp of the message
    }]

});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
