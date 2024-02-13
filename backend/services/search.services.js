const ProfileModel = require('../models/profileModel');
const pool = require('../boot/database/db_connect')
const logger = require('../middleware/winston');
const statusCode = require('../constants/statusCode');
const jwt = require('jsonwebtoken');


const searchUsers = async (req, res)=> {
    // search the keyword in the database, name
    const keyword = req.query.keyword;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    const user = decodedToken.id;
    if (!decodedToken) {
        return res.status(statusCode.unauthorized).json({ message: 'Session Expired' });
    }
    try{
        // username and name both should be searched
        // searching in mongo for username and name
        const result1 = await ProfileModel.find({$or: [{username: {$regex: keyword, $options: 'i'}}, {name: {$regex: keyword, $options: 'i'}}]});
        // filter search results to exclude the logged in user
        const result = result1.filter(item => item.username !== user);
        if (result.length > 0) {
            // if result is found, send the result
            return res.status(statusCode.success).json({result});
        } else {
            // if no result is found, send a message
            return res.status(statusCode.success).json({message: 'No result found'});
        }
    }catch (error) {
        logger.error(`Error in search.services.js => searchUsers() : ${error}`);
        res.status(statusCode.badRequest).json({message: 'Internal server error'});
    }

}

module.exports = {
    searchUsers,
};