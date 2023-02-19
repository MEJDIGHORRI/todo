import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IStatusToDo, StatusToDo } from '../status-to-do.model';
import { StatusToDoService } from '../service/status-to-do.service';
import { IUserStoryToDo } from 'app/entities/user-story-to-do/user-story-to-do.model';
import { UserStoryToDoService } from 'app/entities/user-story-to-do/service/user-story-to-do.service';

@Component({
  selector: 'jhi-status-to-do-update',
  templateUrl: './status-to-do-update.component.html',
})
export class StatusToDoUpdateComponent implements OnInit {
  isSaving = false;

  userStoriesCollection: IUserStoryToDo[] = [];

  editForm = this.fb.group({
    id: [],
    state: [null, [Validators.required]],
    userStory: [],
  });

  constructor(
    protected statusService: StatusToDoService,
    protected userStoryService: UserStoryToDoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ status }) => {
      this.updateForm(status);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const status = this.createFromForm();
    if (status.id !== undefined) {
      this.subscribeToSaveResponse(this.statusService.update(status));
    } else {
      this.subscribeToSaveResponse(this.statusService.create(status));
    }
  }

  trackUserStoryToDoById(index: number, item: IUserStoryToDo): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStatusToDo>>): void {
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

  protected updateForm(status: IStatusToDo): void {
    this.editForm.patchValue({
      id: status.id,
      state: status.state,
      userStory: status.userStory,
    });

    this.userStoriesCollection = this.userStoryService.addUserStoryToDoToCollectionIfMissing(this.userStoriesCollection, status.userStory);
  }

  protected loadRelationshipsOptions(): void {
    this.userStoryService
      .query({ filter: 'status-is-null' })
      .pipe(map((res: HttpResponse<IUserStoryToDo[]>) => res.body ?? []))
      .pipe(
        map((userStories: IUserStoryToDo[]) =>
          this.userStoryService.addUserStoryToDoToCollectionIfMissing(userStories, this.editForm.get('userStory')!.value)
        )
      )
      .subscribe((userStories: IUserStoryToDo[]) => (this.userStoriesCollection = userStories));
  }

  protected createFromForm(): IStatusToDo {
    return {
      ...new StatusToDo(),
      id: this.editForm.get(['id'])!.value,
      state: this.editForm.get(['state'])!.value,
      userStory: this.editForm.get(['userStory'])!.value,
    };
  }
}
