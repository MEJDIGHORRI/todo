import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserStoryStatusToDoComponent } from '../list/user-story-status-to-do.component';
import { UserStoryStatusToDoDetailComponent } from '../detail/user-story-status-to-do-detail.component';
import { UserStoryStatusToDoUpdateComponent } from '../update/user-story-status-to-do-update.component';
import { UserStoryStatusToDoRoutingResolveService } from './user-story-status-to-do-routing-resolve.service';

const userStoryStatusRoute: Routes = [
  {
    path: '',
    component: UserStoryStatusToDoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserStoryStatusToDoDetailComponent,
    resolve: {
      userStoryStatus: UserStoryStatusToDoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserStoryStatusToDoUpdateComponent,
    resolve: {
      userStoryStatus: UserStoryStatusToDoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserStoryStatusToDoUpdateComponent,
    resolve: {
      userStoryStatus: UserStoryStatusToDoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userStoryStatusRoute)],
  exports: [RouterModule],
})
export class UserStoryStatusToDoRoutingModule {}
