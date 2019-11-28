import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private authToken: string;
    private isAuth = false;
    private isUserAuthenticated = new Subject<boolean>();
    private tokenExpirationTimer: any;
    private userId: string;

    constructor(private http: HttpClient, private router: Router) { }

    getAuthToken() {
        return this.authToken;
    }

    getIsAuth() {
        return this.isAuth;
    }

    getUserAuthStatus() {
        return this.isUserAuthenticated.asObservable();
    }

    createUser(email: string, password: string) {
        const authData: User = { email, password };
        this.http.post('http://localhost:3000/api/user/signup', authData)
            .subscribe(res => {
                console.log(res);
                this.router.navigate(['/login']);
            }, err => {
                console.log(err);
                this.isUserAuthenticated.next(false);
            })
    }

    login(email: string, password: string) {
        const authData: User = { email, password };
        this.http.post<{ token: string, expiresIn: number, userId: string }>('http://localhost:3000/api/user/login', authData)
            .subscribe(res => {
                const token = res.token;
                this.authToken = token;
                if (token) {
                    const expirationDuration = res.expiresIn;
                    this.authTimer(expirationDuration);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expirationDuration * 1000)

                    this.isAuth = true;
                    this.userId = res.userId;
                    this.isUserAuthenticated.next(true);

                    // Setting user data to local storage
                    this.setAuthData(token, expirationDate, this.userId);

                    this.router.navigate(['/']);
                }
            }, err => {
                console.log(err);
                this.isUserAuthenticated.next(false);
            })
    }

    logout() {
        this.authToken = null;
        this.isUserAuthenticated.next(false);
        this.isAuth = false;
        this.userId = null;
        this.router.navigate(['/']);
        clearTimeout(this.tokenExpirationTimer);
        this.removeAuthData();
    }

    getUserId() {
        return this.userId;
    }

    autoAuthUser() {
        const authInfo = this.getAuthData();
        if (!authInfo) {
            return;
        };
        const now = new Date();
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.authToken = authInfo.token;
            this.isAuth = true;
            this.userId = authInfo.userId;
            this.isUserAuthenticated.next(true);
            this.authTimer(expiresIn / 1000);
        }
    }

    private authTimer(duration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private setAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId)
    }

    private removeAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }

}