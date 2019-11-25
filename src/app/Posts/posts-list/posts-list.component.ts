import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;

  private postSubscription: Subscription;

  constructor(private postSer: PostsService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.postSer.getPosts();
    this.postSubscription = this.postSer.getPostUpdates()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }

  handleDeletePost(postId: string) {
    this.postSer.deletePost(postId);
  }


  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
