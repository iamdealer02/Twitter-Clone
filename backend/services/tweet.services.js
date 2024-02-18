const TweetModel = require('../models/tweets');
const logger = require('../middleware/winston');
const statusCode = require('../constants/statusCode');
const jwt = require('jsonwebtoken');
const profileModel = require('../models/profileModel');
const commentModel = require('../models/comment');
const retweetModel = require('../models/retweet');
const LikeModel = require('../models/like');
const saveImages = require('../aws/s3Bucket');




const createTweet = async (req, res) => {
    const { tweet, gif, poll, emoji, schedule } = req.body;
    const image = req.file ? req.file.buffer : null;

    try {


        // Upload image to S3 if it exists
        let imageUrl = null;
            
        // If an image is included in the request
        if (image) {
            // Set up parameters for uploading the image to S3
             imageUrl = await saveImages(req.file, image);
            // Send the PutObjectCommand to upload the image to S3

        }

        

        // Get the user ID from the decoded token
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        const username = decodedToken.id;

        // Ensure the token is valid
        if (!decodedToken) {
            return res.status(statusCode.unauthorized).json({ message: 'Session Expired' });
        }
        // if tweet exists, checking if there are hashtags
        let hashtagArray = null;
        if (tweet) {
            hashtags = tweet.match(/#\w+/g);
            console.log(hashtags);
            // making an array of hashtags
            hashtagArray = hashtags?.map(hashtag => hashtag.slice(1));
        }
     

        // MAKE poll options by changing json
         pollData = JSON.parse(poll);
            const pollOptions = pollData?.options?.map(option => ({ option }));
           console.log(pollOptions);
            // Create a new instance 
            const newTweet = new TweetModel ({
                username,
                is_poll: pollData.question ? true : false,
                tweet,
                gif,
                emoji,
                poll: { question: pollData.question, options: pollOptions },
                media: imageUrl ? imageUrl : null,
                hashtags: hashtagArray,
          
            });
    
            await newTweet.save();
            logger.info('Tweet created successfully');
            return res.status(statusCode.success).json({ message: 'Tweet created successfully', tweet: newTweet});
        
        } catch (error) {
            logger.error('Error while creating the tweet', error);
            return res.status(statusCode.queryError).json({ message: 'Error while creating the tweet' });
        }
    };

const getTweet = async (req, res) => {
    try {
        // check if the user is logged in
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        if (!decodedToken) {
            return res.status(statusCode.unauthorized).json({ message: 'Session Expired' });
        }
        const currentUser = req.session.profileId;
        // initialising an emoty array to have tweets and user details
        // Fetch all tweets sorted by the most recent
        // populate reposted_from field
        const tweets = await TweetModel.find().sort({ createdAt: -1 }).populate('reposted_from').exec();



        // Fetch user details for each tweet and populate tweetsData array
        const tweetsData = await Promise.all(tweets.map(async (tweet) => {
           
            const user = await profileModel.findOne({ username: tweet.username }   );
            // check if that particular tweet has been retweeted by current user
            const retweeted = await retweetModel.findOne({userId : currentUser, originalTweetId: tweet._id})
            //check if they are bookmarked
            const bookmarked = user.bookmarks.includes(tweet._id);
            // check if the user has liked the tweet
            const liked = await LikeModel.findOne({ userId: currentUser, tweetId: tweet._id });


            var originalPoster = null;
            if (tweet.is_repost) {
                originalPoster = await profileModel.findOne({ username: tweet.reposted_from.username });
            }   

            return { tweet:{
                _id: tweet._id,
                username : tweet.username,
                is_poll: tweet.poll?.question ? true : false,
                tweet : tweet.tweet || null,
                gif : tweet.gif || null,
                emoji : tweet.emoji || null,
                schedule : tweet.schedule || null,
                poll: { question: tweet.poll.question, options: tweet.poll.options },
                media : tweet.media,
                retweet_count: tweet.retweets?.length,
                retweeted: retweeted ? true : false,
                like : tweet.likes?.length,
                liked: liked ? true : false,
                comment_count : tweet.comments?.length,
                is_repost : tweet.is_repost || false,
                bookmarked: bookmarked ? true : false,
                createdAt: tweet.createdAt,
                reposted_from : {
                    tweet: {
                        _id: tweet.reposted_from?._id, 
                        is_poll: tweet.reposted_from?.poll?.question ? true : false,
                        tweet: tweet.reposted_from?.tweet || null,
                        gif: tweet.reposted_from?.gif || null,
                        emoji: tweet.reposted_from?.emoji || null,
                        schedule: tweet.reposted_from?.schedule || null,
                        poll: { question: tweet.reposted_from?.poll?.question, options: tweet.reposted_from?.poll?.options },
                        media: tweet.reposted_from?.media || null,
                        createdAt: tweet.reposted_from?.createdAt
                        
                    },
                    userDetails: {username: originalPoster?.username , name: originalPoster?.name || null, profile_picture: originalPoster?.profile_picture || null }
                }

            }, userDetails: {username: tweet.username, name: user?.name || null, profile_picture: user?.profile_picture || null } };
        }));
      
        // Send the response with tweetsData]=
        // console.log(tweetsData);
        return res.status(statusCode.success).json({ tweetsData });
    } catch (error) {
        // Log the error
        logger.error('Error while retrieving the tweet', error);
        
        // Handle the error and send an appropriate response
        return res.status(statusCode.badGateway).json({ message: 'Error while retrieving the tweet' });
    }
};


    
    const addComment = async (req, res) => {
        const { tweetId } = req.params;
        const { comment } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        if (!decodedToken) {
            return res.status(statusCode.unauthorized).json({ message: 'Session Expired' });
        }


        try {
            // save his id in session later
            const user = req.session.profileId;
            if (!user) {
                return res.status(statusCode.notFound).json({ message: 'User not found' });
            }
            // first putting the comment in the comment collection
            const newComment = new commentModel({ content: comment, userId: user, tweetId: tweetId });
            await newComment.save();
            // then adding the comment id to the tweet
            const tweet = await TweetModel.findOne({ _id: tweetId });
            if (!tweet) {
                return res.status(statusCode.notFound).json({ message: 'Tweet not found' });
            }
            tweet.comments.push(newComment._id);
            await tweet.save();
            return res.status(statusCode.success).json({ message: 'Comment added successfully' , comment_length : tweet.comments.length});
        } catch (error) {
            logger.error('Error while adding the comment', error);
            return res.status(statusCode.queryError).json({ message: 'Error while adding the comment' });
        }
    };
    
    const retweet = async (req, res) => {
        // one can retweet with a comment or without a comment
        // original tweetId
        const { ogTweetId } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        if (!decodedToken) {
            return res.status(statusCode.unauthorized).json({ message: 'Session Expired' });
        }
        try {
            // save his id in session later
            const user = req.session.profileId;
            // const user = '65c258e81dceafe61ff282b0'
          
            if (!user) {
                return res.status(statusCode.notFound).json({ message: 'User not found' });
            }
            // check if the user has already retweeted the tweet
            const retweet = await retweetModel.findOne({ userId: user, originalTweetId: ogTweetId });
            if (retweet){
                // pull it from the retweet collection
                await retweetModel.deleteOne({ _id: retweet._id });
                // pull it from the tweet
                const tweet = await TweetModel.findOne({ _id: ogTweetId });
            
                if (!tweet) {
                    return res.status(statusCode.notFound).json({ message: 'Tweet not found' });
                }
                tweet.retweets.pull(retweet._id);
              
                const response = {
                    retweet_count: tweet.retweets.length,
                    retweeted: false,
                                }
                await tweet.save();
                return res.status(statusCode.success).json({ message: 'Retweet removed successfully', tweet: response});

            }
            
            // first putting the retweet in the retweet collection
            const newRetweet = new retweetModel({ userId: user, originalTweetId: ogTweetId });
            await newRetweet.save();
            // then adding the retweet id to the tweet
            const tweet = await TweetModel.findOne({ _id: ogTweetId });
            if (!tweet) {
                return res.status(statusCode.notFound).json({ message: 'Tweet not found' });
            }
            tweet.retweets.push(newRetweet._id);
            await tweet.save();
            const response = {
                retweet_count: tweet.retweets.length,
                retweeted: true,
            }
            return res.status(statusCode.success).json({ message: 'Retweet added successfully', tweet: response });
        } catch (error) {
            logger.error('Error while adding the retweet', error);
            return res.status(statusCode.queryError).json({ message: 'Error while adding the retweet' });
        }

    }

    const repost = async (req, res) => {
        const { ogTweetId } = req.params;
        const { tweet, gif, image, poll, emoji, schedule } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        const username = decodedToken.id;
        if (!decodedToken) {
            return res.status(statusCode.unauthorized).json({ message: 'Session Expired' });
        }
        try {
            
            const tweetsave = new TweetModel({
                username: username,
                is_repost: true,
                reposted_from: ogTweetId,
                tweet,
                gif,
                emoji,
                schedule,
                poll,
                media: image ? image : null,
            });
            
            // Save the new tweet
            await tweetsave.save();
            const tweetmodel = await TweetModel.findOne({ _id: tweetsave._id }).populate('reposted_from').exec();
    
            const currentuser = req.session.profileId;
            // check if that particular tweet has been retweeted by current user
            const retweeted = await retweetModel.findOne({userId : currentuser, originalTweetId: tweetmodel._id})
            // if is_reposted, get user dat
            var originalPoster = null;
            if (tweetmodel.is_repost) {
                originalPoster = await profileModel.findOne({ username: tweetmodel.reposted_from.username });
            
            }   

            const tweetsData= {
                _id: tweetmodel._id,
                username : tweetmodel.username,
                is_poll: tweetmodel.poll?.question ? true : false,
                tweet : tweetmodel.tweet || null,
                gif : tweetmodel.gif || null,
                emoji : tweetmodel.emoji || null,
                schedule : tweetmodel.schedule || null,
                poll: { question: tweetmodel.poll.question, options: tweetmodel.poll.options },
                media: tweetmodel.media || null, 
                retweet_count: tweetmodel.retweets?.length,
                retweeted: retweeted ? true : false,
                like : tweetmodel.likes?.length,
                comment_count : tweetmodel.comments?.length,
                is_repost : tweetmodel.is_repost || false,
                createdAt: tweetmodel.createdAt,
                reposted_from : {
                    tweet: {
                        _id: tweetmodel.reposted_from?._id, 
                        is_poll: tweetmodel.reposted_from?.poll?.question ? true : false,
                        tweet: tweetmodel.reposted_from?.tweet || null,
                        is_poll: tweetmodel.reposted_from?.poll?.question ? true : false,
                        gif: tweetmodel.reposted_from?.gif || null,
                        emoji: tweetmodel.reposted_from?.emoji || null,
                        schedule: tweetmodel.reposted_from?.schedule || null,
                        poll: { question: tweetmodel.reposted_from?.poll?.question, options: tweetmodel.reposted_from?.poll?.options },
                        media: tweetmodel.reposted_from?.media || null,
                        createdAt: tweetmodel.reposted_from?.createdAt
                        
                    },
                    userDetails: {username: originalPoster?.username , name: originalPoster?.name || null, profile_picture: originalPoster?.profile_picture || null }
                }

            };
        return res.status(statusCode.success).json({ message: 'Repost added successfully', tweetsData: tweetsData });
        } catch (error) {
            logger.error('Error while adding the repost', error);
            return res.status(statusCode.queryError).json({ message: 'Error while adding the repost' });
        }
    }

    const likeTweet = async (req, res) => {
        const { tweetId } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        
        if (!decodedToken) {
            return res.status(statusCode.unauthorized).json({ message: 'Session Expired' });
        }
        try {
            const user = req.session.profileId; // Assuming the user's profileId is stored in the session
            //const user = '65ce34243e76a50aa291dac7'

            if (!user) {
                return res.status(statusCode.notFound).json({ message: 'User not found' });
            }
            // Check if the user has already liked the tweet
            const like = await LikeModel.findOne({ userId: user, tweetId: tweetId });
            
            if (like) {
                // If user has liked, remove the like
                await LikeModel.deleteOne({ _id: like._id });
                const tweet = await TweetModel.findOne({ _id: tweetId });
                
                if (!tweet) {
                    return res.status(statusCode.notFound).json({ message: 'Tweet not found' });
                }
                tweet.likes.pull(like._id);
                await tweet.save();
                
                const response = {
                    like: tweet.likes.length,
                    liked: false
                };
                return res.status(statusCode.success).json({ message: 'Like removed successfully', tweet: response });
            }
            // User is liking the tweet
            const newLike = new LikeModel({ userId: user, tweetId: tweetId });
            await newLike.save();
            
            // Add the like to the tweet
            const tweet = await TweetModel.findOne({ _id: tweetId });
            
            if (!tweet) {
                return res.status(statusCode.notFound).json({ message: 'Tweet not found' });
            }
            tweet.likes.push(newLike._id);
            await tweet.save();
            
            const response = {
                like: tweet.likes.length,
                liked: true
            };
            return res.status(statusCode.success).json({ message: 'Like added successfully', tweet: response });
        } catch (error) {
            console.error('Error while liking/unliking the tweet', error);
            return res.status(statusCode.queryError).json({ message: 'Error while liking/unliking the tweet' });
        }
    };
    // getting trending or most used hashtags
    const trending_hashtags = async (req, res) => {
        // const token = req.headers.authorization.split(' ')[1];
        // const decodedToken = jwt.decode(token);
        
        // if (!decodedToken) {
        //     return res.status(statusCode.unauthorized).json({ message: 'Session Expired' });
        // }
        // // find the most used hashtags
        try{
            const hashtags = await TweetModel.aggregate([
                // getting hashtags in higher order
                { $unwind: '$hashtags' },
                { $group: { _id: '$hashtags', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);
            // sending only the hashtags
            return res.status(statusCode.success).json({ hashtags });
        }
        catch (error) {
            logger.error('Error while retrieving the trending hashtags', error);
            return res.status(statusCode.queryError).json({ message: 'Error while retrieving the trending hashtags' });
        }
    }
    
    
module.exports = {
    createTweet,
    getTweet,
    addComment,
    retweet,
    repost,
    likeTweet,
    trending_hashtags

};
