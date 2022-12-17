import { Component, OnInit } from '@angular/core';
import { User } from '../models/db.models';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {

  constructor(private user:UserService) { }

  currentUser:User = this.user.currentUser$.getValue();

  openMessages:boolean = false;

  onShowDirectMessages():void{
    this.openMessages = !this.openMessages;
  }

  ngOnInit(): void {
  }

}
