const mongoose = require('mongoose');

// Define the schema for your like model
const likeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user_details', required: true },
  tweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: true }, // reference to the Tweet model
  createdAt: { type: Date, default: Date.now } // automatically set the date when the like is created
});

// Create the model from the schema
const Like = mongoose.model('Like', likeSchema);

module.exports = Like;