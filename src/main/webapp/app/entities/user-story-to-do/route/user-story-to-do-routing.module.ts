import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserStoryToDoComponent } from '../list/user-story-to-do.component';
import { UserStoryToDoDetailComponent } from '../detail/user-story-to-do-detail.component';
import { UserStoryToDoUpdateComponent } from '../update/user-story-to-do-update.component';
import { UserStoryToDoRoutingResolveService } from './user-story-to-do-routing-resolve.service';

const userStoryRoute: Routes = [
  {
    path: '',
    component: UserStoryToDoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserStoryToDoDetailComponent,
    resolve: {
      userStory: UserStoryToDoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserStoryToDoUpdateComponent,
    resolve: {
      userStory: UserStoryToDoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserStoryToDoUpdateComponent,
    resolve: {
      userStory: UserStoryToDoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userStoryRoute)],
  exports: [RouterModule],
})
export class UserStoryToDoRoutingModule {}
