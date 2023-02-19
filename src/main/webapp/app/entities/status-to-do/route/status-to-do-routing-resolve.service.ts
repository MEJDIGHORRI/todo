import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStatusToDo, StatusToDo } from '../status-to-do.model';
import { StatusToDoService } from '../service/status-to-do.service';

@Injectable({ providedIn: 'root' })
export class StatusToDoRoutingResolveService implements Resolve<IStatusToDo> {
  constructor(protected service: StatusToDoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStatusToDo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((status: HttpResponse<StatusToDo>) => {
          if (status.body) {
            return of(status.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new StatusToDo());
  }
}
