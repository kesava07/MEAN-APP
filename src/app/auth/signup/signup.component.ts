import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    selector: "app-signup",
    templateUrl: "signup.component.html",
    styleUrls: ["signup.component.css"]
})
export class AppSignupComponent implements OnInit, OnDestroy {
    isLoading = false;
    constructor(private authSer: AuthService) { };

    private authStatus: Subscription;

    ngOnInit() {
        this.authStatus = this.authSer.getUserAuthStatus().subscribe(authState => {
            this.isLoading = false;
        })
    }

    handleSignup(formData: NgForm) {
        if (formData.invalid) return
        this.isLoading = true;
        this.authSer.createUser(
            formData.value.email,
            formData.value.password
        )
    }
    ngOnDestroy() {
        this.authStatus.unsubscribe();
    }
}