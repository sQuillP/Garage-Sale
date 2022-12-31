import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, mergeMap, Observable, tap } from "rxjs";
import { User } from "../models/db.models";
import { AuthService } from "./auth.service";
import jwt_decode from "jwt-decode";

@Injectable({providedIn:"root"})
export class UserService {

    private readonly URL = "http://localhost:5000/api/v1/users";

    currentUser$ = new BehaviorSubject<User>(null);


    constructor(
        private http:HttpClient,
        private auth:AuthService,
    ){
        this.auth.decodedToken$.subscribe(oldUser => {
            this.currentUser$.next(oldUser);
            this.getLatestUserInstance();
        })
    }


    updateMyInfo(update:any):Promise<any> {
        return new Promise<boolean>((resolve, reject)=> {
            this.http
            .put<any>(`${this.URL}/updateUser`,update)
            .subscribe({
                next:res => {
                    this.getLatestUserInstance();
                    resolve(true);
                },
                error: err => reject(err)
            })
        });
    }

    //Get the latest instance of user from auth token and store it in the user subject
    getLatestUserInstance():any {
        return this.auth.decodedToken$.pipe(
            mergeMap(oldUser=> this.http.get(`${this.URL}/getMe`))
        )
        .subscribe({
            next:(res:any)=> {
                console.log(res.data);
                this.currentUser$.next(res.data);
            },
            error:(err)=> {
                console.log(err);
            }
        })
    }


    getUser(uid:string):any {
        return this.http.get(`${this.URL}/${uid}`)
    }
}