import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPostCreateComponent } from './Posts/post-create/post-create.component';
import { PostsListComponent } from './Posts/posts-list/posts-list.component';
import { AppLoginComponent } from './auth/login/login.component';
import { AppSignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

const routes = [
  { path: '', component: PostsListComponent },
  { path: 'create', component: AppPostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: AppPostCreateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: AppLoginComponent },
  { path: 'signup', component: AppSignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot((routes))],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRouterModule {

}
