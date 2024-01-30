const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const app = express();
const PORT = 8080; //USE env file later
require('dotenv').config(); 
const bodyParser = require('body-parser');


// custom middleware

const cors = require('cors');
const session = require('express-session');
const logger = require('../middleware/winston');
const morgan = require('morgan');
const notFound = require('../middleware/notFound');
const healthCheck = require('../middleware/healthcheck');

// Routes 
const authRoutes = require('../routes/auth.routes');
const tweetRoutes = require('../routes/tweet.routes')
// mongodb connection 
try {
    mongoose.connect("mongodb://localhost:27017/Twitter");
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB" + error);
  }

// Middleware + Route Registration
const registerCoreMiddleWare = async () => {
    try {
        app.use(
            session({
                secret: 'secret',
                resave: false,
                saveUninitialized: true,
                cookie: {
                    secure: false,
                    httpOnly: true,
                },
            })
        );
                // Increase payload size limit to 50MB
        app.use(bodyParser.json({ limit: '50mb' }));
        app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        app.use(morgan('combined', { stream: logger.stream}));
        app.use(cors());
        app.use(helmet());
        app.use(express.json());
        app.use(healthCheck);
       
        // Route registration
        app.use('/auth', authRoutes)
        app.use('/tweet', tweetRoutes)
        app.use(notFound);

        logger.info("Done registering all middlewares and routes")

    }catch (error){
   
        logger.error(error, 'Error registering middlewares and routes' + JSON.stringify(error, undefined, 2));
    }
};



// error handler function to be used in the main
const handleError =() => {
    process.on("uncaughtException", (error) => {
        logger.error(error, `Uncaught Exception occured : ${JSON.stringify(error.stack)}`);
        process.exit(1);
    });
}

// start server 

const startApp = async () => {
    try {
        // start by running the middleware registeration
        await registerCoreMiddleWare();

        app.listen(PORT, () => {
            // log the information
            console.log(`Server started on port ${PORT}`);
        })
        // handle errors with function
        handleError();

    }catch(err){
        logger.err(
            `startup:: Error while booting the application: ${JSON.stringify(
                err,
                undefined,
                2
            )}`
        );
        throw err;

    }
};

module.exports = {startApp};