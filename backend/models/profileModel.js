const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
  
  },
  name: {
    type: String,
    trim: true,
  },

  profile_picture: {
    type: Buffer,
  },

  cover_picture: {
    type: Buffer,
  },
  followers: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user_details'
  
  }],

  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user_details'
  
  }]
  
});


const User = mongoose.model('user_details', profileSchema)

module.exports = User;
