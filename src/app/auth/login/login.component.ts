import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: "login.component.html",
    styleUrls: ['login.component.css']
})

export class AppLoginComponent {
    isLoading = false;
    handleLogin(formData: NgForm) {
        console.log(formData.value);
    }
}