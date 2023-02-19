import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IUserStoryStatusToDo, UserStoryStatusToDo } from '../user-story-status-to-do.model';
import { UserStoryStatusToDoService } from '../service/user-story-status-to-do.service';

@Component({
  selector: 'jhi-user-story-status-to-do-update',
  templateUrl: './user-story-status-to-do-update.component.html',
})
export class UserStoryStatusToDoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    userId: [null, [Validators.required]],
    statusState: [null, [Validators.required]],
  });

  constructor(
    protected userStoryStatusService: UserStoryStatusToDoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userStoryStatus }) => {
      this.updateForm(userStoryStatus);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userStoryStatus = this.createFromForm();
    if (userStoryStatus.id !== undefined) {
      this.subscribeToSaveResponse(this.userStoryStatusService.update(userStoryStatus));
    } else {
      this.subscribeToSaveResponse(this.userStoryStatusService.create(userStoryStatus));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserStoryStatusToDo>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userStoryStatus: IUserStoryStatusToDo): void {
    this.editForm.patchValue({
      id: userStoryStatus.id,
      userId: userStoryStatus.userId,
      statusState: userStoryStatus.statusState,
    });
  }

  protected createFromForm(): IUserStoryStatusToDo {
    return {
      ...new UserStoryStatusToDo(),
      id: this.editForm.get(['id'])!.value,
      userId: this.editForm.get(['userId'])!.value,
      statusState: this.editForm.get(['statusState'])!.value,
    };
  }
}
