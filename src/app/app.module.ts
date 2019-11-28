import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRouterModule } from './app.router.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule
} from '@angular/material';


import { AppComponent } from './app.component';
import { AppPostCreateComponent } from './Posts/post-create/post-create.component';
import { AppHeaderComponent } from './header/header.component';
import { PostsListComponent } from './Posts/posts-list/posts-list.component';
import { AppLoginComponent } from './auth/login/login.component';
import { AppSignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';


@NgModule({
  declarations: [
    AppComponent,
    AppPostCreateComponent,
    AppHeaderComponent,
    PostsListComponent,
    AppLoginComponent,
    AppSignupComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    HttpClientModule,
    AppRouterModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
