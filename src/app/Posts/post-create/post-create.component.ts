import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { MimeTypeValidator } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: 'post-create.component.html',
  styleUrls: ['post-create.component.css']
})

export class AppPostCreateComponent implements OnInit {
  post: Post;
  private mode = 'create';
  private postId: string;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;


  constructor(private postSer: PostsService, private route: ActivatedRoute, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3)]],
      content: [null, [Validators.required, Validators.minLength(4)]],
      image: [null, [Validators.required], [MimeTypeValidator]]
    });
    //reactive form builder alternative
    // this.form = new FormGroup({
    //   title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    //   content: new FormControl(null, [Validators.required, Validators.minLength(4)])
    // })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.isLoading = true
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postSer.getEditingPost(this.postId).subscribe((postData) => {
          const post: Post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.post = post;
          this.form.setValue({
            title: post.title,
            content: post.content,
            image: post.imagePath
          })
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  };

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onPostAdded() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postSer.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postSer.updatePost(
        this.post.id,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
