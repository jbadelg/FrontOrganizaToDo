import { Component } from '@angular/core';
import { FeedbackService } from './services/feedback.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FrontOrganizaToDo';
  loading: boolean;
  constructor(private sharedService: FeedbackService) {
    this.loading = false;
  }
}
