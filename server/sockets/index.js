const Chat = require("../models/Chat");
const User = require("../models/User");

/* */
module.exports = function handleMessaging(io,userStore){
    io.on('connect',socket=> {

        //user joins their own socket.
        socket.on('connect-user',(uid)=> {
            socket.join(uid);
            io.in(uid).emit('hello-user',"hello from server");
        });


        //parameters take in an email (room) and then the message (Chat db object)
        socket.on('send-message',async (uid,message)=> {
            socket.join(uid);
            
            const savedMessage =  await Chat.create(message);//save the message

            //send the message to the user.
            io.to(uid).emit('receive-message',message);//send the message to the user

        });

        socket.on('disconnect',()=> {
            console.log('socket rooms ', socket.rooms);
        })

    })
}