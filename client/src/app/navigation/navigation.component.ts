import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  authSubscription:Subscription;
  isLoggedIn:boolean = false;

  constructor(
    private router:Router,
    private auth:AuthService
  ) { 

    this.authSubscription = this.auth.userToken$.subscribe((token)=> {
      this.isLoggedIn = !!token;
    })
  }

  ngOnInit(): void {
  }

  onNavigate(route:string[]):void{
    this.router.navigate(route);
  }

}
