//  export the middleware directly
module.exports =(req,res, next) => {
    const error = new Error(`Not Found`);
    res.status(404).json({
        error: {
            message: error.message
        }
    })
 }