const mongoose = require('mongoose');

// Define the schema for your retweet model
const retweetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user_details', required: true },
  originalTweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create the model from the schema
const Retweet = mongoose.model('Retweet', retweetSchema);

module.exports = Retweet;
