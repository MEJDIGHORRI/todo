jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IStatusToDo, StatusToDo } from '../status-to-do.model';
import { StatusToDoService } from '../service/status-to-do.service';

import { StatusToDoRoutingResolveService } from './status-to-do-routing-resolve.service';

describe('Service Tests', () => {
  describe('StatusToDo routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: StatusToDoRoutingResolveService;
    let service: StatusToDoService;
    let resultStatusToDo: IStatusToDo | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(StatusToDoRoutingResolveService);
      service = TestBed.inject(StatusToDoService);
      resultStatusToDo = undefined;
    });

    describe('resolve', () => {
      it('should return IStatusToDo returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultStatusToDo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultStatusToDo).toEqual({ id: 123 });
      });

      it('should return new IStatusToDo if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultStatusToDo = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultStatusToDo).toEqual(new StatusToDo());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as StatusToDo })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultStatusToDo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultStatusToDo).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
