const TweetModel = require('../models/tweets');
const logger = require('../middleware/winston');
const statusCode = require('../constants/statusCode');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Function to convert media into buffer
const mediaToBuffer = async (mediaData) => {
    return new Buffer.from(mediaData, 'base64');
};

const createTweet = async (req, res) => {
    const { tweet, image, gif, poll, emoji, schedule } = req.body;
    // get the token from the request header
    const token = req.headers.authorization.split(' ')[1];
    // decode the token to get the user id
    const decodedToken = jwt.decode(token);
    const username = decodedToken.id;
    // if the token is invalid, return an error
    if (!decodedToken) {
        return res.status(statusCode.unauthorized).json({ message: 'Session Expired' });
    }
    
    // Convert image data to buffer if it exists
    const media = image ? Buffer.from(image, 'base64') : null;

    try {
        const pollOptions = poll.options.map(option => ({ option }));

        // Create a new instance of the Tweet model
        console.log(media);
        const newTweet = new TweetModel ({
            username,
            is_poll: poll.question ? true : false,
            tweet,
            gif,
            emoji,
            schedule,
            poll: { question: poll.question, options: pollOptions },
            media: { data: media, contentType: 'image/png' }
      
        });

  
        // Save the tweet to the database
        console.log(newTweet);
        await newTweet.save();
        logger.info('Tweet created successfully');
        return res.status(statusCode.success).json({ message: 'Tweet created successfully' });
    
    } catch (error) {
        logger.error('Error while creating the tweet', error);
        return res.status(statusCode.queryError).json({ message: 'Error while creating the tweet' });
    }
};

const getTweet = async (req, res) => {
    try {
        // Retrieve the tweet data from the database
        const tweetData = await TweetModel.find({});
       
        // If no tweet is found, return an error message
        if (!tweetData) {
            return res.status(statusCode.notFound).json({ message: 'Tweet not found' });
        }
        
        // Array to store structured tweet objects
        const tweets = [];
        // Iterate over each tweet data object and structure it
        tweetData.forEach(tweet => {
            tweets.push(tweetObject(tweet.username, tweet.content,timestampToSince(tweet.timestamp),tweet.gif,tweet.poll,tweet.pollQuestion,tweet.pollOptions));
        });
        // Return the structured tweet data
        return res.status(statusCode.success).json({ tweets });

    } catch (error) {
        // Handle errors during the tweet retrieval process
        logger.error('Error while retrieving the tweet', error);
        return res.status(statusCode.queryError).json({ message: 'Error while retrieving the tweet' });
    }
};

// Function to structure a tweet object
function tweetObject(username, content, timestamp, gif, pollQuestion, pollOptions) {
    return {
        username: username,
        content: content,
        timestamp: timestamp,
        gif: gif,
        poll: {
            question: pollQuestion,
            options: pollOptions
        },
        like: [],
        retweet: [],
        comment: []
    };
}

// Function to convert timestamp to relative time
function timestampToSince(timestamp) {
    
    const now = new Date();
    const tsDate = new Date(timestamp);

    // Check if the timestamp is valid
    if (isNaN(tsDate.getTime())) {
        return 'Invalid timestamp';
    }

    const diff = Math.abs(now - tsDate); // Difference in milliseconds

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Format the time difference
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
}

module.exports = {
    createTweet,
    getTweet
};
