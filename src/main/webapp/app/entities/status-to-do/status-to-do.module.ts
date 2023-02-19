import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StatusToDoComponent } from './list/status-to-do.component';
import { StatusToDoDetailComponent } from './detail/status-to-do-detail.component';
import { StatusToDoUpdateComponent } from './update/status-to-do-update.component';
import { StatusToDoDeleteDialogComponent } from './delete/status-to-do-delete-dialog.component';
import { StatusToDoRoutingModule } from './route/status-to-do-routing.module';

@NgModule({
  imports: [SharedModule, StatusToDoRoutingModule],
  declarations: [StatusToDoComponent, StatusToDoDetailComponent, StatusToDoUpdateComponent, StatusToDoDeleteDialogComponent],
  entryComponents: [StatusToDoDeleteDialogComponent],
})
export class StatusToDoModule {}
