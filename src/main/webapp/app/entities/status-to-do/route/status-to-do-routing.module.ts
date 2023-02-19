import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StatusToDoComponent } from '../list/status-to-do.component';
import { StatusToDoDetailComponent } from '../detail/status-to-do-detail.component';
import { StatusToDoUpdateComponent } from '../update/status-to-do-update.component';
import { StatusToDoRoutingResolveService } from './status-to-do-routing-resolve.service';

const statusRoute: Routes = [
  {
    path: '',
    component: StatusToDoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StatusToDoDetailComponent,
    resolve: {
      status: StatusToDoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StatusToDoUpdateComponent,
    resolve: {
      status: StatusToDoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StatusToDoUpdateComponent,
    resolve: {
      status: StatusToDoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(statusRoute)],
  exports: [RouterModule],
})
export class StatusToDoRoutingModule {}
