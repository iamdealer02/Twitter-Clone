const pool = require("../boot/database/db_connect");
const statusCodes = require("../constants/statusCode");
const profileModel = require("../models/profileModel");
const TweetModel = require("../models/tweets");
const jwt = require("jsonwebtoken");

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

    return res.status(statusCodes.success).json({ user_details });
} catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(statusCodes.queryError).json({ message: 'Error fetching user profile' });
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




module.exports = {
    
    getUserProfile,
    voteInPoll,

};