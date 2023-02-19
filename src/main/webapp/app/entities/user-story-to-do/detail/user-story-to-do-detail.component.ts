import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserStoryToDo } from '../user-story-to-do.model';

@Component({
  selector: 'jhi-user-story-to-do-detail',
  templateUrl: './user-story-to-do-detail.component.html',
})
export class UserStoryToDoDetailComponent implements OnInit {
  userStory: IUserStoryToDo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userStory }) => {
      this.userStory = userStory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
