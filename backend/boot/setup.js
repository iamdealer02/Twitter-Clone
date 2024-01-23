const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const app = express();
const PORT = 8080; //USE env file later
require('dotenv').config(); 

// custom middleware

const cors = require('cors');
const session = require('express-session');




// Routes 

// mongodb connection 
try {
    mongoose.connect("mongodb://localhost:27017/Airbnb");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB" + error);
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

        app.use(cors());
        app.use(helmet());
        app.use(express.json());

       
        // Route registration

    }catch (error){
   
        console.error(error, 'Error registering middlewares and routes' + JSON.stringify(error, undefined, 2));
    }
};



// error handler function to be used in the main
const handleError =() => {
    process.on("uncaughtException", (error) => {
        console.error(error, `Uncaught Exception occured : ${JSON.stringify(error.stack)}`);
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
        console.error(
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