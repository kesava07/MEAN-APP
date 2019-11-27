import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPostCreateComponent } from './Posts/post-create/post-create.component';
import { PostsListComponent } from './Posts/posts-list/posts-list.component';
import { AppLoginComponent } from './auth/login/login.component';
import { AppSignupComponent } from './auth/signup/signup.component';

const routes = [
  { path: '', component: PostsListComponent },
  { path: 'create', component: AppPostCreateComponent },
  { path: 'edit/:postId', component: AppPostCreateComponent },
  { path: 'login', component: AppLoginComponent },
  { path: 'signup', component: AppSignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot((routes))],
  exports: [RouterModule]
})
export class AppRouterModule {

}
