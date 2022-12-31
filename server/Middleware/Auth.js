const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("./AsyncHandler");
const jwt = require('jsonwebtoken');


exports.authenticate = (req,res,next)=> {


    if(!req.headers.authorization){
        return next(
            new ErrorResponse(
                401,
                `Token is required to access this route. Please specify the form: Bearer: <token>`
            )
        );
    }

    const token = req.headers.authorization.split(' ');


    if(token[0].toLowerCase() !== "bearer"){
        return next(
            new ErrorResponse(
                400,
                `Please specify the format: Bearer <token>`
            )
        );
    }

    try{
        const verifiedToken = jwt.verify(token[1],process.env.JWT_SECRET);
        req.user = verifiedToken._doc;        
    } catch(error){
        return next(
            new ErrorResponse(
                401,
                `Invalid token`
            )
        );
    }
    console.log('moving to next route')
    next();
};