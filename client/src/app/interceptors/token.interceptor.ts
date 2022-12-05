import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../Services/auth.service";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    
    constructor(
        private auth:AuthService
    ){}
    
    /* Attach JWT to all outgoing API requests */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            setHeaders:{
                Authorization: `Bearer ${this.auth.userToken$.getValue()}`
            }
        });
        return next.handle(req);
    }
}