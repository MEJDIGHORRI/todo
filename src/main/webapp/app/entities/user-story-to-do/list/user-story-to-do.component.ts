import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserStoryToDo } from '../user-story-to-do.model';
import { UserStoryToDoService } from '../service/user-story-to-do.service';
import { UserStoryToDoDeleteDialogComponent } from '../delete/user-story-to-do-delete-dialog.component';

@Component({
  selector: 'jhi-user-story-to-do',
  templateUrl: './user-story-to-do.component.html',
})
export class UserStoryToDoComponent implements OnInit {
  userStories?: IUserStoryToDo[];
  isLoading = false;

  constructor(protected userStoryService: UserStoryToDoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.userStoryService.query().subscribe(
      (res: HttpResponse<IUserStoryToDo[]>) => {
        this.isLoading = false;
        this.userStories = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUserStoryToDo): number {
    return item.id!;
  }

  delete(userStory: IUserStoryToDo): void {
    const modalRef = this.modalService.open(UserStoryToDoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userStory = userStory;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
