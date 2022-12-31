import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime, filter, map, mergeMap, Observable, tap } from 'rxjs';
import { User } from '../models/db.models';
import { AuthService } from '../Services/auth.service';
import { DBService } from '../Services/db.service';
import { SocketService } from '../Services/socket.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent {

  @Output() close = new EventEmitter<boolean>();

  /* Hold the contents of the user you are going to message */
  userData$ = new BehaviorSubject<any>(null);

  //Store the current conversation
  conversation$ = new BehaviorSubject<any>(null);


  /* Form data */
  searchUser = new FormControl('',[]);
  typedMessage = new FormControl('',[Validators.minLength(1)]);

  //Handle autocomplete search results.
  autoComplete$ = new BehaviorSubject<any>(null);


  //toggle when query bar needs to show.
  querySearch = false;


  constructor(
    private user:UserService,
    private db:DBService,
    private socket:SocketService,
    private auth:AuthService
  ) { 



    //don't touch this.
    //Listen to keyboard events from the user.
    this.searchUser.valueChanges
    .pipe(
      tap(()=> this.querySearch = true),
      debounceTime(1000),
      mergeMap((term)=> this.db.findUsers(term)) //NOTE:implement prevention of user from searching self
    )
    .subscribe({
      next:(res)=> {
        console.log(res);
        this.autoComplete$.next(res.data);
        this.querySearch = false;
      },
      error:(error)=> { //handle any errors
        this.querySearch = false;
      }
    });

    //when current conversation changes, update the user data and the conversation
    this.socket.currentConversation$.subscribe((uid:string)=> {
      if(Object.keys(this.socket.conversations$.getValue()).length){
        this.userData$.next({
          fullName: this.socket.conversations$.getValue()[uid].fullName,
          email: this.socket.conversations$.getValue()[uid].email
        });
        this.conversation$.next(this.socket.conversations$.getValue()[uid]);
      }
    })

  }

  

  onClose():void{
    this.close.emit(true);
  }

  /* When user selects an autocomplete field. */
  onSelectAutoComplete(otherUser):void{
    this.userData$.next({
      fullName: otherUser.fullName,
      email: otherUser.email
    }); //grab new data from the user
    this.socket.currentConversation$.next(otherUser._id);//update the current conversation
    this.conversation$.next(this.socket.conversations$.getValue()[otherUser._id]);//get the conversation data if any
    this.autoComplete$.next(null);//clear the autocomplete
  }


  /* user wants to send a message */
  onSendMessage():void{
    if(!this.userData$.getValue()) return; //must be messaging a user
    const message = {
      senderId: this.auth.decodedToken$.getValue()._id,
      receiverId: this.socket.currentConversation$.getValue(),
      content: this.typedMessage.value
    };
    this.socket.sendMessage(message);
  }

}
