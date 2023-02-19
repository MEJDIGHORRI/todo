import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserStoryToDoComponent } from './list/user-story-to-do.component';
import { UserStoryToDoDetailComponent } from './detail/user-story-to-do-detail.component';
import { UserStoryToDoUpdateComponent } from './update/user-story-to-do-update.component';
import { UserStoryToDoDeleteDialogComponent } from './delete/user-story-to-do-delete-dialog.component';
import { UserStoryToDoRoutingModule } from './route/user-story-to-do-routing.module';

@NgModule({
  imports: [SharedModule, UserStoryToDoRoutingModule],
  declarations: [UserStoryToDoComponent, UserStoryToDoDetailComponent, UserStoryToDoUpdateComponent, UserStoryToDoDeleteDialogComponent],
  entryComponents: [UserStoryToDoDeleteDialogComponent],
})
export class UserStoryToDoModule {}
