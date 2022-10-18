const mongoose = require('mongoose');
const asyncHandler = require('../Middleware/AsyncHandler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/ErrorResponse');
const bcrypt = require("bcryptjs");

/**
 * tested: false
 * GET: api/v1/auth/login
 */
exports.login = asyncHandler(async (req,res,next)=> {

    const [email, password] = [req.body.email, req.body.password];

    const fetchedUser = await User.findOne({email: email}).select("+password");
    
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

    const signedToken = signToken(fetchedUser);

    res.json({
        status: 200,
        content: signedToken
    });
});


/**
 * @Route: POST api/v1/auth/signup
 * @Scope: Public
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


function signToken(userObj){

    return jwt.sign({...userObj},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRATION,
        issuer: "http://localhost:5000",
        audience: ["consumers"]
    });

}