jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IUserStoryStatusToDo, UserStoryStatusToDo } from '../user-story-status-to-do.model';
import { UserStoryStatusToDoService } from '../service/user-story-status-to-do.service';

import { UserStoryStatusToDoRoutingResolveService } from './user-story-status-to-do-routing-resolve.service';

describe('Service Tests', () => {
  describe('UserStoryStatusToDo routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: UserStoryStatusToDoRoutingResolveService;
    let service: UserStoryStatusToDoService;
    let resultUserStoryStatusToDo: IUserStoryStatusToDo | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(UserStoryStatusToDoRoutingResolveService);
      service = TestBed.inject(UserStoryStatusToDoService);
      resultUserStoryStatusToDo = undefined;
    });

    describe('resolve', () => {
      it('should return IUserStoryStatusToDo returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserStoryStatusToDo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserStoryStatusToDo).toEqual({ id: 123 });
      });

      it('should return new IUserStoryStatusToDo if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserStoryStatusToDo = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultUserStoryStatusToDo).toEqual(new UserStoryStatusToDo());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as UserStoryStatusToDo })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserStoryStatusToDo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserStoryStatusToDo).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
