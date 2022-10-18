const asyncHandler = require("../Middleware/AsyncHandler");
const User = require('../models/User');
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * Routes must be restricted and should only allow admin access.
 */


/*
GET: api/v1/users
*/
exports.getUsers = asyncHandler(async (req,res,next)=> {
    const users = await User.find();
    let status = 200;
    res.status(status).json({
        status,
        data: users
    });
});


/*
GET: api/v1/users/:userId
*/
exports.getUserById = asyncHandler(async (req,res,next)=> {
    const user = await User.findById(req.params.userId);
    let status = 200;
    if(user == null)
        status= 404;

    res.status(status).json({
        status,
        data: user
    });
});


/**
 * POST: api/v1/users
 */
exports.createUser = asyncHandler(async (req,res,next)=> {
    console.log(req.body);
   const user = await User.create(req.body);

    return res.status(201).json({
        status:201,
        content: user
    });
});



/**
 * PUT: api/v1/users/:userId
 */
 exports.updateUser = asyncHandler(async (req,res,next)=> {
   const updatedUser = await User.findByIdAndUpdate(req.params.userId);


   if(updatedUser == null){
    return next(
        new ErrorResponse(
            404,
            `User ${req.params.userId} does not exist`
        )
    );
   }

    return res.status(200).json({
        status:200,
        content: updatedUser
    });
});



/**
 * DELETE: api/v1/users/:userId
 */
 exports.deleteUser = asyncHandler(async (req,res,next)=> {


    const deletedUser = await User.findById(req.params.userId);
 
 
    if(deletedUser == null){
     return next(
         new ErrorResponse(
             404,
             `User ${req.params.userId} does not exist`
         )
     );
    }

    await deletedUser.deleteOne();

 
     return res.status(200).json({
         status:200,
         content: deletedUser
     });
 });