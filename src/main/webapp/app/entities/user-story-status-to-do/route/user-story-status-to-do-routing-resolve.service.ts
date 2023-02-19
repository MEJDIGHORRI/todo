import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserStoryStatusToDo, UserStoryStatusToDo } from '../user-story-status-to-do.model';
import { UserStoryStatusToDoService } from '../service/user-story-status-to-do.service';

@Injectable({ providedIn: 'root' })
export class UserStoryStatusToDoRoutingResolveService implements Resolve<IUserStoryStatusToDo> {
  constructor(protected service: UserStoryStatusToDoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserStoryStatusToDo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userStoryStatus: HttpResponse<UserStoryStatusToDo>) => {
          if (userStoryStatus.body) {
            return of(userStoryStatus.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserStoryStatusToDo());
  }
}
