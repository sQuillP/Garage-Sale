import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector} from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../Services/auth.service";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    
    constructor(
        private readonly injector:Injector
    ){
    }
    
    /* Attach JWT to all outgoing API requests */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        try{
            const auth = this.injector.get(AuthService);
            req = req.clone({
                setHeaders:{
                    Authorization: `Bearer ${auth.userToken$.getValue()}`
                }
            });
            return next.handle(req);
        } catch(error){
            console.error('unable to intercept')
        }
    }
}