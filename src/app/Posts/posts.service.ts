import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, private router: Router) {
  }

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPostUpdates() {
    return this.postsUpdated.asObservable();
  }

  getPosts() {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postsData) => {
        return postsData.posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // 14NGEVtjf1tmLkWe

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title, content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((data) => {
        const post: Post = {
          id: data.post.id,
          title: title,
          content: content,
          imagePath: data.post.imagePath
        }
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  getEditingPost(postId) {
    return this.http.get<{ _id: string, title: string, content: string }>(`http://localhost:3000/api/posts/${postId}`);
  }

  deletePost(postId) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content, imagePath: null };
    this.http.put(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe(() => {
        const copyPosts = [...this.posts];
        const oldIndex = copyPosts.findIndex(p => p.id === post.id);
        copyPosts[oldIndex] = post;
        this.posts = copyPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/'])
      });
  }

}
