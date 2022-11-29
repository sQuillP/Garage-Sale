import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";


@Injectable({providedIn:"root"})
export class AuthService {

    readonly URL:string = "http://localhost:5000/api/v1/auth"

    isLoggedIn$ = new BehaviorSubject<boolean>(false);    


    constructor(
        private http:HttpClient
    ) {

    }


    login():any{
        // this.http.post()
    }
}