import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserStoryToDo, UserStoryToDo } from '../user-story-to-do.model';
import { UserStoryToDoService } from '../service/user-story-to-do.service';

@Injectable({ providedIn: 'root' })
export class UserStoryToDoRoutingResolveService implements Resolve<IUserStoryToDo> {
  constructor(protected service: UserStoryToDoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserStoryToDo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userStory: HttpResponse<UserStoryToDo>) => {
          if (userStory.body) {
            return of(userStory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserStoryToDo());
  }
}
