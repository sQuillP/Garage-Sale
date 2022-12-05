import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { formatPhoneInput, _getError, validateImage, validatePassword, validatePhone } from '../util/validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  signupForm = new FormGroup({
    fullName: new FormControl("", [Validators.required]),
    email: new FormControl("",[Validators.required, Validators.email]),
    password: new FormControl("",[Validators.required,validatePassword]),
    phone: new FormControl("",[Validators.required,validatePhone]),
    profileImg: new FormControl("",[validateImage])
  });


  enablePasswordVisibility:boolean = false;
  shakeForm:boolean = false;
  shakeFormTimeout:any;

  displayError = _getError(this.signupForm);

  phoneInputSub:Subscription;

  constructor(
    private router:Router,
    private auth:AuthService,
    private _snackbar:MatSnackBar,
  ) { }



  onNavigate(path:string[]):void{
    this.router.navigate(path);
  }

  ngOnInit(): void {
    this.phoneInputSub = formatPhoneInput(this.signupForm);
  } 


  // Return true if a form field is invalid
  hasError(inputName:string):boolean {
    return !this.signupForm.get(inputName).valid &&
            this.signupForm.get(inputName).touched;
  }


  /* Call login API and login user, navigate off signup page */
  async onSubmit(){
    if(!this.signupForm.valid){
      this._shakeForm();
      this.signupForm.reset();
      return;
    }
    try{
      const success:boolean = await this.auth.signup(this.signupForm.value);
      this.router.navigate(["home"]);
    } catch(error){
      this._snackbar.open("Unable to signup","Ok",{
        duration: 2500,
        horizontalPosition:"center",
        verticalPosition:"bottom"
      });
    }
  }

  /* Trigger shake animation when the form is invalid. */
  private _shakeForm():void{
    if(this.shakeFormTimeout)
      clearTimeout(this.shakeFormTimeout);
    this.shakeForm = true;

    this.shakeFormTimeout = setTimeout(()=>{
      this.shakeForm = false;
    },1000);
  }
}
