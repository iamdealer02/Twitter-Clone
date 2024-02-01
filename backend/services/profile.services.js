const pool = require("../boot/database/db_connect");
const statusCodes = require("../constants/statusCode");
const profileModel = require("../models/profileModel");


const getUserProfile = async (req, res) => {
    const { username } = req.params;
    console.log(username)

    let uname = username;
    let client;
    
    try {
        
        client = await pool.connect();
        const result = await client.query('SELECT * FROM users WHERE username = $1 ', [username]);
        if (result.rows.length > 0){
                const user_details = await profileModel.find({ username: uname});
                res.status(statusCodes.success).json({ user_details});      

        }
        
        

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(statusCodes.queryError).json({ message: 'Error fetching user profile' });

    } finally {
        if (client) {
            client.release();
        }
    }
};




module.exports = {
    
    getUserProfile

};