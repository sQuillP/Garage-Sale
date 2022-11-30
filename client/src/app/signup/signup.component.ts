import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { validatePassword } from '../util/validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    fullName: new FormControl(""),
    email: new FormControl("",[Validators.email]),
    password: new FormControl("",[validatePassword]),
    phone: new FormControl("",[]),
    profileImg: new FormControl("")
  },{
    validators: Validators.required
  });

  enablePasswordVisibility:boolean = false;


  constructor(
    private router:Router
  ) { }



  onNavigate(path:string[]):void{
    this.router.navigate(path);
  }



  
  ngOnInit(): void {
    this.signupForm.get('phone').valueChanges.subscribe((value)=>{
      const formRef = this.signupForm.get('phone');
      if(value.length === 3){
        formRef.setValue("("+value+")-");
      }
      if(value.length===9)
        formRef.setValue(value + "-");
      
    })
  }




}
