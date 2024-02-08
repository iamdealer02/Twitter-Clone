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
    data: Buffer, 
    contentType: String,
  },

  cover_picture: {
    data: Buffer, 
    contentType: String,
  
  },

  bookmarks:[ {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Tweet' 
  
  }],

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
