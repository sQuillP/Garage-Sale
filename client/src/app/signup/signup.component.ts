import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    phone: new FormControl(""),
    profileImg: new FormControl("")
  },{
    validators: Validators.required
  })

  constructor() { }

  ngOnInit(): void {
  }

}
