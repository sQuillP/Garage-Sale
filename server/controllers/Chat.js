const Chat = require("../models/Chat");
const User = require("../models/User");
const asyncHandler = require("../Middleware/AsyncHandler");


/**
 * - get a list of all messages for a single user
 * 
 * @scope private, must be signed in
 * @route GET api/v1/chat/:userId
 * @param userId is the uid of the user making the request, not the client making the request.
 */
exports.getMessages = asyncHandler( async (req,res,next)=> {
    const messages = await Chat.find({
        $or:[{senderId: req.params.userId,},{receiverId: req.params.userId}]
    })
    .populate('senderId')
    .populate('receiverId');

    const resObject = formatDms(messages);

    res.status(200).json({
        success: true,
        data: resObject
    });
});





function formatDms(messages) {
    const resObject = {};
    //Format the fetched  messages into a dms container
    for(const message of messages) {
        //senderId and receiverId are already populated as the user.
        if(message.senderId._id !== req.user._id) {
            if(resObject[message.senderId._id]){
                resObject[message.senderId._id] = message.senderId;//assign populated user
                resObject[message.senderId._id]['messages'].push(message);//assign message field to populatd user and push message.
            }
            else 
                resObject[message.senderId._id]['messages'] = [message];
        }
        else {
            if(resObject[message.receiverId._id]){
                resObject[message.receiverId._id] = message.receiverId;//assign the populated user
                resObject[message.receiverId._id]['messages'].push(message);//add a messages field to the populated user and push message
            }
            else
                resObject[message.receiverId._id]['messages'] = [message];
        }
    }
    return resObject;
}