const { ObjectId } = require('bson');
const mongoose = require('mongoose');


const tweetSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    is_repost:{
        type: Boolean,
        default: false
    },
    reposted_from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    },
    is_poll: {
        type: Boolean,
        default: false
    },

    tweet: {
        type: String
    },
    gif: {
        type: String
    },
    emoji: {
        type: String
    },
    schedule: {
        type: Date
    },

    likes: {
        type: Array,
        default: []
    },
    retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Retweet' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

    poll: {
        question: {
            type: String,
        },
        options: [{
            option: {
                type: String,
            },
            voters: [{
                // object id with reference to the user model
                type: ObjectId,
                ref: 'user_details',
                
            }]
        }]
    },
    
    media: {
        data: Buffer, // Use Buffer to store binary data of the media
        contentType: String // Store content type for appropriate rendering (e.g., image/jpeg, image/png)
    }
}   , { timestamps: true }
);

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
