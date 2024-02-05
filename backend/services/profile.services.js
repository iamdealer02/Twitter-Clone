const pool = require("../boot/database/db_connect");
const statusCodes = require("../constants/statusCode");
const profileModel = require("../models/profileModel");



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




module.exports = {
    
    getUserProfile

};