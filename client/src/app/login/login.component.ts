import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounce, interval, throttleTime, timeout } from 'rxjs';
import { validatePassword } from '../util/validators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl("",[Validators.email]),
    password: new FormControl("",[validatePassword]),
  },
  {validators: [Validators.required]}
  );

  timeout:any;

  loginMode:boolean = true;
  shakeForm:boolean = false;
  showPasswordVisibility:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }


  onSubmit():void{
    this.triggerShake();
  }


  /* Shake the form when user input is invalid */
  private triggerShake():void{
    if(this.timeout)
      clearTimeout(this.timeout);
    this.shakeForm = true;
    this.timeout = setTimeout(()=> {
      this.shakeForm = false;
    },1000)
  }

}
