const pool = require("../boot/database/db_connect");
const statusCodes = require("../constants/statusCode");
const profileModel = require("../models/profileModel");
const logger = require('../middleware/winston');

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
// In your server code
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
            profile_picture: mongoFetch[0].profile_picture,
            cover_picture: mongoFetch[0].cover_picture,
            username: mongoFetch[0].username,
            email: sqlFetch[0].email,
            new_timestamp_column: sqlFetch[0].new_timestamp_column,
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

    res.status(statusCodes.success).json({ user_details });
} catch (error) {
    console.error('Error fetching profile:', error);
    res.status(statusCodes.queryError).json({ message: 'Error fetching user profile' });
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
    

module.exports = {
    
    getUserProfile,
    followUser,
    getFollowers,
    getFollowings

};