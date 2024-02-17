const { error } = require("winston");
const pool = require("../boot/database/db_connect");
const statusCodes = require("../constants/statusCode");
const logger = require("../middleware/winston");
const profileModel = require("../models/profileModel");
const TweetModel = require("../models/tweets");
const jwt = require("jsonwebtoken");
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

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    
    const username = decodedToken.id;
    if (!decodedToken) {
        return res.status(statusCodes.unauthorized).json({ message: 'Session Expired' });
    }

    const userDetails = req.body.user_details;



    if (!userDetails || userDetails.length === 0) {
        return res.status(400).json({ error: 'Invalid user details provided' });
    }
    
    const { name, bio, location, profile_picture, cover_picture } = userDetails[0];
    
    const client = await pool.connect();


    try{        
        let mongoUser = await profileModel.findOne({ username });

        if (!mongoUser) {
            await newMongoModel(req, res);
        } else {
            mongoUser.name = name || mongoUser.name || null;
            mongoUser.profile_picture = profile_picture || mongoUser.profile_picture || null;
            mongoUser.cover_picture = cover_picture || mongoUser.cover_picture || null;
            

            await mongoUser.save();


            const sqlQuery = 'UPDATE users SET bio = $1, location = $2 WHERE username = $3';
            const sqlValues = [bio, location, username]
            const sqlExecution = await client.query ( sqlQuery, sqlValues)
            console.log(sqlExecution)  }
            res.status(200).json({ message: 'User profile updated in MongoDB' });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }finally{
        client.release();
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
    // const token = req.headers.authorization.split(' ')[1];
    // const decodedToken = jwt.decode(token);
    
    // const username = decodedToken.id;
    // if (!decodedToken) {
    //     return res.status(statusCodes.unauthorized).json({ message: 'Session Expired' });
    // } 

    const username = "u2";
    
    try{
        const userFetch = await profileModel.findOneAndUpdate(
            { username: username, bookmarks: bookmarks  },
            { $pull: { bookmarks: bookmarks } },
            { returnOriginal: false }
        );
        

        if (!userFetch) {
            const userFetch = await profileModel.findOneAndUpdate(
                { username: username },
                { $addToSet: { bookmarks: bookmarks } },
                { returnOriginal: false }
            );
            return res.status(statusCodes.success).json({ message: 'bookmarked Successfully' });
        }   
        return res.status(statusCodes.success).json({ message: 'removed bookmark Successfully' });

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

    };












    







module.exports = {
    getUserProfile,
    editUserProfile,
    postBookmarks,
    getBookmarks
    
,
    followUser,
    getFollowers,
    getFollowings,



    voteInPoll,


};