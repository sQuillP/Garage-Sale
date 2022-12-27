const mongoose = require('mongoose');
const asyncHandler = require('../Middleware/AsyncHandler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/ErrorResponse');
const bcrypt = require("bcryptjs");

/**
 * tested: false
 * POST: api/v1/auth/login
 */
exports.login = asyncHandler(async (req,res,next)=> {

    const [email, password] = [req.body.email, req.body.password];

    const fetchedUser = await User.findOne({email: email})
    .select("+password")
    .populate('conversations');
    
    if(fetchedUser == null){
        return next(
            new ErrorResponse(
                404,
                `User does not exist`
            )
        );
    }

    const isValidPassword = await bcrypt.compare(password,fetchedUser.password);

    if(!isValidPassword){
        return next(
            new ErrorResponse(
                401,
                `Invalid password`
            )
        );
    }

    //Just delete the password of the user that is signing in.
    delete fetchedUser.password;

    const signedToken = signToken(fetchedUser);

    res.json({
        status: 200,
        data: signedToken
    });
});


/**
 * @Route: POST api/v1/auth/signup
 * @Scope: Public
 * 
 * @params:
 *  - username
 */
exports.signup = asyncHandler( async(req,res,next)=> {

    //create a new user
    const newUser = await User.create(req.body);

    //create a signed JWT for that user.
    const signedToken = signToken(newUser);

    //send signed token back to the user.
    res.status(201).json({
        status: 201,
        data: signedToken
    });
});


/**
 * Send a new token to a user with their updated details ecoded to token.
 * @Route: POST api/v1/auth/refreshToken
 */
exports.refreshToken = asyncHandler(async (req,res,next)=> {
    const updatedUser = await User.findById(req.user);
    const signedToken = signToken(updatedUser);
    res.status(200).json({
        success: true,
        data: signedToken
    })

});


function signToken(userObj){

    return jwt.sign({...userObj},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRATION,
        issuer: "http://localhost:5000",
        audience: ["consumers"]
    });

}