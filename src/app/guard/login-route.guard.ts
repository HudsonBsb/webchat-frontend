import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';
import { CookieSevice } from '../utils/cookie-service';
import { User } from '../model/user.model';
import { isNullOrUndefined } from 'util';

@Injectable()
export class LoginRouteActivate implements CanActivate {

    constructor(private userService: UserService, private cookieService: CookieSevice, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.verifyUserCookie()) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }

    verifyUserCookie(): boolean {
        const userCookie = this.cookieService.get(User.USER);
        if (userCookie && userCookie.value) {
            try {
                const user: User = JSON.parse(userCookie.value);
                const bool = isNullOrUndefined(user.name) && isNullOrUndefined(this.userService.user.name);
                if (!bool) {
                    this.userService.clearUser();
                }
                return bool;
            } catch (e) {
                return false;
            }
        }
        return false;
    }
}
