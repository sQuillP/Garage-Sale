


//Catch-all error object
const errorFn = (error,req,res,next)=> {
    console.log('hit the error route');
    console.log(error.message)



    res.status(error.status || 500).json({
        status:error.status || 500,
        message: error.message
    });
}


module.exports = errorFn;