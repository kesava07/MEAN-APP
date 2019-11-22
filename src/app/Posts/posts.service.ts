import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Post} from './post.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient) {
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
            id: post._id
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // 14NGEVtjf1tmLkWe

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((data) => {
        const postId = data.postId;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
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
    const post: Post = {id, title, content};
    this.http.put(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe(() => {
        const copyPosts = [...this.posts];
        const oldIndex = copyPosts.findIndex(p => p.id === post.id);
        copyPosts[oldIndex] = post;
        this.posts = copyPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

}
