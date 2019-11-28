import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: "login.component.html",
    styleUrls: ['login.component.css']
})

export class AppLoginComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStatus: Subscription;
    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.authStatus = this.authService.getUserAuthStatus().subscribe(authState => {
            this.isLoading = false;
        })
    }

    handleLogin(formData: NgForm) {
        if (formData.invalid) return;
        this.isLoading = true;
        this.authService.login(
            formData.value.email,
            formData.value.password
        )
    }
    ngOnDestroy() {
        this.authStatus.unsubscribe();
    }
}