import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppRouterModule} from './app.router.module';
import {HttpClientModule} from '@angular/common/http';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule
} from '@angular/material';


import {AppComponent} from './app.component';
import {AppPostCreateComponent} from './Posts/post-create/post-create.component';
import {AppHeaderComponent} from './header/header.component';
import {PostsListComponent} from './Posts/posts-list/posts-list.component';


@NgModule({
  declarations: [
    AppComponent,
    AppPostCreateComponent,
    AppHeaderComponent,
    PostsListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule,
    AppRouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
