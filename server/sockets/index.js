const Chat = require("../models/Chat");
const User = require("../models/User");

/* */
module.exports = function handleMessaging(io,userStore){
    io.on('connect',socket=> {

        //user joins their own socket.
        socket.on('connect-user',(user)=> {
            socket.join(user.email);
            io.in(user.email).emit('hello-user',"hello from server");
        });


        //parameters take in an email (room) and then the message (Chat db object)
        socket.on('send-message',async (toEmail,message)=> {
            socket.join(toEmail);
            
            await Chat.create(message);

            const fromUser = await User.findById(message.from);
            const toUser = await User.findById(message.to);
            fromUser.conversations.push(message);
            toUser.conversations.push(message);
            await fromUser.save();
            await toUser.save();

            //send the message to the user.
            io.to(toEmail).emit('receive-message',message);

        });

        socket.on('disconnect',()=> {
            console.log('socket rooms ', socket.rooms);
        })

    })
}