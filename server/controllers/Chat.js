const Chat = require("../models/Chat");
const asyncHandler = require("../Middleware/AsyncHandler");


/**
 * - get a list of all messages for a single user
 * 
 * @scope private, must be signed in
 * @route GET api/v1/chat
 */
exports.getMessages = asyncHandler( async (req,res,next)=> {

    

    res.status(200).json({
        success: true,
        data: messages
    });
});



/**
 * 
 *     const user = req.user;

    //sort messages  that user id is included in
    const messages = await Chat.find({
        $or:
        [{
            senderId: user._id, 
        },
        {
            receiverId: user._id
        }]
    })
    .populate('user')
    .sort({"timestamp":1});

    const resObj = {};

    //format the message object
    for (let message of messages){

        if(message.senderId === user._id){
            if(message[message.receiverId])
                resObj[message.receiverId].push(message);
            else
                resObj[message.receiverId] = [message];
        }
        else{
            if(resObj[message.senderId])
                resObj[message.senderId].push(message);
            else
                resObj[message.senderId] = [message];
        }
    }
 */