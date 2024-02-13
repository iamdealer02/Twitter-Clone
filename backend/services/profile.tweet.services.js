const { error } = require("winston");
const pool = require("../boot/database/db_connect");
const statusCodes = require("../constants/statusCode");
const logger = require("../middleware/winston");
const profileModel = require("../models/profileModel");
const tweets = require("../models/tweets")


const viewUserTweets = async (req, res) => {

    const { username} = req.params;

    try{
        const userFetch = await profileModel.findOne({ username });
        if (!userFetch){
            return res.status(404).json({ error: " usr not found"});
        }
        const tweetFetch = await tweets.find({ username: userFetch.username});
        
        return res.status(200).json({ tweetFetch})
      
    } catch ( error){
        console.error('error fetching tweets: ', error);
        return res.status(500).json({ error: 'Internal error server'})
    }

};


module.exports = {
    viewUserTweets
}