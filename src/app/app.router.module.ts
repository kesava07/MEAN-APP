import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppPostCreateComponent} from './Posts/post-create/post-create.component';
import {PostsListComponent} from './Posts/posts-list/posts-list.component';

const routes = [
  {path: '', component: PostsListComponent},
  {path: 'create', component: AppPostCreateComponent},
  {path: 'edit/:postId', component: AppPostCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot((routes))],
  exports: [RouterModule]
})
export class AppRouterModule {

}
