import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { io } from "socket.io-client";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";



@Injectable({providedIn: 'root'})
export class SocketService{

    socket = io("http://localhost:5000");

    isLoggedIn:boolean = false;
    subscription:Subscription;


    conversations:{
        [_id:string]:{
            fullName:string, 
            email: string, 
            phone: string,
            profileImg:string,
            messages:[any]
        }
    } = {};

    conversations$ = new BehaviorSubject<any>(null);
    

    constructor(
        private auth:AuthService,
        private user:UserService
        ){
            console.log('socket instance')
        this.loadConversations();
        this.socket.emit("connect-user", (this.user.currentUser$.getValue()));
        this.socket.on('hello-user',(message)=> {
            console.log(message);
        });
        


        
        this.socket.on('receive-message',(message)=> { //make api call to populate the user id
            const currentUser = this.user.currentUser$.getValue();
            if(currentUser._id !== message.senderId){
                if(!this.conversations[message.senderId._id])
                    this.conversations[message.senderId._id].messages = [message];
                else
                    this.conversations[message.senderId._id].messages.push(message);
            }
            else{
                if(!this.conversations[message.receiverId])
                    this.conversations[message.receiverId._id].messages = [message];
                else
                    this.conversations[message.receiverId._id].messages.push(message);
            }
        })
        
    }


    sendMessage(toUser,message):void{
        this.socket.emit('send-message',message);
    }


    //get populated list of conversations
    loadConversations():void{
        const currentUser = this.user.currentUser$.getValue();

        for(const conversation of currentUser.conversations){

            if(conversation.senderId._id !== currentUser._id){
                if(!this.conversations[conversation.senderId._id]){
                    this.conversations[conversation.senderId] = conversation;
                    conversation['messages'] = [];
                }
                else
                    this.conversations[conversation.senderId._id].messages.push(conversation);
            }


            else{
                if(!this.conversations[conversation.receiverId._id]){
                    this.conversations[conversation.receiverId] = conversation;
                    conversation['messages']  = [];
                }
                else
                    this.conversations[conversation.receiverId._id].messages.push(conversation);
            }
        }
        this.conversations$.next(this.conversations);
    }






}