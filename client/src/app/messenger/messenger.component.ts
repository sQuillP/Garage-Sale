import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/db.models';
import { SocketService } from '../Services/socket.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {

  @Output() startMessage = new EventEmitter<boolean>();
  @Output("messageUser") messageUser = new EventEmitter<any>();

  isLoggedIn = false;
  conversations:any = {};


  /*
    - call api and get list of users to message
    - get the last message read from each user 
    - get list of messages from each user
  */
  constructor(
      private user:UserService,
      private socket:SocketService
    ) { 
    
    this.user.currentUser$.subscribe(user => {
      console.log(user);
      this.isLoggedIn = !!user;
      if(!user) return;

      this.loadConversations();
    })
  }

  messages$:BehaviorSubject<any> = this.socket.conversations$;



  currentUser:User = this.user.currentUser$.getValue();

  openMessages:boolean = false;

  onMessageUser():void{
    //emit a message to a user
    // this.messageUser.emit()
  }

  onStartNewMessage():void{
    this.startMessage.emit(true);
  }

  onShowDirectMessages():void{
    this.openMessages = !this.openMessages;
  }

  loadConversations():void{
    
  }

  ngOnInit(): void {
  }

}
