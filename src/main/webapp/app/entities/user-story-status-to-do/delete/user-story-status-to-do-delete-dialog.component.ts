import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserStoryStatusToDo } from '../user-story-status-to-do.model';
import { UserStoryStatusToDoService } from '../service/user-story-status-to-do.service';

@Component({
  templateUrl: './user-story-status-to-do-delete-dialog.component.html',
})
export class UserStoryStatusToDoDeleteDialogComponent {
  userStoryStatus?: IUserStoryStatusToDo;

  constructor(protected userStoryStatusService: UserStoryStatusToDoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userStoryStatusService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
