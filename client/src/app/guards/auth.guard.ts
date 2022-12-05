import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../Services/auth.service";



export class AuthGuardComponent implements CanActivate{

    constructor(
        private auth:AuthService
    ){

    }

    /* If there is no auth token, then prevent user from accessing authenticated routes. */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return !!this.auth.userToken$.getValue();
    }
}