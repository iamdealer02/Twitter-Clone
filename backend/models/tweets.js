const mongoose = require('mongoose');


const tweetSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
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
    retweets: {
        type: Array,
        default: []
    },
    comments: [{
        userId: {
            type: String,

        },
        comment: {
            type: String,
        }
    }
    ],
    poll: {
        question: {
            type: String,
        },
        options: [{
            option: {
                type: String,
            },
            voters: [{
                type: String, // Assuming voter IDs are strings
                default: []
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
