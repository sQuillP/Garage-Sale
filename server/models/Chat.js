const mongoose = require('mongoose');


const ChatSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: [true,`Chat must contain a sender`]
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: [true, `Chat must have a receiver`]
    },
    content:{
        type: String, 
        default: ''
    }
},{
    timestamps: true
});


const ChatModel = mongoose.model('chat',ChatSchema);
module.exports= ChatModel;