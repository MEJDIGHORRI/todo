import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-story-to-do',
        data: { pageTitle: 'toDoApp.userStory.home.title' },
        loadChildren: () => import('./user-story-to-do/user-story-to-do.module').then(m => m.UserStoryToDoModule),
      },
      {
        path: 'status-to-do',
        data: { pageTitle: 'toDoApp.status.home.title' },
        loadChildren: () => import('./status-to-do/status-to-do.module').then(m => m.StatusToDoModule),
      },
      {
        path: 'user-story-status-to-do',
        data: { pageTitle: 'toDoApp.userStoryStatus.home.title' },
        loadChildren: () => import('./user-story-status-to-do/user-story-status-to-do.module').then(m => m.UserStoryStatusToDoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
