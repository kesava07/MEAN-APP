import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.css']
})

export class AppHeaderComponent implements OnInit, OnDestroy {
  userAuthenticated = false;

  private userAuthSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userAuthenticated = this.authService.getIsAuth();
    this.userAuthSubscription = this.authService.getUserAuthStatus()
      .subscribe(isAuthenticated => {
        this.userAuthenticated = isAuthenticated;
      })
  }
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.userAuthSubscription.unsubscribe();
  }
}
