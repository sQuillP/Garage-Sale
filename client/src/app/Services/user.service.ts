import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { User } from "../models/db.models";


@Injectable({providedIn:"root"})
export class UserService {

    private readonly URL = "http://localhost:5000/api/v1/users";

    currentUser$ = new BehaviorSubject<User>(null);

    constructor(private http:HttpClient){}


    // getMe(uid:string):void{
    //     this.http.get(`${this.URL}/${uid}`)
    //     .subscribe({
    //         next: (res:any) => {console.log(res); this.currentUser$.next(res.data)},
    //         error: (err) => console.error(err)
    //     });
    // }

    updateMyInfo(update:any):Promise<any> {
        return new Promise<boolean>((resolve, reject)=> {
            this.http
            .put<any>(`${this.URL}/updateUser`,update)
            .subscribe({
                next:res => {
                    resolve(true);
                },
                error: err => reject(err)
            })
        });
        
    }

}