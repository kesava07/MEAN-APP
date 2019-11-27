import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    selector: "app-signup",
    templateUrl: "signup.component.html",
    styleUrls: ["signup.component.css"]
})
export class AppSignupComponent {
    isLoading = false;
    constructor(private authSer: AuthService) { }
    handleSignup(formData: NgForm) {
        if (formData.invalid) return
        this.authSer.createUser(
            formData.value.email,
            formData.value.password
        )
    }
}