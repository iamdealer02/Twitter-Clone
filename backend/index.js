const {startApp} = require("./boot/setup");

(async() =>{
    try{
        await startApp();
        console.log('Application started');
    }catch(err){
        
        console.error(`Error in index.js => startApp() : ${JSON.stringify(err, undefined, 2)}`);
    }
})();

