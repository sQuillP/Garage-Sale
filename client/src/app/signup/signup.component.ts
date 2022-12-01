import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { validateImage, validatePassword, validatePhone } from '../util/validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {


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

  phoneInputSub:Subscription;

  constructor(
    private router:Router,
    private auth:AuthService,
    private _snackbar:MatSnackBar
  ) { }



  onNavigate(path:string[]):void{
    this.router.navigate(path);
  }



  
  ngOnInit(): void {
    this._formatPhoneInput();
  }


  ngOnDestroy(): void {
      this.phoneInputSub.unsubscribe();
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



  /* Return an error if there is an invalid form field */
  displayError(inputName:string):string | void {
    const error:any = Object.keys(this.signupForm.get(inputName).errors)[0];
    if(error === "required")
      return "This field is required";

    if(error === "invalidDateFormat")
      return "Please provide a valid date";

    if(error === "email")
      return "Please provide a valid email";

    if(error === "invalidPhone")
      return "Please provide a valid phone number";

    if(error==="invalidImage")
      return "Please provide a valid image URL"

    if(error === "invalidPassword")
      return "Must contain an uppercase letter and a number";
  }


  /* Validate the user input as they type to perfectly format the 
  phone number. */
  private  _formatPhoneInput():void{
    this.phoneInputSub = this.signupForm.get('phone').valueChanges.subscribe((value)=>{
      const formRef = this.signupForm.get('phone');
      if(value?.length === 3){
        formRef.setValue("("+value+")-");
      }
      if(value?.length===9)
        formRef.setValue(value + "-");
    })
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
