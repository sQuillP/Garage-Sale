import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/db.models';
import { AuthService } from '../Services/auth.service';
import { SocketService } from '../Services/socket.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent {

  @Output() startMessage = new EventEmitter<boolean>();

  isLoggedIn:boolean = false;

  openMessages:boolean = false;


  conversationsList$ = new BehaviorSubject<any>(null);

  currentUser$ = new BehaviorSubject<any>(null);

  constructor(
      private user:UserService,
      private socket:SocketService,
      private auth:AuthService,
    ) { 
   
    this.auth.userToken$.subscribe(token => {
      this.isLoggedIn = !!token;
    });

    this.user.currentUser$.subscribe(user=> {
      this.currentUser$.next(user);
    })
   
    //get all conversations in list form so that they can be iterated over in html
    //template
    this.socket.conversations$.subscribe((conversations:any)=> {
      console.log(conversations)
      const conversationList = Object.keys(conversations).map(conversationId => {
        return conversations[conversationId];
      });
      console.log('conversation list = ',conversationList);
      this.conversationsList$.next(conversationList);
    });
  }


  //Send to socket service what user you would like to message.
  onStartNewMessage(uid:string):void{
    this.socket.currentConversation$.next(uid); 
    this.startMessage.emit(true);
  }
  

  onShowDirectMessages():void{
    this.openMessages = !this.openMessages;
  }

}
