import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStatusToDo } from '../status-to-do.model';
import { StatusToDoService } from '../service/status-to-do.service';
import { StatusToDoDeleteDialogComponent } from '../delete/status-to-do-delete-dialog.component';

@Component({
  selector: 'jhi-status-to-do',
  templateUrl: './status-to-do.component.html',
})
export class StatusToDoComponent implements OnInit {
  statuses?: IStatusToDo[];
  isLoading = false;

  constructor(protected statusService: StatusToDoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.statusService.query().subscribe(
      (res: HttpResponse<IStatusToDo[]>) => {
        this.isLoading = false;
        this.statuses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IStatusToDo): number {
    return item.id!;
  }

  delete(status: IStatusToDo): void {
    const modalRef = this.modalService.open(StatusToDoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.status = status;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
