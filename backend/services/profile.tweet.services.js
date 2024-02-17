const { error } = require("winston");
const pool = require("../boot/database/db_connect");
const statusCodes = require("../constants/statusCode");
const jwt = require('jsonwebtoken');
const logger = require("../middleware/winston");
const profileModel = require("../models/profileModel");
const TweetModel = require('../models/tweets');
const commentModel = require('../models/comment');
const retweetModel = require('../models/retweet');
const likeModel = require('../models/like')



const viewPosts = async (req, res) => {



    const { username}= req.params;


    try {

    // const token = req.headers.authorization.split(' ')[1];
    // const decodedToken = jwt.decode(token);
    
    // const username = decodedToken.id;
    // if (!decodedToken) {
    //     return res.status(statusCodes.unauthorized).json({ message: 'Session Expired' });
    // } 


        const user = await profileModel.findOne({ username }); 


        const tweets = await TweetModel.find({ username }).sort({ createdAt: -1 }).populate('reposted_from').exec();
        const retweets = await retweetModel.find({ userId: user._id }).sort({ createdAt: -1 }).populate('originalTweetId').exec();


        const tweetsData = await Promise.all(tweets.map(async (tweet) => {
            if (tweet.media && tweet.media.data) {
                tweet.media.data = tweet.media.data.toString('base64');
            }

            let originalPoster = null;
            if (tweet.is_repost) {
                originalPoster = await profileModel.findOne({ username: tweet.reposted_from.username });
            }

            return { tweet:{
                _id: tweet._id,
                username: tweet.username,
                is_poll: tweet.poll?.question ? true : false,
                tweet: tweet.tweet || null,
                gif: tweet.gif || null,
                emoji: tweet.emoji || null,
                schedule: tweet.schedule || null,
                poll: { question: tweet.poll?.question, options: tweet.poll?.options },
                media: { data: tweet.media?.data || null, contentType: tweet.media?.contentType },
                retweet_count: tweet.retweets?.length,
                retweeted: false, 
                like: tweet.likes?.length,
                comment_count: tweet.comments?.length,
                is_repost: tweet.is_repost || false,
                createdAt: tweet.createdAt,
                reposted_from: {
                    tweet: {
                        _id: tweet.reposted_from?._id,
                        is_poll: tweet.reposted_from?.poll?.question ? true : false,
                        tweet: tweet.reposted_from?.tweet || null,
                        gif: tweet.reposted_from?.gif || null,
                        emoji: tweet.reposted_from?.emoji || null,
                        schedule: tweet.reposted_from?.schedule || null,
                        poll: { question: tweet.reposted_from?.poll?.question, options: tweet.reposted_from?.poll?.options },
                        media: { data: tweet.reposted_from?.media?.data || null, contentType: tweet.reposted_from?.media?.contentType },
                        createdAt: tweet.reposted_from?.createdAt
                    },
                    userDetails: { username: originalPoster?.username, name: originalPoster?.name || null, userProfilePic: originalPoster?.profile_pic || null }
                }
            }};
        }));

 
        const retweetData = await Promise.all(retweets.map(async (retweet) => {
            if (retweet.originalTweetId) {
                const originalTweet = retweet.originalTweetId;

                return { tweet:
                {_id: retweet._id,
                username: user.username,
                is_poll: null,
                tweet: null,
                gif:  null,
                emoji: null,
                schedule: null,
                poll: { question: null, options: null },
                media: { data: null, contentType: null },
                retweet_count: null,
                retweeted: true, 
                like: retweet.likes?.length,
                comment_count: retweet.comments?.length,
                is_repost: true, 
                createdAt: retweet.createdAt,

                reposted_from: {
                    tweet: {
                        _id: originalTweet._id,
                        is_poll: originalTweet.poll?.question ? true : false,
                        tweet: originalTweet.tweet || null,
                        gif: originalTweet.gif || null,
                        emoji: originalTweet.emoji || null,
                        schedule: originalTweet.schedule || null,
                        poll: { question: originalTweet.poll?.question, options: originalTweet.reposted_from?.poll?.options },
                        media: { data: originalTweet.media?.data || null, contentType: originalTweet.reposted_from?.media?.contentType },
                        createdAt: originalTweet.createdAt
                    },
                    userDetails: { username: originalTweet.username, name: originalTweet.name || null, userProfilePic: user.profile_pic || null }
                
            }}};
            } else {

                return null;
            }
        }));


        const postData = [...tweetsData, ...retweetData.filter(retweet => retweet !== null)];

        return res.status(statusCodes.success).json({ posts: postData });
    } catch (error) {
        logger.error('Error while retrieving posts', error);
        return res.status(statusCodes.badGateway).json({ message: 'Error while retrieving posts' });
    }
};




const viewReplies = async (req, res) => {
    const { username } = req.params;
    try{
        const user = await profileModel.findOne({ username});

        const replies = await commentModel.find({ userId : user._id}).populate('tweetId').exec();
        console.log(replies)

        let originalPoster = null;

        const replyData = replies.map(reply => {
            return{ tweet:{
                _id: reply._id,
                content: reply.content,
                createdAt: reply.createdAt,
                tweetId:{
                    _id: reply.tweetId._id,
                    username: reply.tweetId.username,
                    is_poll: reply.tweetId.poll?.question ? true : false,
                    tweet: reply.tweetId.tweet || null,
                    gif: reply.tweetId.gif || null,
                    emoji: reply.tweetId.emoji || null,
                    schedule: reply.tweetId.schedule || null,
                    poll: { question: reply.tweetId.poll?.question, options: reply.tweetId.poll?.options },
                    media: { data: reply.tweetId.media?.data || null, contentType: reply.tweetId.media?.contentType },
                    retweet_count: reply.tweetId.retweets?.length,
                    retweeted: false, 
                    like: reply.tweetId.likes?.length,
                    comment_count: reply.tweetId.comments?.length,
                    is_repost: reply.tweetId.is_repost || false,
                    createdAt: reply.tweetId.createdAt,
                    reposted_from: {
                        tweet: {
                            _id: reply.tweetId.reposted_from?._id,
                            is_poll: reply.tweetId.reposted_from?.poll?.question ? true : false,
                            tweet: reply.tweetId.reposted_from?.tweet || null,
                            gif: reply.tweetId.reposted_from?.gif || null,
                            emoji: reply.tweetId.reposted_from?.emoji || null,
                            schedule: reply.tweetId.reposted_from?.schedule || null,
                            poll: { question: reply.tweetId.reposted_from?.poll?.question, options: reply.tweetId.reposted_from?.poll?.options },
                            media: { data: reply.tweetId.reposted_from?.media?.data || null, contentType: reply.tweetId.reposted_from?.media?.contentType },
                            createdAt: reply.tweetId.reposted_from?.createdAt
                        },
                        userDetails: { username: originalPoster?.username, name: originalPoster?.name || null, userProfilePic: originalPoster?.profile_pic || null }
                    }
                }}};

        });

        return res.status(statusCodes.success)
        .json({replies: replyData})
 


    } catch ( error) {
        logger.error(' error while retrieving replies', error);
        return res.status(statusCodes.badGateway)
        .json({ message: ' error while retrieving replies'})
    }

};


const viewLikes = async (req, res) => {
    const { username} = req.params;

    try{
        const user = await profileModel.findOne({ username});
        const likes = await likeModel.find({ userId: user._id}).populate('tweetId').exec();

        let originalPoster = null;

        const likeData = likes.map(like => {
            return{tweet:{_id: like._id,
                content: like.content,
                createdAt: like.createdAt,
                tweetId:{
                    _id: like.tweetId._id,
                    username: like.tweetId.username,
                    is_poll: like.tweetId.poll?.question ? true : false,
                    tweet: like.tweetId.tweet || null,
                    gif: like.tweetId.gif || null,
                    emoji: like.tweetId.emoji || null,
                    schedule: like.tweetId.schedule || null,
                    poll: { question: like.tweetId.poll?.question, options: like.tweetId.poll?.options },
                    media: { data: like.tweetId.media?.data || null, contentType: like.tweetId.media?.contentType },
                    retweet_count: like.tweetId.retweets?.length,
                    retweeted: false, 
                    like: like.tweetId.likes?.length,
                    comment_count: like.tweetId.comments?.length,
                    is_repost: like.tweetId.is_repost || false,
                    createdAt: like.tweetId.createdAt,
                    reposted_from: {
                        tweet: {
                            _id: like.tweetId.reposted_from?._id,
                            is_poll: like.tweetId.reposted_from?.poll?.question ? true : false,
                            tweet: like.tweetId.reposted_from?.tweet || null,
                            gif: like.tweetId.reposted_from?.gif || null,
                            emoji: like.tweetId.reposted_from?.emoji || null,
                            schedule: like.tweetId.reposted_from?.schedule || null,
                            poll: { question: like.tweetId.reposted_from?.poll?.question, options: like.tweetId.reposted_from?.poll?.options },
                            media: { data: like.tweetId.reposted_from?.media?.data || null, contentType: like.tweetId.reposted_from?.media?.contentType },
                            createdAt: like.tweetId.reposted_from?.createdAt
                        },
                        userDetails: { username: originalPoster?.username, name: originalPoster?.name || null, userProfilePic: originalPoster?.profile_pic || null }
                    }
                }}};
        });

        return res.status(statusCodes.success)
        .json({ likeData})

    } catch( error){
        logger.error(' error while retrieving likes', error);
        return res.status(statusCodes.badGateway)
        .json({ message: ' error while retrieving likes'})

    }

};


// const viewMedia = async (req, res) => {

//     };

module.exports = {
    viewPosts,
    viewReplies,
    viewLikes
};
