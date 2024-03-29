const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const app = express();
const PORT = 8080; //USE env file later
const SOCKET_PORT = 3001;
require('dotenv').config();
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const http = require('http'); // Import http module
const { createSocketServer } = require('../sockets/socket');
const jwt = require('jsonwebtoken')


// custom middleware
const cors = require('cors');  
const session = require('express-session');
const logger = require('../middleware/winston');
const morgan = require('morgan');
const notFound = require('../middleware/notFound');
const healthCheck = require('../middleware/healthcheck');




// create a server
const server = http.createServer(app);
const io = new Server(server, {  // Create Socket.IO server using the HTTP server
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        
    },
});

// Routes 
const authRoutes = require('../routes/auth.routes');
const profileRoutes = require('../routes/profile.routes');
const tweetRoutes = require('../routes/tweet.routes');
const chatRoutes = require('../routes/message.routes');
const searchRoutes = require('../routes/search.routes');
const settingsRoutes = require('../routes/settings.routes');



//const tweetServices = require('../services/tweet.services')

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
        app.use(cors({
            origin: 'http://localhost:3000',
            credentials: true,
        }));
        app.use(
            session({
                secret: '64534847638dgfhjvfgdyucgt78r6g', 
                resave: false,
                saveUninitialized: true, 
                cookie: {
                    secure: false, 
                    httpOnly: true,
                },
            })
        );
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(morgan('combined', { stream: logger.stream }));

        app.use(helmet());
        app.use(healthCheck);
        // app.use(uploadMiddleware);

        app.use('/auth', authRoutes);
        app.use('/profile', profileRoutes);
        app.use('/tweet', tweetRoutes)
        app.use('/chat', chatRoutes);
        app.use('/search', searchRoutes);
        app.use('/settings', settingsRoutes);

        
    //    chat using Socket.io
        createSocketServer(io);
    // Route registration

        app.use(notFound);



        logger.info("Done registering all middlewares and routes")

    } catch (error) {
        logger.error(error, 'Error registering middlewares and routes' + JSON.stringify(error, undefined, 2));
    }
};




// error handler function to be used in the main
const handleError = () => {
    process.on("uncaughtException", (error) => {
        logger.error(error, `Uncaught Exception occured : ${JSON.stringify(error.stack)}`);
        process.exit(1);
    });
}





// start server 
const startApp = async () => {
    try {
        // start by running the middleware registration
        await registerCoreMiddleWare();
        // start the server
        server.listen(SOCKET_PORT, () => {
            console.log('Socket listening on', SOCKET_PORT);
        });

        app.listen(PORT, () => {
            console.log('main server listening on', PORT);
        });
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




module.exports = { startApp };

