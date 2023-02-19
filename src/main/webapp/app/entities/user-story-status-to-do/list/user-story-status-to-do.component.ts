import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserStoryStatusToDo } from '../user-story-status-to-do.model';
import { UserStoryStatusToDoService } from '../service/user-story-status-to-do.service';
import { UserStoryStatusToDoDeleteDialogComponent } from '../delete/user-story-status-to-do-delete-dialog.component';

@Component({
  selector: 'jhi-user-story-status-to-do',
  templateUrl: './user-story-status-to-do.component.html',
})
export class UserStoryStatusToDoComponent implements OnInit {
  userStoryStatuses?: IUserStoryStatusToDo[];
  isLoading = false;

  constructor(protected userStoryStatusService: UserStoryStatusToDoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.userStoryStatusService.query().subscribe(
      (res: HttpResponse<IUserStoryStatusToDo[]>) => {
        this.isLoading = false;
        this.userStoryStatuses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUserStoryStatusToDo): number {
    return item.id!;
  }

  delete(userStoryStatus: IUserStoryStatusToDo): void {
    const modalRef = this.modalService.open(UserStoryStatusToDoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userStoryStatus = userStoryStatus;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
