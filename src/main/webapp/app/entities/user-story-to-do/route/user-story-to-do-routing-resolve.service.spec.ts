jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IUserStoryToDo, UserStoryToDo } from '../user-story-to-do.model';
import { UserStoryToDoService } from '../service/user-story-to-do.service';

import { UserStoryToDoRoutingResolveService } from './user-story-to-do-routing-resolve.service';

describe('Service Tests', () => {
  describe('UserStoryToDo routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: UserStoryToDoRoutingResolveService;
    let service: UserStoryToDoService;
    let resultUserStoryToDo: IUserStoryToDo | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(UserStoryToDoRoutingResolveService);
      service = TestBed.inject(UserStoryToDoService);
      resultUserStoryToDo = undefined;
    });

    describe('resolve', () => {
      it('should return IUserStoryToDo returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserStoryToDo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserStoryToDo).toEqual({ id: 123 });
      });

      it('should return new IUserStoryToDo if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserStoryToDo = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultUserStoryToDo).toEqual(new UserStoryToDo());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as UserStoryToDo })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultUserStoryToDo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultUserStoryToDo).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
