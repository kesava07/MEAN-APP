import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

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
  pageOptions = [1, 2, 4, 6, 8, 10]

  private postSubscription: Subscription;

  constructor(private postSer: PostsService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.postSer.getPosts(this.postsPerPage, this.currentPage);
    this.postSubscription = this.postSer.getPostUpdates()
      .subscribe((postsData: { posts: Post[], postsCount: number }) => {
        this.posts = postsData.posts;
        this.postsTotalLength = postsData.postsCount
        this.isLoading = false;
      });
  }

  onPageChange(pageData: PageEvent) {
    this.isLoading = true;
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postSer.getPosts(this.postsPerPage, this.currentPage);
  }

  handleDeletePost(postId: string) {
    this.postSer.deletePost(postId).subscribe(() => {
      this.isLoading = true;
      this.postSer.getPosts(this.postsPerPage, this.currentPage);
    })
  }


  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
