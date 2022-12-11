import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Subscription, tap, throwError } from "rxjs";
import { User } from "../models/db.models";
import { environment } from "src/environments/environment";
import jwt_decode from 'jwt-decode';
import { UserService } from "./user.service";
import { Token } from "@angular/compiler";


/**
 * TODO: Please user auth token for authentication, not decoding the user credentials.
 */


@Injectable()
export class AuthService {

    readonly URL:string = "http://localhost:5000/api/v1/auth";
    readonly USER_URL:string = "http://localhost:5000/api/v1/users"

    /* Determine if the user is logged in or not */
    userToken$ = new BehaviorSubject<string>(null);


    sub:Subscription;

    /* Try to login with currently stored jwt if any */
    constructor(
        private http:HttpClient,
        private user:UserService
    ) {
        const authToken = localStorage.getItem(environment.JWTStorageKey);
        let decodedToken = null;
        if(authToken !== 'null'){
            this.userToken$.next(authToken);
            try{
                //decode jwt token
                decodedToken = jwt_decode(localStorage.getItem(environment.JWTStorageKey));
                this.user.currentUser$.next(decodedToken._doc);
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
            this.http.post(`${this.URL}/login`,credentials)
            .pipe(
                tap((res:any)=> this._setToken(res.data)),
                map((res)=> jwt_decode(res.data)),
                catchError((err)=> throwError(()=> new Error("Unable to decode jwt token"))),
                tap((jwt:any)=> this.user.currentUser$.next(jwt._doc))
            )
            .subscribe({
                next:(res:any)=> {
                    resolve(true);
                },
                error:(err)=> {
                    this._setToken(null);
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
            this.http.post<any>(`${this.URL}/signup`,credentials)
            .pipe(
                tap(res => this._setToken(res.data)),
                map((res)=> jwt_decode(res.data)),
                catchError((err)=> throwError(()=> new Error("Failed to decode authToken"))),
                tap((jwt:any)=> this.user.currentUser$.next(jwt._doc))
            )
            .subscribe({
                next:(res:any)=> {
                    resolve(true);
                },
                error: (err)=> {
                    this._setToken(null);
                    reject("Unable to signup user");
                }
            })
        })
    }


    logout():void{
        this._setToken(null);
        this.user.currentUser$.next(null);
    }


    refreshToken():void{
        this.http.get(`${this.URL}/refreshToken`)
        .pipe(
            tap((res:any)=> this._setToken(res.data)),
            map((jwt)=> jwt_decode(jwt.data)),
        )
        .subscribe({
            next: (res:any)=> {
                this.user.currentUser$.next(res._doc);
            },
            error: (err)=> console.error(err)
        });
    }


    private _setToken(token){
        this.userToken$.next(token);
        localStorage.setItem(environment.JWTStorageKey,token);
    }

    
}