import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { validatePassword } from '../util/validators';
import {AuthService} from "../Services/auth.service"
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(
    private router:Router,
    private auth:AuthService,
    private _snackbar:MatSnackBar
  ) { }

  ngOnInit(): void {
  }


  async onSubmit(){
    if(!this.loginForm.valid){
      this.triggerShake();
      this.loginForm.reset();
      return;
    }
    
    try{
      await this.auth.login(this.loginForm.value);
      this.router.navigate(['dashboard']);
    } catch(error){
      this.triggerShake();
      this.loginForm.reset();
      this._snackbar.open(error.message || "Unable to login","OK",{
        duration: 3000
      });
    }
  }


  onNavigate(route:string[]):void{
    this.router.navigate(route);
  }


  /* Shake the form when user input is invalid */
  private triggerShake():void{
    if(this.timeout)
      clearTimeout(this.timeout);
    this.shakeForm = true;
    this.timeout = setTimeout(()=> {
      this.shakeForm = false;
    },1000);
  }

}
