import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';
import { CookieSevice } from '../utils/cookie-service';
import { map } from 'rxjs/operators';

const url = `${environment.api}/users`;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private userLogged: User = new User();

    constructor(private http: HttpClient, private cookieService: CookieSevice) { }

    get(): Observable<User[]> {
        return this.http.get<User[]>(`${url}`)
            .pipe(map(users => users.filter(user => user.id !== this.user.id)));
    }

    getUser(name: string): Observable<User> {
        return this.http.get<User>(`${url}/${name.toLocaleLowerCase()}`);
    }

    post(user: User): Observable<any> {
        return this.http.post<any>(url, user);
    }

    upload(file: File): Observable<User> {
        const body = new FormData();
        body.append('file', file);
        return this.http.post<User>(`${url}/${this.user.name}/upload`, body);
    }

    set user(user: User) {
        this.userLogged = user;
    }

    get user() {
        return this.userLogged;
    }

    set userAndCookie(user: User) {
        this.user = user;
        this.cookieService.set(User.USER, user);
    }

    clearUser() {
        this.user = new User();
        this.cookieService.clear(User.USER);
    }
}
