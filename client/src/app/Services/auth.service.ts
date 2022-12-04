import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../models/db.models";
import { environment } from "src/environments/environment";
import jwt_decode from 'jwt-decode';

@Injectable({providedIn:"root"})
export class AuthService {

    readonly URL:string = "http://localhost:5000/api/v1/auth";

    /* Determine if the user is logged in or not */
    userToken$ = new BehaviorSubject<string>(null);

    /* Store basic user information decoded from JWT token */
    currentUser$ = new BehaviorSubject<User>(null);


    /* Try to login with currently stored jwt if any */
    constructor(
        private http:HttpClient
    ) {
        const authToken = localStorage.getItem(environment.JWTStorageKey);
        if(!!authToken){
            this.userToken$.next(authToken);
            try{
                //decode jwt token
                const decodedToken:User = jwt_decode(localStorage.getItem(environment.JWTStorageKey));
                this.currentUser$.next(decodedToken);
            } catch(error) {
                console.error("Unable to decode jwt");
                this.userToken$.next(null);
            }
        }
    }


    /* Log the user in and store JWT for persistence.
    return a promise for the user to navigate to app */
    login(credentials:User):Promise<boolean>{
        return new Promise((resolve,reject)=> {
            this.http.post(`${this.URL}/login`,credentials).subscribe({
                next:(res:any)=> {
                    console.log(res.data);
                    this.userToken$.next(res.data);
                    localStorage.setItem(environment.JWTStorageKey,res.data);
                    try {
                        const decodedData = jwt_decode(res.data);
                        this.currentUser$.next(decodedData);
                    } catch(err){
                        console.error("unable to decode jwt token");
                        this.userToken$.next(null);
                    }
                    resolve(true);
                },
                error:(err)=> {
                    reject("Unable to login");
                }
            })
        })
    }


    /* Send signup credentials to server and obtain JWT
    for logged in persistence, use a promise for user to proceed to app
    after logging in*/
    signup(credentials:User):Promise<boolean>{
        return new Promise((resolve,reject)=> {
            this.http.post<any>(`${this.URL}/signup`,credentials).subscribe({
                next:(res:any)=> {
                    console.log(res);
                    this.userToken$.next(res.data);
                    localStorage.setItem(environment.JWTStorageKey,res.data)
                    try {
                        const decodedData = jwt_decode(res.data);
                        this.currentUser$.next(decodedData);
                    } catch(err){
                        console.error("unable to decode jwt token");
                        this.userToken$.next(null);
                    }
                    resolve(res.data);
                },
                error: (err)=> {
                    reject("Unable to signup user");
                }
            })
        })
    }
}