import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) { }
    createUser(email: string, password: string) {
        const authData: User = { email, password };
        this.http.post('http://localhost:3000/api/user/signup', authData)
            .subscribe(res => {
                console.log(res)
            })
    }
}