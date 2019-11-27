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
  private postsUpdated = new Subject<{ posts: Post[], postsCount: number }>();

  getPostUpdates() {
    return this.postsUpdated.asObservable();
  }

  getPosts(pageSize: number, currentPage: number) {
    const queryParam = `?pageSize=${pageSize}&page=${currentPage}`
    this.http.get<{ message: string, posts: any, postsCount: number }>('http://localhost:3000/api/posts' + queryParam)
      .pipe(map((postsData) => {
        return {
          posts: postsData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          }),
          postsCount: postsData.postsCount
        }
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postsCount: transformedPosts.postsCount
        });
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
        // const post: Post = {
        //   id: data.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: data.post.imagePath
        // }
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  getEditingPost(postId) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(`http://localhost:3000/api/posts/${postId}`);
  }

  deletePost(postId) {
    return this.http.delete(`http://localhost:3000/api/posts/${postId}`);
    //not needed
    // .subscribe(() => {
    //   const updatedPosts = this.posts.filter((post) => post.id !== postId);
    //   this.posts = updatedPosts;
    //   this.postsUpdated.next([...this.posts]);
    // });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    }
    this.http.put(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe(() => {
        this.router.navigate(['/']);
        // Not needed because we are switching from one page to another page
        // const copyPosts = [...this.posts];
        // const oldIndex = copyPosts.findIndex(p => p.id === id);
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: ""
        // }
        // copyPosts[oldIndex] = post;
        // this.posts = copyPosts;
        // this.postsUpdated.next([...this.posts]);

      });
  }

}
