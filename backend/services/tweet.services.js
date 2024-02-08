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
    console.log(username)
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

module.exports = {
    createTweet
};