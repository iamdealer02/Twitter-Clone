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
    type: String,
  },

  cover_picture: {
    type: String,
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
  
  }],

  is_monetized: {
    type: Boolean,
    default: false
},


  
});


const User = mongoose.model('user_details', profileSchema)

module.exports = User;
