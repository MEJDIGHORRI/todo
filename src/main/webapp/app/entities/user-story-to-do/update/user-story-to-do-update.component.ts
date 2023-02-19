import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IUserStoryToDo, UserStoryToDo } from '../user-story-to-do.model';
import { UserStoryToDoService } from '../service/user-story-to-do.service';

@Component({
  selector: 'jhi-user-story-to-do-update',
  templateUrl: './user-story-to-do-update.component.html',
})
export class UserStoryToDoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    description: [],
  });

  constructor(protected userStoryService: UserStoryToDoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userStory }) => {
      this.updateForm(userStory);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userStory = this.createFromForm();
    if (userStory.id !== undefined) {
      this.subscribeToSaveResponse(this.userStoryService.update(userStory));
    } else {
      this.subscribeToSaveResponse(this.userStoryService.create(userStory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserStoryToDo>>): void {
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

  protected updateForm(userStory: IUserStoryToDo): void {
    this.editForm.patchValue({
      id: userStory.id,
      title: userStory.title,
      description: userStory.description,
    });
  }

  protected createFromForm(): IUserStoryToDo {
    return {
      ...new UserStoryToDo(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
