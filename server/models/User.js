const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const bcrypt = require("bcryptjs");
const Chat = require("../models/Chat");

const UserSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: [true, 'User must have a full name']
    },
    email:{
        type:String,
        unique: true,
        required: [true,`User must have an email`],
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi,
        `Must provide a valid email`    
        ]
    },
    password:{
        type:String,
        required: [true, `User must include a password`],
        minLength: [6, `Must have a password length of at least 6 characters`],
        select: false
    },
    phone:{
        type:String,
        required:[true, 'user must have a phone'],
        match: [
            /^(\(?\d{3}\)?\-\d{3}\-\d{4})|\d{10}/gi,
            `Phone must match the pattern (xxx)-xxx-xxxx or xxxxxxxxxx`
        ]
    },
    profileImg:{
        type:String
    },
    conversations:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user',
        default: []
    }
});

/* Cascade delete chats when user is deleted */
UserSchema.pre('deleteOne',{query: true, document: true}, async function(next){
    console.log('cascade delete in progress for USER');
    await Sale.deleteMany({userId: this._id});
    await Chat.deleteMany({senderId: this._id});
    next();
});


UserSchema.pre('save',async function(next) {
    console.log('in the pre save function ',this);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(this.password,salt);
    this.password = hashedPassword;
    next();
});


const UserModel = mongoose.model('user',UserSchema);
module.exports = UserModel;
