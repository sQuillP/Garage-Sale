import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  )


  constructor() { }

  ngOnInit(): void {
  }

}
