import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStatusToDo } from '../status-to-do.model';

@Component({
  selector: 'jhi-status-to-do-detail',
  templateUrl: './status-to-do-detail.component.html',
})
export class StatusToDoDetailComponent implements OnInit {
  status: IStatusToDo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ status }) => {
      this.status = status;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
