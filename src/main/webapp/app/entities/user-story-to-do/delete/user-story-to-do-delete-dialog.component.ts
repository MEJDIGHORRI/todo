import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserStoryToDo } from '../user-story-to-do.model';
import { UserStoryToDoService } from '../service/user-story-to-do.service';

@Component({
  templateUrl: './user-story-to-do-delete-dialog.component.html',
})
export class UserStoryToDoDeleteDialogComponent {
  userStory?: IUserStoryToDo;

  constructor(protected userStoryService: UserStoryToDoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userStoryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
