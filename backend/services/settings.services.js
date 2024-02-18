const pool = require('../boot/database/db_connect');
const statusCode = require('../constants/statusCode');
const logger = require('../middleware/winston');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const changePassword = async (req, res) => {
    // to handle db connection
    let client; 

    try {
        // extract token from headers and decode user info
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token);
        
        if (!decodedToken) {
            return res.status(statusCode.unauthorized).json({ message: 'Session Expired' });
        }
        
    
        const username = decodedToken.id;

        //extract from request body
        const { currentPassword, newPassword } = req.body;

        //check if data are provoded
        if (!currentPassword || !newPassword) {
            return res.status(statusCode.missingParameters)
                .json({ message: 'Please fill out all fields' });
        }
        client = await pool.connect();

        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);

        //check if user exists
        if (result.rows.length === 0) {
            return res.status(statusCode.unauthorized)
                .json({ message: 'User not found' });

        } else {
            // extract record from the query
            const userRecord = result.rows[0];
            const currentPasswordCorrect = await bcrypt.compare(currentPassword, userRecord.password);

            //check if current pw is incorrect
            if (!currentPasswordCorrect) {
                return res.status(statusCode.unauthorized)
                    .json({ message: 'Current password is incorrect' });

            // check if current pw is the sam eas the new requested pw        
            } else if (currentPassword === newPassword) {            
                return res.status(statusCode.badRequest)
                    .json({ message: 'New password must be different from current password' });
            } else {

                // hash the pw
                const hashedNewPassword = await bcrypt.hash(newPassword, 10);

                // update the password in the database
                await client.query('UPDATE users SET password = $1 WHERE username = $2', [hashedNewPassword, username]);
        
                return res.status(statusCode.success).json({ message: 'Password changed successfully' });
            }
        }
    } catch (error) {
        logger.error('Error while changing password:', error);
        return res.status(statusCode.serverError)
            .json({ message: 'Error while changing password' });
    } finally {
        if (client) {
            client.release();
        }
    }
};


module.exports = {
    changePassword
};
