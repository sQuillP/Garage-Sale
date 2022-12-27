import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './Services/auth.service';
import { SocketService } from './Services/socket.service';
import { UserService } from './Services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  openMessenger = false;
  isLoggedIn:boolean = false;
  currentUser = new BehaviorSubject<any>(null);

  constructor(private auth: AuthService){
    // alert("Welcome to version 1.0. Please note that this is a project demonstration")
    this.auth.userToken$.subscribe(token => {
      this.isLoggedIn = !!token;
    })

  }


  onOpenMessage(data){
    this.openMessenger = true;
    this.currentUser.next([]);
  }

  onClose():void{
    this.openMessenger = false;;
  }
}
