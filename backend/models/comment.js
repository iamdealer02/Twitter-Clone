const mongoose = require('mongoose');

// Define the schema for your comment model
const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user_details', required: true },
  tweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: true },
  createdAt: { type: Date, default: Date.now }
});


const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

