
const pool = require("../boot/database/db_connect");
const statusCodes = require("../constants/statusCode");
const logger = require("../middleware/winston");
const profileModel = require("../models/profileModel");
const TweetModel = require("../models/tweets");
const jwt = require("jsonwebtoken");
const saveImages = require('../aws/s3Bucket');
const profileTweetServices = require('../services/profile.tweet.services');


const fetchFromSql = async (username) => {
    const client = await pool.connect();
    try{
        const result = await client.query('SELECT username, bio, location, email, new_timestamp_column FROM users WHERE username = $1 ', [username]);
        return result.rows;
    } finally{
        client.release();
    }
};






const getUserProfile = async (req, res) => {
    const { username } = req.params;
    console.log(username)    

try {
    const mongoFetch = await profileModel.find({ username });
    const sqlFetch = await fetchFromSql(username);

    let user_details = [];

    if (mongoFetch.length > 0 && sqlFetch.length > 0) {
        const combinedDetails = {
            _id: mongoFetch[0]._id,
            name: mongoFetch[0].name,
            bio: sqlFetch[0].bio,
            location: sqlFetch[0].location,
            profile_picture:  mongoFetch[0].profile_picture,
            cover_picture:  mongoFetch[0].cover_picture,
            username: mongoFetch[0].username,
            email: sqlFetch[0].email,
            new_timestamp_column: sqlFetch[0].new_timestamp_column,
            followers: mongoFetch[0].followers,
            following: mongoFetch[0].following,
        };
        user_details.push(combinedDetails);
       
        
    } else if (sqlFetch.length > 0) {
        user_details.push({
            username: sqlFetch[0].username,
            email: sqlFetch[0].email,
            new_timestamp_column: sqlFetch[0].new_timestamp_column,
            bio: sqlFetch[0].bio,
            location: sqlFetch[0].location,
        });
    } else {
        return res.status(statusCodes.success).json({ user_details: [] });
    }

 

    return res.status(statusCodes.success).json({ user_details });
} catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(statusCodes.queryError).json({ message: 'Error fetching user profile' });
}
};


const editUserProfile = async (req, res) => {
    try {
     
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        
        if (!decodedToken) {
            return res.status(statusCodes.unauthorized).json({ message: 'Session Expired' });
        }

        const username = decodedToken.id;
        const { name, bio, location } = req.body;

        

        console.log(name, bio, location)
        console.log(req.files)
        let profile_picture_url = null;
        let cover_picture_url = null;

       
        if (req.files && req.files.length >= 2) {
            // Access profile picture and cover picture files from req.files array
            const [profile_picture, cover_picture] = req.files;
            console.log(profile_picture, cover_picture)
            // Process profile picture
            if (profile_picture) {
                image = profile_picture.buffer;
                console.log(image)
                profile_picture_url = await saveImages( profile_picture, image) ;
            }

            // Process cover picture
            if (cover_picture) {
                image = cover_picture.buffer;
                console.log(image)
                cover_picture_url = await saveImages(cover_picture, image) ;
            }
        }

        const client = await pool.connect();

        try {        
            let mongoUser = await profileModel.findOne({ username });

            if (!mongoUser) {
                await newMongoModel(req, res);
            } else {
                mongoUser.name = name || mongoUser.name || null;
                mongoUser.profile_picture = profile_picture_url || mongoUser.profile_picture || null;
                mongoUser.cover_picture = cover_picture_url || mongoUser.cover_picture || null;

                await mongoUser.save();

                const sqlQuery = 'UPDATE users SET bio = $1, location = $2 WHERE username = $3';
                const sqlValues = [bio, location, username];
                await client.query(sqlQuery, sqlValues);
            }

            res.status(200).json({ message: 'User profile updated successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const voteInPoll = async (req, res) => {
    const {tweetId, optionId} = req.params;
    // current user
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    // if the token is invalid, return an error
    if (!decodedToken) {
        return res.status(statusCodes.unauthorized).json({ message: 'Session Expired' });
    }
    console.log('here')
    try {
                
    //    get it from the session later

        const user = req.session.profileId;
        const poll = await TweetModel.findOne({ _id: tweetId }).select('poll');
        if (!poll) {
            return res.status(statusCodes.notFound).json({ message: 'Tweet not found' });
        }

        const option = poll.poll.options.find(option => option._id.toString() === optionId);
        if (!option) {
            return res.status(statusCodes.notFound).json({ message: 'Option not found in the tweet' });
        }

        let alreadyVotedOptionIndex = -1;
        let newVoteOptionIndex = -1;

        // Finding if user has already voted and the index of the already voted option
        poll.poll.options.forEach((opt, index) => {
            if (opt.voters.includes(user)) {
                alreadyVotedOptionIndex = index;
            }
            if (opt._id.toString() === optionId) {
                newVoteOptionIndex = index;
            }
        });

        if (alreadyVotedOptionIndex !== -1) {
            // User has already voted
            if (alreadyVotedOptionIndex === newVoteOptionIndex) {
                // User is changing vote to the same option, so remove vote
                poll.poll.options[alreadyVotedOptionIndex].voters.pull(user);
            } else {
                // Remove vote from the previous option and add to the new one
                poll.poll.options[alreadyVotedOptionIndex].voters.pull(user);
                poll.poll.options[newVoteOptionIndex].voters.push(user);
            }
        } else {
            // User hasn't voted, add vote to the new option
            poll.poll.options[newVoteOptionIndex].voters.push(user);
        }
        
        // Saving the updated poll and sending the updated poll in respose
        await poll.save();
        return res.status(statusCodes.success).json({ message: 'Voted successfully', poll: poll });
    } catch (error) {
        console.error('Error voting in poll:', error);
        return res.status(statusCodes.badRequest).json({ message: 'Internal server error' });
    }
};

const postBookmarks = async (req, res) => {
    const {bookmarks} = req.params
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    
    const username = decodedToken.id;
    if (!decodedToken) {
        return res.status(statusCodes.unauthorized).json({ message: 'Session Expired' });
    } 


    try{
        // un bookmarking
        const userFetch = await profileModel.findOneAndUpdate(
            { username: username, bookmarks: bookmarks  },
            { $pull: { bookmarks: bookmarks } },
            { returnOriginal: false }
        );
        const response = {
            "bookmarked": false, 
        }
        

        if (!userFetch) {
            const userFetch = await profileModel.findOneAndUpdate(
                { username: username },
                { $addToSet: { bookmarks: bookmarks } },
                { returnOriginal: false }
            );
            const response = {
                "bookmarked": true,
            }
// send the response

            return res.status(statusCodes.success).json({ message: 'Bookmarked!', response :response });
        }   
        return res.status(statusCodes.success).json({ message: 'Unbookmarked!', response: response });

    } catch (error) {
        console.error('error saving bookmarks:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }


};




const getBookmarks = async (req, res) => {
    const {username} = req.params;

    try{
        const  userFetch = await profileModel.findOne({ username}).populate('bookmarks');
        return res.status(200).json({ message: userFetch})
        

    }catch(error){
        console.error('error fetching bookmarks:', error);
        return res.status(500).json({ error: 'Internal Server Error' })

    }

};


const followUser = async(req, res) => {
    // get token from the header 
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token); 
    
    const currentUser = decodedToken.id;
    if (!decodedToken) {
        return res.status(statusCodes.unauthorized).json({ message: 'Session Expired' });
    } 
    
    
    try {
        const { followedUserId } = req.params;

        // Check if the user is already following
        const result = await profileModel.findOneAndUpdate(
            { username: currentUser, following: followedUserId },
            { $pull: { following: followedUserId } },
            { returnOriginal: false }
        );

        if (result) {
            // If user is already following, remove the followedUserId from the following array
            const currentUserId = result._id;

            // Remove currentUserId from followed user's followers array
            await profileModel.findOneAndUpdate(
                { _id: followedUserId },
                { $pull: { followers: currentUserId } }
            );
            return res.status(statusCodes.success).json({ message: 'Unfollowed Successfully' });
        } else {
            // If user is not following, add the followedUserId to the following array
            const result = await profileModel.findOneAndUpdate(
                { username: currentUser },
                { $addToSet: { following: followedUserId } },
                { returnOriginal: false }
            );

            const currentUserId = result._id;

            // Add currentUserId to followed user's followers array
            await profileModel.findOneAndUpdate(
                { _id: followedUserId },
                { $addToSet: { followers: currentUserId } }
            );
           
            return res.status(statusCodes.success).json({ message: 'Followed Successfully' });
        }

        
    } catch (error) {
        logger.error(`Error in profile.services.js => followUser() : ${error}`);
        return res.status(statusCodes.badRequest).json({ message: 'Internal server error' });
    }
};

    const getFollowers = async(req ,res) => {
        // get for everyone 
        const {username} = req.params
        try{
            const followers = await profileModel.findOne({ username }).populate('followers');
            // followers.followers will now contain details of followers
           const followersList =  followers.followers.map( user => ({
                id: user._id,
                username: user.username,
                name: user.name || '', 
                profile_picture: user.profile_picture || ''

           }))
            res.status(statusCodes.success).json({ followersList });
        }catch(error){
            logger.error(`Error in profile.services.js => getFollowers() : ${error}`);
            return res.status(statusCodes.badRequest).json({ message: 'Internal server error' });
        }

        
    }

    // const isFollowing 
    const getFollowings = async(req,res) => {
        const {username } =req.params;
        
        try{
            const following = await profileModel.findOne({ username }).populate('following');
            console.log(following)
            const followingList = following.following.map(user => ({
                id: user._id,
                username: user.username,
                name: user.name || '', 
                profile_picture: user.profile_picture || '' 
            }));
            res.status(statusCodes.success).json({ following_details: followingList });

        }catch(error){
            logger.error(`Error in profile.services.js => getFollowing() : ${error}`);
            return res.status(statusCodes.badRequest).json({ message: 'Internal server error' });
        }

    }
    const recommendedAccounts = async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        const username = decodedToken.id;
       
        if (!decodedToken) {
            return res.status(401).json({ message: 'Session Expired' });
        }
        try {
            // Find the user document with the given username and populate the 'followers' field
            const user = await profileModel.findOne({ username }).populate('followers');
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Extract the followers from the populated field
            const followers = user.followers.map(follower => ({
                _id: follower._id,
                username: follower.username,
                name: follower.name,
                profile_picture: follower.profile_picture
            }));
    
            // Find uncommon followers 
            const uncommonFollowing = followers.filter(follower => !user.following.includes(follower._id));
    
            // Ensure there are at least 5 recommendations
            if (uncommonFollowing.length < 5) {
                const recentUsers = await profileModel.find({ username: { $ne: username } }).limit(5 - uncommonFollowing.length);
    
                // Filter recentUsers to exclude users already followed by the current user or already in uncommonFollowing
                const filteredRecentUsers = recentUsers.filter(recentUser => {
                    return !user.following.includes(recentUser._id) && !uncommonFollowing.some(f => f._id.toString() === recentUser._id.toString());
                });
    
                // Add filteredRecentUsers to uncommonFollowing
                filteredRecentUsers.forEach(recentUser => {
                    uncommonFollowing.push({
                        _id: recentUser._id,
                        username: recentUser.username,
                        name: recentUser.name,
                        profile_picture: recentUser.profile_picture
                    });
                });
            }
    
            // You can then send the uncommon following as a response
            res.status(200).json({ uncommonFollowing });
        } catch (error) {
            console.error('Error fetching recommended accounts:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
    


module.exports = {
    getUserProfile,
    editUserProfile,
    postBookmarks,
    getBookmarks,
    followUser,
    getFollowers,
    getFollowings,
    voteInPoll,
    recommendedAccounts


};