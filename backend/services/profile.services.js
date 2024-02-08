const { error } = require("winston");
const pool = require("../boot/database/db_connect");
const statusCodes = require("../constants/statusCode");
const logger = require("../middleware/winston");
const profileModel = require("../models/profileModel");
const tweets = require("../models/tweets")



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

    res.status(statusCodes.success).json({ user_details });
} catch (error) {
    console.error('Error fetching profile:', error);
    res.status(statusCodes.queryError).json({ message: 'Error fetching user profile' });
}
};


const newMongoModel = async (req, res) => {

    const { username } = req.params;
    const {name, bio, location, profile_picture, cover_picture, followers, following } = req.body.user_details[0];
    const client = await pool.connect();


    const profilemedia = profile_picture ? Buffer.from(profile_picture, 'base64') : null;
    const covermedia = cover_picture ? Buffer.from(cover_picture, 'base64') : null;

    try{

        console.log(covermedia)
        console.log(profilemedia)


       const newUser = new profileModel({            
            username,
            name: name || null,  
            profile_picture:  { data: profilemedia, contentType: 'image/png' },
            cover_picture: { data: covermedia, contentType: 'image/png' },
            followers: followers || null,
            following: following || null
         });

        await newUser.save();

        const sqlQuery = 'UPDATE users SET bio = $1, location = $2 WHERE username = $3';
        const sqlValues = [bio || null, location || null, username || null]
        const sqlExecution = await client.query ( sqlQuery, sqlValues)
        console.log(sqlExecution)

        console.log(newUser);
        res.status(201).json(newUser);

    }catch (error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });

        

    }finally{
        client.release();
    }
};



const editUserProfile = async (req, res) => {
    const { username } = req.params;
    const userDetails = req.body.user_details;

    if (!userDetails || userDetails.length === 0) {
        return res.status(400).json({ error: 'Invalid user details provided' });
    }
    
    const { name, bio, location, profile_picture, cover_picture } = userDetails[0];
    
    const client = await pool.connect();

    try{
        
        const mongoUser = await profileModel.findOne({ username })

        if (! mongoUser){
            await newMongoModel(req, res);

        } else{
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








module.exports = {
    getUserProfile,
    editUserProfile,
    postBookmarks,
    getBookmarks
    


};