import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStatusToDo } from '../status-to-do.model';
import { StatusToDoService } from '../service/status-to-do.service';

@Component({
  templateUrl: './status-to-do-delete-dialog.component.html',
})
export class StatusToDoDeleteDialogComponent {
  status?: IStatusToDo;

  constructor(protected statusService: StatusToDoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.statusService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
