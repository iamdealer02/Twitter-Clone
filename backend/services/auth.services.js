const pool = require('../boot/database/db_connect');
const statusCode = require('../constants/statusCode');
const logger = require('../middleware/winston');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ProfileModel = require('../models/profileModel');

const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(statusCode.missingParameters)
            .json({ message: 'Please fill out all fields' });
    } else {
        const client = await pool.connect();
        try {
            // check if user already exists

            const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length > 0) {
                return res.status(statusCode.userAlreadyExists)
                    .json({ message: 'User already exists' });
            }

            // check if username already exists
            const result2 = await client.query('SELECT * FROM users WHERE username = $1', [username]);
            if (result2.rows.length > 0) {
                return res.status(statusCode.userAlreadyExists)
                    .json({ message: 'Username already exists' });
            } else {
                // hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // insert user into the database with hashed password
                await client.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`, [username, email, hashedPassword]);
                // put the username in the profile MongoDB and get the mongo id


                const newProfile = new ProfileModel({
                    username,
                    profile_picture: null,
                    cover_picture: null,
    
                });
                req.session.profileId = newProfile._id;
                req.session.save();
            

                await newProfile.save();
                logger.info('User registered successfully');
                // login the user after registration


                const token = jwt.sign({ id: username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                logger.info(`User: ${email} logged in successfully`);
                return res.status(statusCode.success).json({ message: token });
                
            }
        } catch (error) {
            logger.error('Error while executing the Query', error);
            res.status(statusCode.queryError)
                .json({ message: 'Error while executing register' });
        } finally {
            // Release the client back to the pool
            client.release();
        }
    }
};


const login = async (req, res) => {
    const { user, password } = req.body;
    if (!user || !password) {
        return res.status(statusCode.missingParameters)
            .json({ message: 'Please fill out all fields' });
    } else {
        let client = null; // Declare client outside the try block

        try {
            client = await pool.connect();
            
            // user can use either username or email to login
            const result = await client.query('SELECT * FROM users WHERE username = $1 OR email = $1', [user]);
            
            if (result.rows.length === 0) {
                return res.status(statusCode.unauthorized)
                    .json({ message: 'User not found' });
            } else {
                const userRecord = result.rows[0];
                const passwordMatch = await bcrypt.compare(password, userRecord.password);

                if (!passwordMatch) {
                    logger.error('Invalid Credentials');
                    return res.status(statusCode.unauthorized)
                        .json({ message: 'Invalid Credentials' });
                } else {
                    const mongoProfile = await ProfileModel.findOne({ username: userRecord.username });
                    // generate token with 1 hour expiration
                    req.session.profileId = mongoProfile._id;
                    // save session
                    req.session.save();
                    console.log('req.session.profileId:', req.session.profileId);
                    const token = jwt.sign({ id: userRecord.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                    res.status(statusCode.success).json({ message: token , username: userRecord.username, email: userRecord.email});
                    logger.info(`User: ${userRecord.email} logged in successfully`);
                }
            }
        } catch (error) {
            logger.error('Error while executing the Query', error);
            res.status(statusCode.queryError)
                .json({ message: 'Error while Login' });
        } finally {
            if (client) {
                await client.release();
            }
        }
    }
};

const logout = async (req, res) => {
    if (req.session.profileId) {
        delete req.session.profileId;
        req.session.destroy((err) => {
            if (err) {
                logger.error('Error destroying session:', err);
                return res.status(statusCode.serverError).json({ message: 'Error logging out' });
            }
            logger.info('User logged out successfully');
            return res.status(statusCode.success).json({ message: 'User logged out successfully' });
        });
    } else {
        logger.info('User logged out successfully');
        return res.status(statusCode.success).json({ message: 'User logged out successfully' });
    }
};



module.exports = {
    register,
    login,
    logout
};