import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, of, Subscription } from "rxjs";
import { io } from "socket.io-client";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";


@Injectable({providedIn: 'root'})
export class SocketService{
 
    socket = io("http://localhost:5000");

    private readonly URL = "http://localhost:5000/api/v1/chats";

    isLoggedIn:boolean = false;
    subscription:Subscription;


    private conversations:{
        [_id:string]:{
            fullName:string, 
            email: string, 
            phone: string,
            profileImg:string,
            messages:[any]
        }
    } = {};


    //Store all conversations in object form.
    conversations$ = new BehaviorSubject<any>({});


    //Store the uid of current conversation
    currentConversation$ = new BehaviorSubject<string>(null);


    constructor(
        private user:UserService,
        private auth:AuthService,
        private http:HttpClient
        ){
        // this.loadConversations();
        this._getDms();
        this.socket.emit("connect-user", this.auth.decodedToken$.getValue()._id);

        this.socket.on('hello-user',(message)=> {
            console.log(message);
        });
        


        //Receive any new messages that are coming in from sockets.

        //Note that any received messages will not have a populated ID
        this.socket.on('receive-message',(message)=> { //make api call to populate the user id
            console.log('received message ',message);
            const currentUser = this.auth.decodedToken$.getValue();
            if(currentUser._id !== message.senderId){
                this._placeMessage(message.senderId,message);
            }
            else
                this._placeMessage(message.receiverId,message);
            this.conversations$.next(this.conversations);
        });
        
    }

    //uid is the uid of the other user the client is talking with.
    private _placeMessage(uid:string,message:any):void{
        if(!this.conversations[uid]){ 
            this.user.getUser(uid).subscribe({
                next:(res)=>{
                    this.conversations[uid] = res.data;
                    this.conversations[uid]['messages'] = [message];
                },
                error:(err)=> console.log('error receiving user in socket')
            });
        }
        else
            this.conversations[uid].messages.push(message);
    }

    sendMessage(message):void{
        console.log('socket sending message to: ',this.currentConversation$.getValue(),message)
        this.socket.emit(
            'send-message',
            this.currentConversation$.getValue(),
            message
        );
    }


    /* Get formatted list of dm conversations from the user */
    private _getDms():any {
        this.http.get<any>(`${this.URL}/${this.auth.decodedToken$.getValue()._id}`)
        .subscribe({
            next: (res:any) => {
                this.conversations$.next(res.data);
            },
            error:(err)=> {
                console.log('Unable to get DMs.');
            }
        })
    }

   


}