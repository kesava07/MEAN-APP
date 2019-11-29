import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  postsTotalLength = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageOptions = [1, 2, 4, 6, 8, 10];
  userAuthenticated = false;
  userId: string;

  private postSubscription: Subscription;
  private authSubscription: Subscription;

  constructor(private postSer: PostsService, private authService: AuthService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postSer.getPosts(this.postsPerPage, this.currentPage);
    this.postSubscription = this.postSer.getPostUpdates()
      .subscribe((postsData: { posts: Post[], postsCount: number }) => {
        this.posts = postsData.posts;
        this.postsTotalLength = postsData.postsCount
        this.isLoading = false;
      });

    this.userAuthenticated = this.authService.getIsAuth();
    this.authSubscription = this.authService.getUserAuthStatus()
      .subscribe(isAuth => {
        this.userAuthenticated = isAuth;
        this.userId = this.authService.getUserId();
      })
  }

  onPageChange(pageData: PageEvent) {
    this.isLoading = true;
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postSer.getPosts(this.postsPerPage, this.currentPage);
  }

  handleDeletePost(postId: string) {
    this.isLoading = true;
    this.postSer.deletePost(postId).subscribe(() => {
      this.postSer.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    })
  }


  ngOnDestroy() {
    this.postSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
}
