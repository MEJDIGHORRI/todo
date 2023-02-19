import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserStoryStatusToDo } from '../user-story-status-to-do.model';

@Component({
  selector: 'jhi-user-story-status-to-do-detail',
  templateUrl: './user-story-status-to-do-detail.component.html',
})
export class UserStoryStatusToDoDetailComponent implements OnInit {
  userStoryStatus: IUserStoryStatusToDo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userStoryStatus }) => {
      this.userStoryStatus = userStoryStatus;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
