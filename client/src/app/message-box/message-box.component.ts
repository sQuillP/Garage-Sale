import { Component, OnInit } from '@angular/core';
import { User } from '../models/db.models';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit {

  constructor(
    private user:UserService
  ) { }

  curUser:User = this.user.currentUser$.getValue();

  ngOnInit(): void {
  }

}
