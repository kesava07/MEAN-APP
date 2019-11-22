import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {PostsService} from '../posts.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Post} from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: 'post-create.component.html',
  styleUrls: ['post-create.component.css']
})

export class AppPostCreateComponent implements OnInit {
  post: Post;
  private mode = 'create';
  private postId: string;


  constructor(private postSer: PostsService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postSer.getEditingPost(this.postId).subscribe((postData) => {
          const post: Post = {id: postData._id, title: postData.title, content: postData.content};
          this.post = post;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
    console.log(this.post);
  }

  onPostAdded(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postSer.addPost(form.value.title, form.value.content);
    } else {
      this.postSer.updatePost(this.post.id, form.value.title, form.value.content);
    }
    form.resetForm();
  }
}
