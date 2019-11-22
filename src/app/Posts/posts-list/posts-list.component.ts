import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];

  private postSubscription: Subscription;

  constructor(private postSer: PostsService) {
  }

  ngOnInit() {
    this.postSer.getPosts();
    this.postSubscription = this.postSer.getPostUpdates()
      .subscribe((posts: Post[]) => {
        console.log(posts);
        this.posts = posts;
      });
  }

  handleDeletePost(postId: string) {
    this.postSer.deletePost(postId);
  }


  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
