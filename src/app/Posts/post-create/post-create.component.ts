import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {PostsService} from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: 'post-create.component.html',
  styleUrls: ['post-create.component.css']
})

export class AppPostCreateComponent {

  constructor(private postSer: PostsService) {
  }

  onPostAdded(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postSer.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
