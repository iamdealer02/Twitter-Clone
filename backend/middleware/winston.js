const appRoot = require('app-root-path');
const winston = require('winston');

// define the custom settings for each transport (file, console)
const options ={
    file: {
        // upto level 2 error, warn, info
        level: 'info',
        filename : `${appRoot}/logs/app.log`,
        handleExceptions: true,
        maxSize: 5242880, // 5MB
        maxFiles: 5,
        format:winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )

    },
    console : {
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
            // add color to the console
            winston.format.colorize(),
            // the format of the message displayed
            winston.format.simple()
        ),
    },
 };

 //  instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function 

logger.stream = {
    write: function(message, encoding){
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
   
};

module.exports = logger;