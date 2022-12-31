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

    let users = null;
    if(req.query.name){
        users = await User.find({fullName:{
            $regex: req.query.name,
            $options: "$i"
        }}).limit(10);
    } else{
        users = await User.find();
    }


    let status = 200;
    res.status(status).json({
        status,
        data: users
    });
});


/*
GET: api/v1/users/getMe
*/
exports.getMe = asyncHandler(async (req,res,next)=> {
    console.log('in getme')
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success:true,
        data: user
    });
});


/*
GET: api/v1/users/:userId
*/
exports.findUser = asyncHandler(async(req,res,next)=> {
    const foundUser = await User.findById(req.params.userId);
    res.status(200).json({
        success: true,
        data: foundUser
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
 * PUT: api/v1/users/updateUser
 * 
 */
 exports.updateUser = asyncHandler(async (req,res,next)=> {

   const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body);


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