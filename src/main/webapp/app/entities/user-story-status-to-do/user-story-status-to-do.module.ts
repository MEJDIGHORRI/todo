import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserStoryStatusToDoComponent } from './list/user-story-status-to-do.component';
import { UserStoryStatusToDoDetailComponent } from './detail/user-story-status-to-do-detail.component';
import { UserStoryStatusToDoUpdateComponent } from './update/user-story-status-to-do-update.component';
import { UserStoryStatusToDoDeleteDialogComponent } from './delete/user-story-status-to-do-delete-dialog.component';
import { UserStoryStatusToDoRoutingModule } from './route/user-story-status-to-do-routing.module';

@NgModule({
  imports: [SharedModule, UserStoryStatusToDoRoutingModule],
  declarations: [
    UserStoryStatusToDoComponent,
    UserStoryStatusToDoDetailComponent,
    UserStoryStatusToDoUpdateComponent,
    UserStoryStatusToDoDeleteDialogComponent,
  ],
  entryComponents: [UserStoryStatusToDoDeleteDialogComponent],
})
export class UserStoryStatusToDoModule {}
